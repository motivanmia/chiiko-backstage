<script setup>
  import { ref } from 'vue';
  import Title_el from '@/components/common/Title.vue';
  import TheButton from '@/components/common/TheButton.vue';
  import Table_el from '@/components/Table.vue';
  import DropMenu from '@/components/common/DropMenu.vue';

  const searchOption = ref('pending');

  const dropOptions = ref([
    { value: 'pending', label: '待確認' },
    { value: 'shipped', label: '已出貨' },
    { value: 'cancel', label: '取消' },
    { value: 'completed', label: '已完成' },
  ]);

  const orderColumns = ref([
    { prop: 'order_id', label: '訂單編號' },
    { prop: 'member_id', label: '會員編號' },
    { prop: 'date', label: '訂單日期' },
    { prop: 'price', label: '金額' },
    { prop: 'status', label: '訂單狀態', type: 'status' },
  ]);
  const orderData = ref([
    {
      order_id: '0025007003',
      member_id: 'G0001',
      date: '2025-05-20',
      price: 'NT$ 1300',
    },
  ]);

  const memberColumns = ref([
    { prop: 'name', label: '收件人姓名', width: 200 },
    { prop: 'phone', label: '收件人電話', width: 200 },
    { prop: 'address', label: '收件地址' },
  ]);

  const memberData = ref([
    {
      name: '張小花',
      phone: '0912-345-678',
      address: '桃園市中壢區復興路46號9樓',
    },
  ]);

  const productColumns = ref([
    { prop: 'product_id', label: '商品編號' },
    { prop: 'name', label: '商品名稱' },
    { prop: 'number', label: '數量' },
    { prop: 'uni_price', label: '單價' },
    { prop: 'price', label: '小計' },
  ]);

  const productData = ref([
    {
      product_id: 'P0000123',
      name: '23CM平底不沾鍋',
      number: '1',
      uni_price: 'NT$ 1000',
      price: 'NT$ 1000',
    },
    {
      product_id: 'P0000216',
      name: '萬用料理剪刀',
      number: '1',
      uni_price: 'NT$ 300',
      price: 'NT$ 300',
    },
    {
      product_id: '',
      name: '運費',
      number: '1',
      uni_price: 'NT$ 1300',
      price: 'NT$ 1300',
    },
  ]);
</script>

<template>
  <div class="order-detail">
    <div class="order-detail__wrap">
      <Title_el
        title="訂單管理"
        class="order-detail__title"
      />
      <div class="order-detail__button-wrap">
        <TheButton />
        <TheButton
          text="取消"
          type="cancel"
        />
      </div>
    </div>
    <Table_el
      :table-data="orderData"
      :columns="orderColumns"
    >
      <template #status>
        <DropMenu
          :options="dropOptions"
          v-model="searchOption"
          class="order-detail__dropdown"
        />
      </template>
    </Table_el>
    <Table_el
      :table-data="memberData"
      :columns="memberColumns"
    />
    <Table_el
      :table-data="productData"
      :columns="productColumns"
    />
  </div>
</template>

<style lang="scss" scoped>
  .order-detail {
    &__wrap {
      @include flex($jc: space-between);
      padding: px(15) px(20);
    }

    &__button-wrap {
      @include flex();
      gap: px(25);
    }
  }
</style>
