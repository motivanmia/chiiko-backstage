<script setup>
  import { ref } from 'vue';
  const value5 = ref(true);

  const props = defineProps({
    yes: {
      type: String,
      default: '正常',
    },
    no: {
      type: String,
      default: '停權',
    },
  });
</script>

<template>
  <el-switch
    v-model="value5"
    class="ml-2 custom-switch"
    inline-prompt
    style="--el-switch-on-color: #f4a259; --el-switch-off-color: #828282"
    :active-text="yes"
    :inactive-text="no"
    size="large"
    width="70px"
  />
</template>

<style lang="scss" scoped></style>
