<script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import Title_el from '@/components/common/Title.vue';
  import DropMenu from '@/components/common/DropMenu.vue';
  import Search from '@/components/common/Search.vue';
  import Table_el from '@/components/Table.vue';
  import Icon from '@/components/common/Icon.vue';

  const router = useRouter();

  const searchOption = ref('all');

  const dropOptions = ref([
    { value: 'all', label: '所有訂單' },
    { value: 'pending', label: '待確認' },
    { value: 'shipped', label: '已出貨' },
    { value: 'cancel', label: '取消' },
    { value: 'completed', label: '已完成' },
  ]);

  const columns = ref([
    { prop: 'order_id', label: '訂單編號' },
    { prop: 'member_id', label: '會員編號' },
    { prop: 'date', label: '訂單日期' },
    { prop: 'price', label: '金額' },
    { prop: 'status', label: '訂單狀態' },
    { prop: 'icon', label: '內容', type: 'button', width: 60 },
  ]);

  const tableData = ref([
    {
      order_id: '0025007003',
      member_id: 'G0001',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '待確認',
    },
    {
      order_id: '0025007003',
      member_id: 'G0001',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '已出貨',
    },
    {
      order_id: '0025007003',
      member_id: 'G0001',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '取消',
    },
    {
      order_id: '0025007003',
      member_id: 'G0002',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '待確認',
    },
    {
      order_id: '0025007003',
      member_id: 'G0002',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '待確認',
    },
    {
      order_id: '0025007003',
      member_id: 'G0002',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '待確認',
    },
    {
      order_id: '0025007003',
      member_id: 'G0001',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '已出貨',
    },
    {
      order_id: '0025007003',
      member_id: 'G0001',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '待確認',
    },
    {
      order_id: '0025007003',
      member_id: 'G0003',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '已完成',
    },
  ]);

  const filteredTableData = computed(() => {
    let result = tableData.value;

    const selected = Array.isArray(searchOption.value) ? searchOption.value[0] : searchOption.value;

    // 篩選訂單狀態
    if (selected !== 'all') {
      const selectedOption = dropOptions.value.find((option) => option.value === selected);
      if (selectedOption) {
        result = result.filter((item) => item.status === selectedOption.label);
      }
    }

    return result;
  });

  const goOrderDetail = () => {
    router.push({ path: '/order-detail' });
  };
</script>

<template>
  <div class="order">
    <div class="order__header">
      <Title_el
        title="訂單管理"
        class="order__title"
      />
      <div class="order__wrap">
        <DropMenu
          :options="dropOptions"
          v-model="searchOption"
        />
        <Search />
      </div>
    </div>
    <Table_el
      :table-data="filteredTableData"
      :columns="columns"
      class="order__table"
    >
      <template #icon>
        <Icon
          icon-name="detail"
          @click="goOrderDetail"
          class="order__icon"
        />
      </template>
    </Table_el>
  </div>
</template>

<style lang="scss" scoped>
  .order {
    &__header {
      padding: 0 px(20);
      border-bottom: px(1) solid color(backgroundColor, recipe);
    }
    &__title {
      margin-bottom: px(20);
    }

    &__wrap {
      @include flex($jc: space-between);
      padding-bottom: px(20);
    }

    &__table {
      margin-top: px(15);
    }

    &__icon {
      @include font-size(20);
      cursor: pointer;
    }
  }
</style>
