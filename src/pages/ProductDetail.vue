<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import switch_el from "@/components/Switch.vue";
  import TheDetailHeader from '@/components/common/TheDetailHeader.vue';
  import Table from '@/components/Table.vue';
  // import { ingredients } from '@/constants/ingredients.js';
  

  // 編輯器
  import { QuillEditor } from '@vueup/vue-quill';

  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  import axios from 'axios';
  const categories = ref([
  { id: 1, name: '烤箱/氣炸鍋' },
  { id: 2, name: '鍋鏟/鍋具' },
  { id: 3, name: '刀具/砧板' },
  { id: 4, name: '廚房小物' },
]);
function toUrlEncoded(obj) {
  return Object.keys(obj)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&');
}
  const selectedCategory = ref("");
  const API_BASE = import.meta.env.VITE_API_BASE;

  
const isNew = ref(true)
  const route = useRoute();
  const router = useRouter();
  const row = ref({
  number: "P0000011",
  status: true, // true=上架, false=下架
});
// 切換狀態的事件
function updateStatus(number, newStatus) {
  console.log("更新商品", number, "狀態：", newStatus);
}

  /** —— 資料 —— */
  const productImages = ref([]); // 左側圖片
  const preservationText = ref(''); // 右側內文
  const textEditor = ref(null);
  const selectedProduct = ref(null);
  const productName = ref('');
  const productPrice = ref('');
  const productStatus = ref(true);
  

  onMounted(() => {
  const id = route.params.id;
  // const product = ingredients.find((p) => p.id === id); // 用你的商品陣列
  if (!product) return;

  // 把找到的商品資料暫存到 selectedProduct
  selectedProduct.value = product;

  // 更新表格資料
  ingredientInfoData.value = [
    {
      productId: product.id,
      productCategory: product.category,
      productImage: product.img?.[0] || '',
      productName: product.name,
      productPrice: product.price,
      productStatus: product.status ?? '上架',
    },
  ];

  // 左側圖片
  productImages.value = product.img || [];

  // 右側內文
  preservationText.value = product.preservation || '';
});

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (!files.length) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '6px';
        textEditor.value.appendChild(img);
        textEditor.value.appendChild(document.createElement('br'));
      };
      reader.readAsDataURL(file);
    });

    // 清空 input 以便再次上傳同樣的檔案
    event.target.value = '';
  };

