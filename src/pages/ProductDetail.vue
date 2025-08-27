<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import Table from '@/components/Table.vue';
  import TheDetailHeader from '@/components/common/TheDetailHeader.vue';
  import {
    getProducts,
    patchProducts,
    uploadImage,
    getProductsCategory,
    createProducts,
  } from '@/api/fetch';
  import { useToastStore } from '@/stores/Toast';

  const toastStore = useToastStore();
  const { showToast } = toastStore;

  const route = useRoute();
  const router = useRouter();

  // 編輯器
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  // 新增一個 ref 來儲存產品分類清單
  const categoryList = ref([]);
  const isNew = ref(false);

  const productInfoColumns = ref([
    { prop: 'product_id', label: '商品編號', width: 200 },
    {
      prop: 'category_name',
      label: '商品分類',
      width: 250,
      type: 'select',
    },
    { prop: 'preview_image', label: '商品預覽圖片', type: 'image' },
    { prop: 'name', label: '商品名稱', type: 'text-edit' },
    { prop: 'unit_price', label: '單價', type: 'text-edit', width: 250 },
  ]);

  const productInfoData = ref([]);
  const productInfoContent = ref('');
  const productQuillContent = ref('');
  // 移除 ref，改為直接儲存編輯器實例
  const productInfoEditorInstance = ref(null);
  const productQuillEditorInstance = ref(null);

  function buildDetailForNew() {
    productInfoData.value = [
      {
        product_id: '',
        product_category_id: '',
        preview_image: '',
        name: '',
        unit_price: '',
      },
    ];
    productInfoContent.value = '';
    productQuillContent.value = '';
  }

  function buildDetail(found) {
    if (!found) return;

    const formatTextToHtml = (text) => {
      if (!text) return '';
      return text.replace(/(\r\n|\n)/g, '<br>');
    };

    const formatImagesToHtml = (imageUrls) => {
      if (!Array.isArray(imageUrls) || imageUrls.length === 0) return '';
      const imagesHtml = imageUrls.map((url) => `<p><img src="${url}"/></p>`).join('');
      return imagesHtml;
    };

    const infoTextHtml = formatTextToHtml(found.product_info);
    const infoImagesHtml = formatImagesToHtml(found.product_images);
    productInfoContent.value = infoTextHtml + infoImagesHtml;

    const notesTextHtml = formatTextToHtml(found.product_notes);
    const contentImagesHtml = formatImagesToHtml(found.content_images);
    productQuillContent.value = notesTextHtml + contentImagesHtml;

    const previewImageUrl =
      found.product_images && found.product_images.length > 0 ? found.product_images[0] : '';

    console.log('當前商品的分類 ID:', found.product_category_id);
    console.log('所有分類的清單:', categoryList.value);

    // 從 categoryList 中尋找對應的分類物件
    const category = categoryList.value.find(
      (c) => String(c.product_category_id) === String(found.product_category_id),
    );

    // 檢查是否找到分類，然後賦予其名稱
    const categoryName = category ? category.name : '';

    productInfoData.value = [
      {
        product_id: found.product_id,
        product_category_id: found.product_category_id,
        category_name: categoryName,
        name: found.name,
        unit_price: found.unit_price,
        preview_image: previewImageUrl,
      },
    ];
  }

  onMounted(async () => {
    const id = String(route.params.id ?? '');
    isNew.value = id === 'new';

    try {
      const categoryResponse = await getProductsCategory();
      if (categoryResponse.data && categoryResponse.data.status === 'success') {
        categoryList.value = categoryResponse.data.data;

        // ✨ 在這裡動態更新 productInfoColumns，加入 options 屬性 ✨
        productInfoColumns.value = [
          { prop: 'product_id', label: '商品編號', width: 200 },
          {
            prop: 'product_category_id', // 更改此處為 product_category_id 以綁定正確的 value
            label: '商品分類',
            width: 250,
            type: 'select',
            // 將 categoryList 轉換成 select 元件需要的格式
            options: categoryList.value.map((c) => ({
              value: c.product_category_id,
              label: c.name,
            })),
          },
          { prop: 'preview_image', label: '商品預覽圖片', type: 'image' },
          { prop: 'name', label: '商品名稱', type: 'text-edit' },
          { prop: 'unit_price', label: '單價', type: 'text-edit', width: 250 },
        ];

        if (id === 'new') {
          buildDetailForNew();
        } else {
          const response = await getProducts();
          if (response.data.status === 'success' && Array.isArray(response.data.data)) {
            const foundProduct = response.data.data.find((item) => String(item.product_id) === id);

            if (foundProduct) {
              buildDetail(foundProduct);
            } else {
              showToast('找不到該商品，已導向回列表頁。');
              router.push({ name: 'product' });
            }
          } else {
            console.error('API 錯誤: 回傳資料格式不正確或為空');
            showToast('無法載入商品資料。');
            router.push({ name: 'product' });
          }
        }
      } else {
        console.error('無法載入分類清單:', categoryResponse.data.message);
        showToast('無法載入分類資料，請稍後再試。');
      }
    } catch (error) {
      console.error('取得資料時發生錯誤:', error);
      showToast('無法連接到伺服器。');
    }
  });

  // 圖片上傳處理器
  function imageHandler(editor) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const responseData = await uploadImage(file);

          if (
            responseData.data &&
            responseData.data.status === 'success' &&
            responseData.data.url
          ) {
            const imageUrl = responseData.data.url;

            // 修正：在插入圖片前檢查 range 是否有效
            let range = editor.getSelection(true);
            if (range) {
              editor.insertEmbed(range.index, 'image', imageUrl);
            } else {
              // 如果沒有選取範圍，則將圖片插入到文件結尾
              editor.insertEmbed(editor.getLength(), 'image', imageUrl);
            }
          } else {
            console.error('上傳失敗');
          }
        } catch (error) {
          console.error('上傳圖片時發生錯誤:', error);
        }
      }
    };
  }

  function formatHtmlToText(html) {
    if (!html) return '';
    let text = html.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '');
    return text.trim();
  }

  async function onSave() {
    try {
      const tableData = productInfoData.value[0];
      const id = tableData.product_id;

      if (!id || id === 'new') {
        showToast('無法儲存新增的商品，請使用建立按鈕。');
        return;
      }

      const fullImageUrl = tableData.preview_image;
      let imageFilename = '';

      if (fullImageUrl) {
        const urlParts = fullImageUrl.split('/');
        imageFilename = urlParts[urlParts.length - 1];
      }

      // 這裡直接使用編輯器中的完整 HTML 內容
      const productInfoHtml = productInfoContent.value;
      const productQuillHtml = productQuillContent.value;

      const payload = {
        product_id: tableData.product_id,
        product_category_id: tableData.product_category_id,
        preview_image: imageFilename,
        name: tableData.name,
        unit_price: tableData.unit_price,
        status: tableData.status,
        // 傳送完整的 HTML 內容
        product_info: productInfoHtml,
        product_notes: productQuillHtml,
      };

      const response = await patchProducts(id, payload);

      if (response.data && response.data.status === 'success') {
        showToast('商品資料儲存成功！');
      } else {
        throw new Error(response.data.message || '儲存失敗');
      }
    } catch (error) {
      console.error('儲存時發生錯誤:', error);
      showToast(`儲存失敗：${error.message}`);
    }
  }

  function extractFirstImageFilename(html) {
    if (!html) return '';
    // 使用正則表達式尋找第一個 <img> 標籤的 src 屬性
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    if (match && match[1]) {
      const fullUrl = match[1];
      // 提取檔案名稱（路徑的最後一個部分）
      const urlParts = fullUrl.split('/');
      return urlParts[urlParts.length - 1];
    }
    return '';
  }

  async function onCreate() {
    try {
      const tableData = productInfoData.value[0];

      if (!tableData.name || !tableData.product_category_id || !tableData.unit_price) {
        showToast('請填寫所有必填欄位：商品名稱、分類、單價。');
        return;
      }

      // ✨ 呼叫輔助函式來取得預覽圖的檔案名稱
      let previewImageFilename = extractFirstImageFilename(productInfoContent.value);
      if (!previewImageFilename) {
        // 如果商品簡介沒有圖，則從商品內文找第一張圖
        previewImageFilename = extractFirstImageFilename(productQuillContent.value);
      }

      const payload = {
        name: tableData.name,
        product_category_id: tableData.product_category_id,
        unit_price: tableData.unit_price,
        is_active: 1,
        // ✨ 傳送從編輯器內容中提取到的檔案名稱
        preview_image: previewImageFilename,
        product_info: productInfoContent.value,
        product_notes: productQuillContent.value,
      };

      const response = await createProducts(payload);

      if (response.data && response.data.status === 'success') {
        showToast('商品新增成功！');
        router.push({ name: 'product' });
      } else {
        throw new Error(response.data.message || '新增失敗');
      }
    } catch (error) {
      console.error('新增商品時發生錯誤:', error);
      showToast(`新增失敗：${error.message}`);
    }
  }

  async function onCancel() {
    router.push({ name: 'product' });
  }
