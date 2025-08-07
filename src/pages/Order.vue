<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { dropOptions, columns } from '@/constants/order';
  import { useFilterTableData } from '@/composables/useFilterTableData';
  import { tableData } from '@/assets/data/orderData';

  import TheHeader from '@/components/common/TheHeader.vue';
  import Table_el from '@/components/Table.vue';
  import Icon from '@/components/common/Icon.vue';

  const router = useRouter();

  const searchOption = ref('all');
  const searchText = ref('');

  const { filterData } = useFilterTableData(tableData, dropOptions, searchOption, searchText);

  const goOrderDetail = () => {
    router.push({ path: '/order-detail' });
  };
</script>

<template>
  <div class="order">
    <TheHeader
      title="訂單管理"
      v-model:searchOption="searchOption"
      v-model:searchText="searchText"
      :dropOptions="dropOptions"
      :show-increase-button="false"
    />
    <Table_el
      :table-data="filterData"
      :columns="columns"
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
    &__icon {
      @include font-size(20);
      cursor: pointer;
    }
  }
</style>
