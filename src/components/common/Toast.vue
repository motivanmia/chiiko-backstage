<script setup>
  import { useToastStore } from '@/stores/Toast';
  import { storeToRefs } from 'pinia';

  const toastStore = useToastStore();
  const { show, message, type } = storeToRefs(toastStore);
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      :class="type === 'error' ? 'toast_error' : 'toast'"
    >
      {{ message }}
    </div>
  </transition>
</template>

<style lang="scss" scoped>
  .toast {
    position: fixed;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    background: color(button, main);
    color: color(text, light);
    padding: 0.6em 1.2em;
    border-radius: 20px;
    font-size: 20px;
    pointer-events: none;
    z-index: 200;
  }
  .toast_error {
    z-index: 200;
    position: fixed;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    background: #cccccc;
    color: color(text, dark);
    padding: 0.6em 1.2em;
    border-radius: 20px;
    font-size: 20px;
    pointer-events: none;
    width: auto;
  }
</style>
