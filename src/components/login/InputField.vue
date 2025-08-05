<script setup>
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps({
    modelValue: String,
    label: String,
    placeholder: String,
    type: {
      type: String,
      default: 'email',
    },
    id: {
      type: String,
      default: () => `input-${Math.random().toString(36).substring(2, 8)}`,
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    variant: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:modelValue']);

  function onInput(e) {
    emit('update:modelValue', e.target.value);
  }
</script>

<template>
  <!-- <div class="input-wrapper" :class="[variant === 'signin' ? 'input-signin-style' : '']"> -->
  <div
    class="input-wrapper"
    :class="variant"
  >
    <label
      :for="id"
      class="input-label"
    >
      {{ label }}
    </label>
    <p class="must"><slot name="must"></slot></p>
    <p><slot name="tip"></slot></p>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :value="modelValue"
      @input="onInput"
      class="input-box"
    />
  </div>
</template>

<style lang="scss" scoped>
  .input-wrapper {
    letter-spacing: 0.1rem;
  }
  .input-label {
    display: inline-block;
    margin-bottom: 0.5em;
    margin-top: 25px;
    font-size: 20px;
  }
  .input-box {
    width: 100%;
    padding-left: clamp(1rem, 1vw, 1.5rem); //1.5rem;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: clamp(16px, 1.04vw, 20px);
    letter-spacing: 0.05rem;
    height: 50px;
    color: color(search, placeholder);
  }
  .must {
    display: inline-block;
    font-size: px(16);
    color: color(search, placeholder);
  }
  p {
    font-size: px(16);
    color: color(search, placeholder);
    margin-bottom: 5px;
  }
</style>
