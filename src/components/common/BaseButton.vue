<template>
  <button
    :class="buttonClasses"
    @click="$emit('click')"
  >
    <!-- 使用 slot 讓我們可以插入文字或 Icon -->
    <slot></slot>
  </button>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    // 讓父層可以決定按鈕的樣式是 'primary' 還是 'secondary'
    variant: {
      type: String,
      default: 'primary', // 預設為橘色按鈕
      validator: (value) => ['primary', 'secondary'].includes(value),
    },
  });

  defineEmits(['click']);

  // 動態計算 class 名稱
  const buttonClasses = computed(() => ['base-button', `base-button--${props.variant}`]);
</script>

<style lang="scss" scoped>
  /* 
  樣式被 scoped 限制在這個元件內，絕對不會影響其他夥伴的程式碼。
*/

  .base-button {
    // 這是所有按鈕共有的【形狀】樣式
    width: 100%;
    height: 60px;
    border-radius: 20px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  // 主要按鈕的【顏色】樣式 (橘色)
  .base-button--primary {
    background-color: #d97c48;
    color: white;
    border: none;

    &:hover {
      background-color: color(orangeColor, base);
      transition: 0.2s ease;
    }
  }

  // 次要按鈕的【顏色】樣式 (白色)
  .base-button--secondary {
    background-color: #fff;
    color: #333;
    border: 1px solid #ccc;

    &:hover {
      background-color: #e7e7e7;
      border: 1px solid #e7e7e7;
      transition: 0.2s ease;
    }
  }
</style>
