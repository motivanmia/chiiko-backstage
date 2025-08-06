<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { defineProps, defineEmits, ref } from 'vue';

  const props = defineProps({
    options: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: [String, Array],
      default: '',
    },
    cascaderProps: {
      type: Object,
      default: () => ({}),
    },
  });

  const emits = defineEmits(['update:modelValue', 'change']);

  const handleChange = (value) => {
    emits('update:modelValue', value);
    emits('change', value);
  };
</script>

<template>
  <div class="custom-cascader">
    <el-cascader
      :model-value="modelValue"
      :options="options"
      :props="cascaderProps"
      placeholder="請選擇"
      @change="handleChange"
    ></el-cascader>
  </div>
</template>

<style lang="scss" scoped>
  .custom-cascader {
    width: 150px;

    ::v-deep(.el-input__wrapper) {
      border-radius: 20px;
      width: 150px;
    }
  }
</style>
