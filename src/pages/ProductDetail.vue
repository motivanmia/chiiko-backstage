<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  import TheHeader from '@/components/common/TheHeader.vue';
  import Table from '@/components/Table.vue';
  import { ingredients } from '@/constants/ingredients.js';

  // 編輯器
  import { QuillEditor } from '@vueup/vue-quill';

  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  const route = useRoute();

  /** —— 表頭定義 —— */
  const ingredientInfoColumns = ref([
    { prop: 'productId', label: '商品編號', width: 140 },
    { prop: 'productCategory', label: '商品分類', width: 140 },
    { prop: 'productImage', label: '商品預覽圖片', type: 'image' },
    { prop: 'productName', label: '商品名稱', width: 200 },
    { prop: 'productPrice', label: '單價', width: 100 },
    { prop: 'productStatus', label: '商品狀態', type: 'status', width: 100 },
  ]);

  /** —— 資料 —— */
  const ingredientInfoData = ref([]); // 第一張表
  const productImages = ref([]); // 左側圖片
  const preservationText = ref(''); // 右側內文
  const fileInput = ref(null);
  const textEditor = ref(null);

  onMounted(() => {
    const id = route.params.id;
    const product = ingredients.find((p) => p.id === id);
    if (!product) return;

    // 商品基本資訊（第一張表）
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
  const triggerFileSelect = () => {
    fileInput.value.click();
  };
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
    { img: null }, // 預設有一顆按鈕（img=null 表示還沒選檔案）
  ]);

  // 點選檔案
  const onSelectFile = (event, index) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      // 把圖塞進 uploadList 對應的位置
      uploadList.value[index].img = e.target.result;

      // 如果是最後一顆按鈕，選完後再新增一顆空的
      if (index === uploadList.value.length - 1) {
        uploadList.value.push({ img: null });
      }
    };
    reader.readAsDataURL(file);

    // 清掉 input.value，避免選同一張圖時不觸發
    event.target.value = '';
  };
  const removeImage = (index) => {
    uploadList.value.splice(index, 1);
  };
</script>

<template>
  <div class="ingredient-board">
    <div class="ingredient-board__manage">
      <TheHeader
        title="商品編輯"
        :show-increase-button="false"
      />
    </div>

    <!-- 第一張表格 -->
    <div class="ingredient-board__contents">
      <Table
        :table-data="ingredientInfoData"
        :columns="ingredientInfoColumns"
      />
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
          <button class="select-btn">選擇擇定</button>
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

  /* 隱藏原本 el-table 的 body wrapper */
  :deep(.el-table__body-wrapper) {
    display: none;
  }
</style>
