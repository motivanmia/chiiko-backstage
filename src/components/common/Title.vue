<script setup>
  import { defineProps, defineEmits, ref } from 'vue';

  const props = defineProps({
    title: {
      type: String, // 屬性類型為字串
      default: '預設標題', // 設定預設值
    },
  });
</script>

<template>
  <h1>{{ props.title }}</h1>
</template>

<style lang="scss" scoped>
  h1 {
    font-size: 30px;
  }
</style>
