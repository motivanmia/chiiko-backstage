<script setup>
  import { ref, watch, computed, defineProps, defineEmits } from 'vue';

  const props = defineProps({
    yes: {
      type: String,
      default: '正常',
    },
    no: {
      type: String,
      default: '停權',
    },
    initialStatus: String, // 接收父元件傳來的狀態
    modelValue: { type: [Number, String], default: 0 },
  });

  // 定義要發出的事件
  const emit = defineEmits(['update:modelValue', 'toggle']);

  // 使用響應式狀態來控制switch元件
  const isStatusActive = ref(props.initialStatus === 'Active');

  // 監聽父元件傳入的initialStatus變化 同步內部狀態
  watch(
    () => props.initialStatus,
    (newStatus) => {
      isStatusActive.value = newStatus === 'Active';
    },
  );

  const proxy = computed({
    get: () => (Number(props.modelValue) === 0 ? 0 : 1),
    set: (val) => {
      const n = Number(val) === 0 ? 0 : 1; // 保證只會是 0 或 1
      emit('update:modelValue', n); // 回傳給父層
      emit('toggle', n);
    },
  });
</script>

<template>
  <el-switch
    v-model="proxy"
    class="ml-2 custom-switch"
    inline-prompt
    style="--el-switch-on-color: #f4a259; --el-switch-off-color: #828282"
    size="large"
    width="70px"
    :active-text="yes"
    :inactive-text="no"
    :active-value="0"
    :inactive-value="1"
  />
</template>

<style lang="scss" scoped></style>
