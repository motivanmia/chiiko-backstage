<script setup>

</script>

<template>
      <el-button class="increase-button"
        round
      >
        + 新增
      </el-button>
</template>

<style lang="scss" scoped>
  .increase-button{
    font-size: 18px;
    color: color(text,light);
    letter-spacing: 1.2px;
    background-color: color(button,main);
    border: none;

      &:hover{
        color:color(button,main);
        background-color: white;
      }
  }
</style>