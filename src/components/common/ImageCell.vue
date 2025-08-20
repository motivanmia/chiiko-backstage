<script setup>
  import { ref, onBeforeUnmount, watch, computed } from 'vue';

  const props = defineProps({
    modelValue: { type: String, default: '' }, // 圖片 URL
    editable: { type: Boolean, default: true }, // 是否顯示按鈕
    width: { type: [Number, String], default: 120 },
    height: { type: [Number, String], default: 120 },
    placeholder: { type: String, default: '無圖片' },
    maxMb: { type: Number, default: 5 },
    showDirtyBadge: { type: Boolean, default: true },
  });
  const emit = defineEmits(['update:modelValue', 'select', 'remove']);

  const original = ref(null); // 初始圖片 URL（用來還原）
  const dirty = ref(false); // 是否已本地更換（未儲存）
  const localUrls = ref([]); // 產生過的 ObjectURL（離開時清理）

  // 盒子尺寸（圖片區）
  const boxStyle = computed(() => ({
    width: typeof props.width === 'number' ? props.width + 'px' : props.width,
    height: typeof props.height === 'number' ? props.height + 'px' : props.height,
  }));

  // 外部把值重設時，如果未 dirty，就同步 original
  watch(
    () => props.modelValue,
    (v) => {
      if (!dirty.value && original.value === null) original.value = v || '';
    },
    { immediate: true },
  );

  function beforeUpload(file) {
    const isImage = /^image\//.test(file.type);
    const isLt = file.size / 1024 / 1024 < props.maxMb;
    return isImage && isLt;
  }

  function onChange(file /* Element Plus: UploadFile */, fileList) {
    const raw = file?.raw ?? file; // 兼容 el-upload 與手動傳入 File
    if (!raw || !beforeUpload(raw)) return;

    if (original.value === null) original.value = props.modelValue || '';

    const url = URL.createObjectURL(raw); // 預覽用
    localUrls.value.push(url);
    dirty.value = true;

    // 更新預覽
    emit('update:modelValue', url);

    // 關鍵：把 name 一起給父層（之後組 payload 時就能拿檔名）
    emit('select', {
      file: raw, // File 物件（之後可一次上傳）
      url, // 本地預覽
      name: raw.name || '', // 原始檔名
      mime: raw.type || '',
      size: raw.size || 0,
      source: 'local',
    });
  }

  function onSuccess(response, file, fileList) {
    // 期望後端回：{ status:'success', filename:'a.png', url:'/uploads/a.png' }
    if (!response) return;
    const filename = response.filename || file?.name || '';
    const finalUrl = response.url || props.modelValue || '';

    // 外觀上換成正式網址（非 blob）
    emit('update:modelValue', finalUrl);

    // 通知父層：這張圖已有正式檔名
    emit('select', {
      file: file?.raw ?? null,
      url: finalUrl,
      name: filename,
      mime: file?.raw?.type || '',
      size: file?.raw?.size || 0,
      source: 'server',
    });

    // 已經固定為伺服器圖，結束 dirty 狀態
    dirty.value = false;
    localUrls.value.forEach((u) => URL.revokeObjectURL(u));
    localUrls.value = [];
  }

  function removeOrRevert() {
    // 還原到 original（若沒有 original，則清空）
    const target = original.value ?? '';
    emit('update:modelValue', target);
    emit('remove');
    dirty.value = false;

    // 釋放暫存 URL
    localUrls.value.forEach((u) => URL.revokeObjectURL(u));
    localUrls.value = [];
  }

  onBeforeUnmount(() => {
    localUrls.value.forEach((u) => URL.revokeObjectURL(u));
    localUrls.value = [];
  });
</script>

<template>
  <div class="image-cell">
    <div
      class="image-box"
      :style="boxStyle"
    >
      <span
        v-if="dirty && showDirtyBadge"
        class="badge"
      >
        未儲存
      </span>

      <img
        v-if="modelValue"
        :src="modelValue"
        alt=""
      />
      <div
        v-else
        class="placeholder"
      >
        {{ placeholder }}
      </div>
    </div>

    <div
      v-if="editable"
      class="controls"
    >
      <el-upload
        :auto-upload="false"
        :show-file-list="false"
        accept="image/*"
        @change="onChange"
        @success="onSuccess"
      >
        <el-button
          size="small"
          type="primary"
        >
          {{ modelValue ? '更換圖片' : '上傳圖片' }}
        </el-button>
      </el-upload>

      <el-button
        v-if="modelValue || original !== null"
        size="small"
        type="danger"
        plain
        @click="removeOrRevert"
      >
        {{ original !== null ? '還原' : '移除' }}
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .image-cell {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .image-box {
    position: relative;
    border: 1px dashed #ddd;
    border-radius: 6px;
    background: #fafafa;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      background: #fff;
    }
    .placeholder {
      color: #999;
      font-size: 12px;
    }
    .badge {
      position: absolute;
      top: 6px;
      left: 6px;
      padding: 2px 6px;
      font-size: 12px;
      background: #ff9800;
      color: #fff;
      border-radius: 4px;
      z-index: 1;
    }
  }

  .controls {
    margin-top: 8px;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
  }
</style>
