<script setup>
  import { ref } from 'vue';
  import { orderData, memberData, productData } from '@/assets/data/orderDetailData';
  import {
    orderColumns,
    memberColumns,
    productColumns,
    dropOptions,
  } from '@/constants/orderDetail';

  import Table_el from '@/components/Table.vue';
  import DropMenu from '@/components/common/DropMenu.vue';
  import TheDetailHeader from '@/components/common/TheDetailHeader.vue';

  const searchOption = ref('pending');
</script>

<template>
  <div class="order-detail">
    <TheDetailHeader title="訂單管理" />
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

<style lang="scss" scoped></style>
