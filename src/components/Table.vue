<script setup>
  import Icon from '@/components/common/Icon.vue';
  import switch_el from '@/components/Switch.vue';
  import ImageCell from '@/components/common/ImageCell.vue';
  import DropMenu from '@/components/common/DropMenu.vue';

  defineProps({
    tableData: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    yes: {
      type: String,
    },
    no: {
      type: String,
    },
    enableImageUpload: {
      type: Boolean,
      default: false,
    },
  });

  // ✨ [關鍵] 3. 聲明這個元件會發送一個名為 'button-click' 的事件
  // 用於將狀態變動的資訊傳給上層父元件
  const emit = defineEmits([
    'button-click',
    'toggle-status',
    'edit-click',
    'del-click',
    'text-change',
    'image-upload',
    'image-remove',
  ]);
  // ✨ [關鍵] 4. 當預設的圖示按鈕被點擊時，觸發這個函式
  function handleIconClick(rowData) {
    // 發送事件，並將該行的完整資料(rowData)作為參數傳出去
    emit('button-click', rowData);
  }

  // switch狀態切換函式
  function handleStatusToggle(rowData, newStatus) {
    emit('toggle-status', { rowData, newStatus });
  }
  function resolveOptions(col, row) {
    const opts = typeof col.options === 'function' ? col.options(row) : col.options;
    return Array.isArray(opts) ? opts : [];
  }
</script>

<template>
  <el-table
    :data="tableData"
    max-height="75vh"
    style="width: 100%"
  >
    <el-table-column
      v-for="(col, index) in columns"
      :key="index"
      :prop="col.prop"
      :label="col.label"
      :width="col.width"
    >
      <template #default="scope">
        <template v-if="$slots[col.prop]">
          <slot
            :name="col.prop"
            :row="scope.row"
            :column="scope.column"
            :index="scope.$index"
          />
        </template>
        <!-- 按鈕類型 -->
        <!-- 查看詳細類型 -->
        <div v-if="col.type === 'button-detail'">
          <Icon
            icon-name="detail"
            class="icon"
            @click="handleIconClick(scope.row)"
          />
        </div>

        <!-- 編輯類型 -->
        <div v-else-if="col.type === 'button-edit'">
          <Icon
            icon-name="edit"
            class="icon"
            @click="$emit('edit-click', scope.row)"
          />
        </div>

        <!-- 刪除按鈕 -->
        <div v-else-if="col.type === 'button-del'">
          <Icon
            icon-name="del"
            class="icon"
            @click="$emit('del-click', scope.row)"
          />
        </div>

        <!-- 狀態開關類型 -->
        <div v-else-if="col.type === 'status'">
          <template v-if="$slots.status">
            <slot
              name="status"
              :row="scope.row"
            />
          </template>
          <template v-else>
            <switch_el
              v-model="scope.row[col.prop]"
              :yes="yes"
              :no="no"
              @toggle="(newStatus) => emit('toggle-status', { rowData: scope.row, newStatus })"
            />
          </template>
        </div>

        <!-- 圖片類型（可上傳/更換/移除） -->
        <div v-else-if="col.type === 'image'">
          <ImageCell
            v-model="scope.row[col.prop]"
            :editable="enableImageUpload"
            :width="120"
            :height="120"
            @select="
              (p) => {
                // p = { file, url, name, mime, size, source }
                scope.row[`${col.prop}Meta`] = p; // 暫存這一欄的上傳 meta
                $emit('image-upload', { row: scope.row, prop: col.prop, ...p });
              }
            "
            @remove="
              () => {
                delete scope.row[`${col.prop}Meta`];
                $emit('image-remove', { row: scope.row, prop: col.prop });
              }
            "
          />
        </div>

        <!-- 文字編輯類型 -->
        <div v-else-if="col.type === 'text-edit'">
          <el-input
            v-model="scope.row[col.prop]"
            :placeholder="col.placeholder || ''"
            :maxlength="col.maxlength"
            :show-word-limit="!!col.maxlength"
            size="default"
            @change="(val) => emit('text-change', { row: scope.row, prop: col.prop, value: val })"
            @keydown.enter.stop
            type="textarea"
            :rows="3"
            autosize
          />
        </div>

        <!-- 下拉選單 -->
        <div
          v-else-if="col.type === 'select'"
          class="cell-select"
        >
          <el-select
            v-model="scope.row[col.prop]"
            :placeholder="col.placeholder || '請選擇'"
            :clearable="col.clearable !== false"
            :filterable="!!col.filterable"
            :multiple="!!col.multiple"
            style="width: 100%"
          >
            <el-option
              v-for="opt in resolveOptions(col, scope.row)"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>

        <div
          v-else-if="col.type === 'cascader'"
          class="cell-cascader"
        >
          <DropMenu
            v-model="scope.row[col.prop]"
            :options="resolveOptions(col, scope.row)"
          />
        </div>

        <!-- 一般文字 -->
        <span
          v-else
          class="text"
        >
          {{ scope.row[col.prop] }}
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
  .icon {
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

  ::v-deep(.el-table__cell) {
    text-align: center;
  }
  ::v-deep(.el-table__cell .text) {
    @include ellipsis($line: 1);
  }
</style>