const uploadList = ref([
  { img: null, file: null }, // 新增 file 屬性
]);

  // 點選檔案
 const onSelectFile = (event, index) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadList.value[index].img = e.target.result; // 顯示用
    uploadList.value[index].file = file;           // 真正上傳用

    // 如果是最後一顆按鈕，選完後再新增一顆空的
    if (index === uploadList.value.length - 1) {
      uploadList.value.push({ img: null, file: null });
    }
  };
  reader.readAsDataURL(file);

  event.target.value = '';
};

  const removeImage = (index) => {
    uploadList.value.splice(index, 1);
  };

  async function onCreate() {
  if (!productName.value || !selectedCategory.value || !productPrice.value) {
    ElMessage.warning('請填寫完整商品資料');
    return;
  }
  console.log(uploadList.value[0].file);
  const formData = new FormData();
  formData.append('name', productName.value);
  formData.append('product_category_id', selectedCategory.value);
  formData.append('unit_price', productPrice.value);
  formData.append('is_active', productStatus.value ? 1 : 0);
  formData.append('product_info', productStatus.value);
  formData.append('product_notes', '12345');
 // 先空值，不上傳圖片
  formData.append('preview_image', new Blob([uploadList.value[0].file]), 'preview.png');
  // formData.append('product_image[]', new Blob([]), '');
  // formData.append('content_image[]', new Blob([]), '');

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE}/product/post_product.php`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log(res);
    if (res.data.status === 'success') {
      console.log(res)
      ElMessage.success('商品新增成功');
      router.push({ name: 'product' });
    } else {
      throw new Error(res.data.message || '新增失敗');
    }
  } catch (err) {
    console.error(err);
    ElMessage.error(err.message || '新增失敗');
  }
}

  async function onSave() {
    if (isNew.value) {
      ElMessage.warning('目前為新增模式，請用「新增」按鈕');
      return;
    }

    try {
      // 1) 若有本地新圖，先上傳，rows 會被換成 server 檔名
      await uploadImagesIfNeeded();

      // 2) 新舊比較
      const cur = buildPayload();
      if (!cur.ingredient_id) throw new Error('缺少 ingredient_id');
      const rawDiff = diffPayload(originalPayload.value, cur);

      // 3) 沒變更就跳出
      const keys = Object.keys(rawDiff).filter((k) => k !== 'ingredient_id');
      if (keys.length === 0) {
        ElMessage.info('沒有任何變更');
        return;
      }

      // 4) 依後端鍵名轉換並送出
      const patchBody = { ingredient_id: String(cur.ingredient_id) };
      if ('category_id' in rawDiff) {
        patchBody.ingredients_category_id = Number(rawDiff.category_id) || 0;
      }
      if ('name' in rawDiff) patchBody.name = rawDiff.name;
      if ('status' in rawDiff) patchBody.status = String(rawDiff.status ?? '0');
      if ('storage_method' in rawDiff) patchBody.storage_method = rawDiff.storage_method;
      if ('images' in rawDiff) patchBody.image = rawDiff.images; // 後端期望 image
      if ('content' in rawDiff) patchBody.content = rawDiff.content; // 有變才帶

      const url = `${import.meta.env.VITE_API_BASE}/school/patch_ingredient.php`;
      await requestPatch(url, patchBody);

      // 5) 成功後更新快照
      originalPayload.value = cur;
      ElMessage.success('已更新');
    } catch (e) {
      console.error(e);
      ElMessage.error(e.message || '更新失敗');
    }
  }

  async function onCancel() {
    router.push({ name: 'product' });
  }
</script>

<template>
  
  <div class="ingredient-board">
    <div class="ingredient-board__manage">
      <TheDetailHeader
        title="商品管理"
        @create="onCreate"
        @save="onSave"
        @cancel="onCancel"
        :buttons="isNew ? ['create', 'cancel'] : ['save', 'cancel']"
      />
    </div>

    <!-- 第一張表格 -->
    <div class="ingredient-board__contents">
      <table class="product-detail-table">
        <thead>
          <tr class="product-detail-tr">
            <th class="product-detail-th-frist">商品編號</th>
            <th>商品分類</th>
            <th>商品瀏覽圖片</th>
            <th>商品名稱</th>
            <th>單價</th>
            <th class="product-detail-th-last">商品狀態</th>
          </tr>
        </thead>
        <tbody class="product-detail-tbody">
          <tr>
            <td>P0000011</td>
            <td><el-select v-model="selectedCategory" placeholder="請選擇">
  <el-option
    v-for="c in categories"
    :key="c.id"
    :label="c.name"
    :value="c.id"
  />
</el-select></td>
            <td><img 
                  v-if="uploadList[0]?.img" 
                  :src="uploadList[0].img" 
                  alt="商品圖片" 
                  style="max-width: 100%; border-radius: 6px;" 
              /></td>
            <td><input v-model="productName"></input></td>
            <td><div class="input-with-prefix">
                    <span style="margin-right: 4px;">$</span>
                    <input v-model="productPrice" type="text" style="width: 90px;" />
                  </div>
              </td>
            <td> 
              <switch_el
                v-model="row.status"
                yes="上架"
                no="下架"
                @toggle="(v) => updateStatus(row.number, v)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <Table
        :table-data="ingredientInfoData"
        :columns="ingredientInfoColumns"
      /> -->
    </div>

    <!-- 第二張表：拆成左右兩個 -->
    <div class="ingredient-board__contents ingredient-board__contents--split">
      <div class="product-detail-range">
        <!-- 左 -->
        <div class="product-detail-block product-detail-title-left">
          <div class="product-detail-title">商品圖片</div>
          <div class="product-detail-body">
            <!-- 匯入圖片按鈕（改成多組圖片+按鈕） -->
            <div class="upload-section">
              <div
                v-for="(item, index) in uploadList"
                :key="index"
                class="upload-row"
              >
                <!-- 左邊圖片 -->
                <div
                  v-if="item.img"
                  class="preview"
                >
                  <img
                    :src="item.img"
                    alt="已選圖片"
                  />
                  <!-- 刪除按鈕 -->
                  <button
                    class="delete-btn"
                    @click="removeImage(index)"
                  >
                    刪除
                  </button>
                </div>

                <!-- 右邊按鈕 -->
                <div class="import-btn-wrapper">
                  <button @click="$refs[`fileInput${index}`][0].click()">選擇檔案</button>
                  <input
                    :ref="`fileInput${index}`"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="(e) => onSelectFile(e, index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右 -->
        <div class="product-detail-block product-detail-title-right">
          <div class="product-detail-title">商品內文編輯</div>
          <div class="product-detail-body">
            <!-- 右側文字編輯 -->
            <div>
              <QuillEditor
                class="product-detail-editor"
                v-model="preservationText"
                :theme="'snow'"
                placeholder="輸入商品內文..."
                style="height: 630px; background: white; border-radius: 5px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 主體 -->
  <div class="ingredient-board__guide-body">
    <!-- 左側圖片滾動區 -->
    <div class="ingredient-board__images-wrapper">
      <div class="ingredient-board__images">
        <div
          v-for="(img, index) in productImages"
          :key="index"
          class="ingredient-board__image"
        >
          <img
            :src="img"
            alt="商品圖片"
          />
          <!-- <button class="select-btn">選擇擇定</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  /* 左右文字區 */
  .ingredient-board__text-wrapper {
    height: 100%;
  }

  .ingredient-board__text-wrapper textarea {
    width: 100%;
    height: 100%;
    padding: 12px;
    font-size: 14px;
    border-radius: 6px;
    resize: vertical;
    overflow-y: auto;
  }

  .product-detail-range {
    display: flex;
    width: 100%;
    gap: 2%;
  }
  .product-detail-block {
  }
  .product-detail-title {
    border-radius: 5px;
    background: #d6b59c;
    color: #ffffff;
    height: 50px;
    display: flex;
    align-items: center;
    vertical-align: middle;
    justify-content: center;
  }
  .product-detail-title-left {
    width: 30%;
  }

  .product-detail-title-right {
    width: 68%;
  }

  .product-detail-editor {
    background: #ffffff;
  }

.product-detail-table {
  width: 100%;
  border-collapse: collapse;  /* 合併邊框 */
  table-layout: fixed;        /* 固定列寬，保持對齊 */
}

.product-detail-table th,
.product-detail-table td {
  padding: 12px;
  text-align: center;       /* 水平置中 */
  vertical-align: middle;   /* 垂直置中 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;      /* 避免文字換行 */
}

.product-detail-th-frist {
  border-top-left-radius: 5px;
}

.product-detail-th-last {
  border-top-right-radius: 5px;
}

.product-detail-tbody td input,
.product-detail-tbody td select,
.product-detail-tbody td img {
  width: 100%;
  display: inline-block;    
  vertical-align: middle;
  max-height: 70px;         
  border-radius: 8px;         
  outline: none;          
  background-color: #fff; 
  box-shadow: none;    
  border: 1px solid #ddd   
}
.product-detail-tbody td input,
.product-detail-tbody td select {
   padding: 6px 12px;         /* 上下10px、左右12px */
  height: auto; 
}

  .product-detail-tr{
    border-radius: 5px;
    background: #d6b59c;
    color: #ffffff;
  }
  .product-detail-tr th{
    padding: 13px;
  }
  .product-detail-table th td{
    vertical-align: middle;
    align-items: center;
  }
  .product-detail-table {
      width: 100%;
      border-collapse: separate; /* 重要：要分離，不然 radius 不會生效 */
      border-spacing: 0;
      
      overflow: hidden; /* 確保超出的圓角被裁掉 */
  }
  .product-detail-th-frist{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .product-detail-th-last{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  /* 刪除按鈕 */
  .delete-btn {
    position: absolute;
    margin-left: 8px;
    padding: 2px 6px;
    font-size: 12px;
    color: #fff;
    background: #f56c6c;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #d43f3a;
    }
  }

  /* 上傳區 */
  .upload-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }

  .upload-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 30px;
  }

  .preview {
    position: relative;
    display: inline-block;

    img {
      width: 150px;
      border-radius: 6px;
      border: 1px solid #ddd;
      display: block;
    }
  }

  .import-btn-wrapper {
    display: flex;
    flex-direction: column;
    gap: 60px;
    margin-top: 30px;
  }

  .import-btn-wrapper button {
    padding: 6px 12px;
    margin-left: 10px;
    border: 1px solid #d6b59c;
    background: #fefbf1;
    border-radius: 20px;
    color: #d97c48;
    cursor: pointer;

    &:hover {
      background: #d97c48;
      color: #fefbf1;
    }
  }

  /* Guide 區塊 header */
  .ingredient-board__guide {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ingredient-board__guide-header {
    display: grid;
    grid-template-columns: 200px 1fr;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 6px 6px 0 0;

    .header-cell {
      padding: 8px;
      font-weight: bold;
      text-align: center;
      border-right: 1px solid #ddd;

      &:last-child {
        border-right: none;
      }
    }
  }

  /* 第二張表左右拆分 */
  .ingredient-board__contents--split {
    display: flex;
    gap: 16px;
    margin-top: 20px;
    align-items: stretch;
  }

  /* 單張圖片區塊 */
  .ingredient-board__image {
    img {
      width: 100%;
      border-radius: 6px;
      border: 1px solid #ddd;
    }

    .select-btn {
      margin-top: 6px;
      width: 100%;
      padding: 4px 0;
      font-size: 14px;
      background: #f5f5f5;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }

  /* 主體區塊，左右排版 */
  .ingredient-board__guide-body {
    display: flex;
    gap: 16px;
    height: 600px;
    border-radius: 0 0 6px 6px;
    padding: 12px;

    /* 左側圖片滾動區 */
    .ingredient-board__images-wrapper {
      width: 200px;
      height: 100%;
      overflow-y: auto;
    }

    .ingredient-board__images {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: none; /* 防止撐開父容器 */
    }

    /* 右側文字編輯區 */
    .ingredient-board__text-wrapper {
      flex: 1; /* 撐滿剩餘空間 */
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding-left: 0; /* 與左邊表格對齊 */
    }

    .ingredient-board__text-wrapper textarea {
      width: 100%;
      height: 100%;
      padding: 12px;
      font-size: 14px;
      border-radius: 6px;
      resize: vertical;
      overflow-y: auto;
    }
  }
</style>
