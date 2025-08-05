<script setup>
  import { computed } from 'vue';
  import { iconMap, rotationMap, flipMap } from '@/constants/icon';

  /**
   * 組件的 props：icon 名稱
   * 僅允許傳入存在於 iconMap 的 key
   */
  const props = defineProps({
    /**
     * 要顯示的圖示名稱
     * @type {keyof typeof iconMap}
     */
    iconName: {
      type: String,
      required: true,
      validator: (value) => Object.keys(iconMap).includes(value),
    },
  });

  /**
   * 實際 iconify 用的圖示名稱
   * @type {import('vue').ComputedRef<string>}
   */
  const realIconName = computed(() => {
    return iconMap[props.iconName];
  });

  /**
   * 根據 iconName 判斷是否需要旋轉或翻轉
   * 回傳要套用到 icon 上的 style 物件
   * @type {import('vue').ComputedRef<{ transform?: string }>}
   */
  const finalStyle = computed(() => {
    const transforms = [];

    const rotate = rotationMap[props.iconName];
    if (rotate) transforms.push(`rotate(${rotate})`);

    if (flipMap[props.iconName]) transforms.push('scaleX(-1)');

    return {
      transform: transforms.length > 0 ? transforms.join(' ') : undefined,
    };
  });
</script>

<template>
  <iconify-icon
    :icon="realIconName"
    :style="finalStyle"
  ></iconify-icon>
</template>

<style lang="scss" scoped>
  iconify-icon {
    vertical-align: bottom;
  }
</style>
