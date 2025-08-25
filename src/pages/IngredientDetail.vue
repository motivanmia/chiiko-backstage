<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import Table from '@/components/Table.vue';
  import TheDetailHeader from '@/components/common/TheDetailHeader.vue';
  import { useIngredientStore } from '@/stores/Ingredient';
  import { useIngredientCategoryStore } from '@/stores/IngredientCategory';
  import { useToastStore } from '@/stores/Toast';

  const toastStore = useToastStore();
  const { showToast } = toastStore;

  const route = useRoute();
  const router = useRouter();

  const ingredientStore = useIngredientStore();
  const categoryStore = useIngredientCategoryStore();
  const selectedStatus = ref('');
  const isNew = computed(() => route.params.id === 'new');
  const originalPayload = ref(null);
  function snapshotNow() {
    originalPayload.value = JSON.parse(JSON.stringify(buildPayload()));
  }

  function buildDetailForNew() {
    // 給一筆空白基本資訊
    ingredientInfoData.value = [
      {
        ingredientId: '',
        ingredientCategory: '',
        ingredientName: '',
        ingredientImage: '',
        ingredientStatus: '0',
      },
    ];

    // 空的挑選指南（預留 3 組 × 2 行 = 6 行）
    ingredientGuideData.value = [
      { goodText: '', badText: '' },
      { goodText: '', badText: '' },
      { goodText: '', badText: '' },
      { goodText: '', badText: '' },
      { goodText: '', badText: '' },
      { goodText: '', badText: '' },
    ];

    const total = ingredientGuideData.value.length;
    const half = Math.ceil(total / 2);
    ingredientGuideData.value[0].comparisonImage = ''; // 好圖
    ingredientGuideData.value[half].comparisonImage = ''; // 壞圖
    ingredientGuideData.value[0].preservationText = ''; // 保存方法

    snapshotNow();
  }

  onMounted(async () => {
    // 先載分類（select 用）
    if (!categoryStore.hasLoaded) await categoryStore.loadCategories();

    const id = String(route.params.id ?? '');

    if (id === 'new') {
      // ✅ 新增模式：建立空白資料
      buildDetailForNew();
      return;
    }

    // 詳細模式
    if (!ingredientStore.list.length) {
      await ingredientStore.loadIngredients();
    }
    const found =
      ingredientStore.list.find((x) => String(x.number) === id) ||
      ingredientStore.tableRows.find((x) => String(x.number) === id);

    buildDetail(found);
  });

  /** —— 第一張表：食材基本資訊 —— */
  const ingredientInfoColumns = ref([
    { prop: 'ingredientId', label: '食材編號', width: 140 },
    {
      prop: 'ingredientCategory',
      label: '食材分類',
      type: 'select',
      width: 180,
      placeholder: '請選擇分類',
      clearable: true,
      // 動態 options：[{label:'植物性食材', value:'1'}, ...]
      options: () => categoryStore.selectOptions,
    },
    { prop: 'ingredientName', label: '食材名稱', type: 'text-edit', width: 200 },
    { prop: '' },
  ]);

  /** —— 第二張表：挑選指南 —— */
  const ingredientGuideColumns = ref([
    { prop: 'goodText', label: '左側說明項目', type: 'text-edit' },
    { prop: 'comparisonImage', label: '圖片', type: 'image' },
    { prop: 'badText', label: '右側說明項目', type: 'text-edit' },
    { prop: 'preservationText', label: '保存方法', type: 'text-edit' },
  ]);

  // 第一個表格的資料
  const ingredientInfoData = ref([]);
  // 第二個表格的資料
  const ingredientGuideData = ref([]);

  function buildDetail(found) {
    if (!found) return;

    // 第一張表
    ingredientInfoData.value = [
      {
        ingredientId: found.number, // e.g. "1"
        ingredientCategory: found.categoryId || '',
        ingredientName: found.name,
        ingredientImage: found.images?.[0] || found.img || '',
        ingredientStatus: found.status, // '0' | '1'
      },
    ];
    selectedStatus.value = found.status;

    // 第二張表：把 content（陣列）展成「標題行 + 內文行」
    ingredientGuideData.value = [];
    const pairs = Array.isArray(found.content) ? found.content : [];
    pairs.forEach((p) => {
      ingredientGuideData.value.push({
        goodText: p.goodtitle ?? '',
        badText: p.badtitle ?? '',
      });
      ingredientGuideData.value.push({
        goodText: p.goodcontent ?? '',
        badText: p.badcontent ?? '',
      });
    });

    // 計算上下半區塊索引
    const total = ingredientGuideData.value.length;
    const half = Math.ceil(total / 2);

    // 圖片（左＝新鮮、右＝壞掉）
    if (found.images?.[0]) {
      // 上半插入好圖
      if (ingredientGuideData.value[0]) {
        ingredientGuideData.value[0].comparisonImage = found.images[0];
      }
    }
    if (found.images?.[1]) {
      // 下半插入壞圖
      if (ingredientGuideData.value[half]) {
        ingredientGuideData.value[half].comparisonImage = found.images[1];
      }
    }

    // 保存方法佔滿整欄（合併由 spanMethod 控制）
    if (found.storage_method) {
      if (ingredientGuideData.value[0]) {
        ingredientGuideData.value[0].preservationText = found.storage_method;
      }
    }
    snapshotNow();
  }

  /**
   * 表格合併：對第二張表（挑選指南）使用
   * - 圖片欄：分上下兩塊，各佔一半列數
   * - 保存方法欄：第一列開始合併整欄
   */
  function spanMethod({ rowIndex, columnIndex }) {
    const total = ingredientGuideData.value.length;
    const half = Math.ceil(total / 2);

    // 圖片欄（第二欄，index=1）
    if (columnIndex === 1) {
      if (rowIndex === 0) return { rowspan: half, colspan: 1 }; // 上半
      if (rowIndex === half) return { rowspan: total - half, colspan: 1 }; // 下半
      return { rowspan: 0, colspan: 0 };
    }

    // 保存方法欄（第四欄，index=3）
    if (columnIndex === 3) {
      if (rowIndex === 0) return { rowspan: total, colspan: 1 }; // 佔滿全部列
      return { rowspan: 0, colspan: 0 };
    }
  }

  function toFilename(v) {
    if (!v) return '';

    // 1) 直接是 File 物件
    if (typeof File !== 'undefined' && v instanceof File) {
      return v.name || '';
    }

    // 2) Element Plus Upload 常見形態：{ raw: File, name, url, response }
    if (typeof v === 'object') {
      // 後端成功回傳：可能給 { filename: 'xxx.png', url: '/uploads/xxx.png' }
      if (v.filename) return String(v.filename);

      if (v.raw && v.raw.name) return String(v.raw.name);
      if (v.name) return String(v.name);

      if (v.url && typeof v.url === 'string') {
        const clean = v.url.split('#')[0].split('?')[0];
        return clean.split('/').pop() || '';
      }
    }

    // 3) 純字串
    if (typeof v === 'string') {
      if (v.startsWith('data:')) return '';
      if (v.startsWith('blob:')) return '';
      const clean = v.split('#')[0].split('?')[0];
      return clean.split('/').pop() || '';
    }

    return '';
  }

  function filenameFromRow(row, prop) {
    if (!row) return '';
    const meta = row?.[`${prop}Meta`];
    if (meta?.name) return String(meta.name);

    const v = row?.[prop];
    return toFilename(v);
  }

  function buildPayload() {
    const info = ingredientInfoData.value?.[0] ?? {};
    const rows = ingredientGuideData.value ?? [];
    const total = rows.length;
    const half = Math.ceil(total / 2);

    // ✅ 用檔名
    const goodImageName =
      filenameFromRow(rows[0], 'comparisonImage') || toFilename(info.ingredientImage);
    const badImageName = filenameFromRow(rows[half], 'comparisonImage');

    const content = [];
    for (let i = 0; i < total; i += 2) {
      const t = rows[i] || {},
        b = rows[i + 1] || {};
      content.push({
        goodtitle: String(t.goodText ?? ''),
        badtitle: String(t.badText ?? ''),
        goodcontent: String(b.goodText ?? ''),
        badcontent: String(b.badText ?? ''),
      });
    }

    return {
      ingredient_id: info.ingredientId ? String(info.ingredientId) : null,
      name: String(info.ingredientName ?? ''),
      category_id: String(info.ingredientCategory ?? ''),
      status: String(info.ingredientStatus ?? '0'),
      storage_method: String(rows[0]?.preservationText ?? ''),
      content,
      images: [goodImageName, badImageName],
    };
  }

  async function uploadImagesIfNeeded() {
    const rows = ingredientGuideData.value ?? [];
    const total = rows.length;
    const half = Math.ceil(total / 2);

    const needUpload = [];

    // 好圖
    const goodMeta = rows[0]?.comparisonImageMeta;
    if (goodMeta?.source === 'local' && goodMeta?.file) {
      needUpload.push({ slot: 'good', file: goodMeta.file });
    }
    // 壞圖
    const badMeta = rows[half]?.comparisonImageMeta;
    if (badMeta?.source === 'local' && badMeta?.file) {
      needUpload.push({ slot: 'bad', file: badMeta.file });
    }

    if (!needUpload.length) return null;

    const form = new FormData();
    needUpload.forEach(({ file }) => form.append('files[]', file));

    const res = await fetch(`${import.meta.env.VITE_API_BASE}/school/upload_image.php`, {
      method: 'POST',
      body: form,
    });

    const raw = await res.text();
    if (!res.ok) throw new Error(`Upload HTTP ${res.status}: ${raw.slice(0, 200)}`);

    const data = JSON.parse(raw);
    if (data.status !== 'success') {
      throw new Error(data.message || '圖片上傳失敗');
    }

    const uploaded = data.files || [];

    let idx = 0;
    if (goodMeta?.source === 'local' && uploaded[idx]) {
      const u = uploaded[idx++];
      rows[0].comparisonImage = u.url;
      rows[0].comparisonImageMeta = {
        ...(rows[0].comparisonImageMeta || {}),
        name: u.filename,
        url: u.url,
        source: 'server',
      };
    }
    if (badMeta?.source === 'local' && uploaded[idx]) {
      const u = uploaded[idx++];
      rows[half].comparisonImage = u.url;
      rows[half].comparisonImageMeta = {
        ...(rows[half].comparisonImageMeta || {}),
        name: u.filename,
        url: u.url,
        source: 'server',
      };
    }

    return uploaded;
  }
  function diffPayload(orig, cur) {
    if (!orig) return { ...cur };
    const diff = {};
    const pick = (k) => {
      if (orig[k] !== cur[k]) diff[k] = cur[k];
    };

    // 單值欄位
    pick('ingredient_id');
    pick('name');
    pick('category_id');
    pick('status');
    pick('storage_method');

    // 陣列欄位：images / content
    const isEqualArray = (a, b) => {
      if (!Array.isArray(a) || !Array.isArray(b)) return false;
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;
      }
      return true;
    };

    if (!isEqualArray(orig.images, cur.images)) diff.images = cur.images;
    if (!isEqualArray(orig.content, cur.content)) diff.content = cur.content;

    return diff;
  }

  async function requestPatch(url, json) {
    // 真 PATCH
    let res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json),
    });

    // 不支援 PATCH → POST + _method
    if (!res.ok && (res.status === 405 || res.status === 501)) {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _method: 'PATCH', ...json }),
      });
    }

    const raw = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);
    const data = JSON.parse(raw);
    if (data.status !== 'success') throw new Error(data.message || '更新失敗');
    return data;
  }

  async function onCreate() {
    await uploadImagesIfNeeded();

    const p = buildPayload();
    // console.log(p);

    const payloadForApi = {
      ingredients_category_id: Number(p.category_id) || 0,
      name: p.name,
      image: p.images,
      status: String(p.status ?? '0'),
      storage_method: p.storage_method,
      content: p.content,
    };
    console.log(p);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/school/post_ingredient.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadForApi),
      });

      const raw = await res.text();
      console.log('HTTP', res.status, res.headers.get('content-type'));
      console.log('RAW >>', raw); // 這裡會看到真正的 PHP 錯誤訊息或 JSON

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);

      // 確定是 JSON 再 parse
      const data = JSON.parse(raw);
      if (data.status !== 'success') throw new Error(data.message || '新增失敗');

      showToast('已新增');
      router.push({ name: 'ingredient' });
    } catch (e) {
      console.error(e);
      ElMessage.error(e.message || '新增失敗');
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
      showToast('已更新');
    } catch (e) {
      console.error(e);
      showToast(e.message || '更新失敗');
    }
  }

  async function onCancel() {
    router.push({ name: 'ingredient' });
  }
</script>

<template>
  <div class="ingredient-board">
    <div class="ingredient-board__manage">
      <TheDetailHeader
        title="食材項目編輯"
        @create="onCreate"
        @save="onSave"
        @cancel="onCancel"
        :buttons="isNew ? ['create', 'cancel'] : ['save', 'cancel']"
      />
    </div>
  </div>

  <div class="ingredient-board__contents">
    <Table
      :table-data="ingredientInfoData"
      :columns="ingredientInfoColumns"
    />
  </div>

  <div class="ingredient-board__manage">
    <TheDetailHeader
      title="食材燈箱編輯"
      :buttons="[]"
      :enable-image-tip="true"
    />
  </div>

  <div class="ingredient-board__contents">
    <Table
      :table-data="ingredientGuideData"
      :columns="ingredientGuideColumns"
      :span-method="spanMethod"
      :enable-image-upload="true"
    />
  </div>
</template>

<style lang="scss" scoped></style>
