<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    text: {
      type: String,
      default: '儲存',
    },
    type: {
      type: String,
      default: 'save',
      validator: (val) => ['save', 'cancel'].includes(val),
    },
  });
  const emit = defineEmits(['click']);

  const cancelButtonStyle = computed(() => {
    return { 'the-button--cancel': props.type === 'cancel' };
  });
</script>

<template>
  <button
    class="the-button"
    :class="cancelButtonStyle"
    @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>

<style lang="scss" scoped>
  @use 'sass:color';

  .the-button {
    background-color: color(button, main);
    padding: px(10) px(30);
    border: unset;
    border-radius: px(15);
    @include fontSet($size: px(18), $lh: 1.2, $color: color(text, light), $ls: 0.1em);
    cursor: pointer;

    &:hover {
      background-color: color.adjust(color(button, main), $lightness: 15%);
    }

    &--cancel {
      background-color: color(backgroundColor, beige);
      color: color(button, main);
      border: px(1) solid color(backgroundColor, recipe);

      &:hover {
        background-color: color(backgroundColor, recipe);
        color: color(text, light);
      }
    }
  }
</style>
