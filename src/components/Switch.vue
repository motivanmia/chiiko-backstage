<script setup>
  import { ref, watch, defineProps, defineEmits } from 'vue';

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
  });

  // 定義要發出的事件
  const emit = defineEmits(['toggle']);

  // 使用響應式狀態來控制switch元件
  const isStatusActive = ref(props.initialStatus === 'Active');

  // 監聽父元件傳入的initialStatus變化 同步內部狀態
  watch(
    () => props.initialStatus,
    (newStatus) => {
      isStatusActive.value = newStatus === 'Active';
    },
  );

  // 當switch被切換時 發出帶有新狀態的事件
  const handleToggle = () => {
    const newStatus = isStatusActive.value ? 'Active' : 'Disabled';
    // 將新狀態傳給父元件
    emit('toggle', newStatus);
  };
</script>

<template>
  <el-switch
    v-model="isStatusActive"
    class="ml-2 custom-switch"
    inline-prompt
    style="--el-switch-on-color: #f4a259; --el-switch-off-color: #828282"
    size="large"
    width="70px"
    @change="handleToggle"
    :active-text="yes"
    :inactive-text="no"
  />
</template>

<style lang="scss" scoped></style>