</script>

<template>
  <div class="product-board">
    <div class="product-board__manage">
      <TheDetailHeader
        title="商品管理"
        @create="onCreate"
        @save="onSave"
        @cancel="onCancel"
        :buttons="isNew ? ['create', 'cancel'] : ['save', 'cancel']"
      />
    </div>
  </div>
  <div class="product-info">
    <Table
      :table-data="productInfoData"
      :columns="productInfoColumns"
    />
  </div>
  <div class="product-info quill-editor-container">
    <div class="editor-col">
      <h3>商品簡介</h3>
      <QuillEditor
        theme="snow"
        contentType="html"
        v-model:content="productInfoContent"
        ref="productInfoEditorRef"
        @ready="(editor) => (productInfoEditorInstance = editor)"
        :options="{
          modules: {
            toolbar: {
              container: [[{ list: 'ordered' }, { list: 'bullet' }], ['image']],
              handlers: {
                image: () => imageHandler(productInfoEditorInstance),
              },
            },
          },
        }"
      />
    </div>
    <div class="editor-col">
      <h3>商品內文</h3>
      <QuillEditor
        theme="snow"
        contentType="html"
        v-model:content="productQuillContent"
        ref="productQuillEditorRef"
        @ready="(editor) => (productQuillEditorInstance = editor)"
        :options="{
          modules: {
            toolbar: {
              container: [[{ list: 'ordered' }, { list: 'bullet' }], ['image']],
              handlers: {
                image: () => imageHandler(productQuillEditorInstance),
              },
            },
          },
        }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .quill-editor-container {
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    :deep(.ql-container) {
      flex: 1;
      min-height: 250px;
      max-height: 550px;
      overflow-y: auto;
    }
    :deep(.ql-editor img) {
      max-width: 50%;
      height: auto;
      display: block;
      box-sizing: border-box;
      padding: 5px 0;
    }
  }

  .editor-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    h3 {
      font-size: 15px;
      text-align: center;
      padding: 14px 0;
      color: #fef9ec;
      font-weight: 600;
      background-color: #d6b59c;
    }
  }
</style>
