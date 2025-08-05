<script setup>
  import icon from '@/components/common/Icon.vue';
  import switch_el from '@/components/Switch.vue';

  defineProps({
    tableData: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
  });
</script>

<template>
  <el-table
    :data="tableData"
    height="75vh"
    style="width: 100%"
  >
    <el-table-column
      v-for="(col, index) in columns"
      :key="index"
      :prop="col.prop"
      :label="col.label"
      :width="col.width"
    >
      <!-- ✅ 只有當 col.type 是 'button' 才顯示 slot / 預設按鈕 -->
      <template
        #default="scope"
        v-if="col.type === 'button'"
      >
        <slot
          :name="col.prop"
          :row="scope.row"
        >
          <!-- 沒有自訂 slot 時會顯示這個按鈕 -->
          <icon
            icon-name="detail"
            id="icon"
          />
        </slot>
      </template>

      <!-- ✅ 只有當 col.type 是 'button' 才顯示 slot / 預設按鈕 -->
      <template
        #default="scope"
        v-if="col.type === 'status'"
      >
        <slot
          :name="col.prop"
          :row="scope.row"
        >
          <!-- 沒有自訂 slot 時會顯示這個按鈕 -->
          <switch_el />
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
  #icon {
    font-size: 20px;
    &:hover {
      cursor: pointer;
    }
  }
  ::v-deep(.el-table__header) {
    th {
      background-color: #d6b59c !important;
      color: #fef9ec !important;
      font-size: 14px;
    }
  }

  ::v-deep(.el-table__row) {
    td {
      background-color: #fefbf1;
      color: #333;
      font-size: 14px;
    }
  }
  ::v-deep(.el-table__body tr:hover > td) {
    background-color: #ffffff !important; /* ← 你想要的 hover 顏色 */
  }
</style>
