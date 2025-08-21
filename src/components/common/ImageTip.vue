<script setup>
  import Icon from '@/components/common/Icon.vue';
</script>

<template>
  <el-tooltip
    placement="right"
    effect="light"
    :enterable="true"
    :show-after="80"
  >
    <template #content>
      <img
        class="tip-img"
        src="/src/assets/image/tip.png"
        alt="預覽圖"
      />
    </template>

    <!-- 觸發的 icon（你的自訂 Icon 元件） -->
    <Icon
      icon-name="edit"
      class="icon"
      @click="$emit('edit-click', scope.row)"
    />
  </el-tooltip>
</template>

<style lang="scss" scoped>
  .tip-img {
    width: 700px;
    height: auto;
    display: block;
  }
  .hover-icon {
    cursor: help;
  }
</style>
