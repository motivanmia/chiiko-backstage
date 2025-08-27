<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useToastStore } from '@/stores/Toast';
  import { orderColumns, memberColumns, productColumns } from '@/constants/orderDetail';
  import { getOrderItem, patchOrder } from '@/api/fetch';

  import Table_el from '@/components/Table.vue';
  import TheDetailHeader from '@/components/common/TheDetailHeader.vue';

  const route = useRoute();
  const router = useRouter();

  const toastStore = useToastStore();
  const { showToast } = toastStore;

  const orderData = ref([]);
  const memberData = ref([]);
  const productData = ref([]);

  const loadOrderItem = async () => {
    try {
      const { data } = await getOrderItem({ order_id: route.params.id });
      if (data.status === 'success') {
        const order = data.data;
        const items = data.data.items;

        // 訂單資料
        orderData.value = [
          {
            order_id: order.order_id,
            member_id: order.user_id, // 看你有沒有會員 id，如果 API 沒給可以先寫死
            date: order.created_at.split(' ')[0],
            price: `NT$ ${order.final_price}`,
            status: [order.order_status_text],
          },
        ];

        // 收件人資料
        memberData.value = [
          {
            name: order.recipient,
            phone: order.recipient_phone,
            address: order.shopping_address,
            tracking_number: order.order_status_text !== '待確認' ? order.tracking_number : '無',
          },
        ];

        // 商品資料
        productData.value = [
          ...items.map((item) => ({
            product_id: item.product_id,
            name: item.product_name,
            number: item.quantity,
            uni_price: `NT$ ${item.unit_price}`,
            price: `NT$ ${item.subtotal}`,
          })),
          {
            product_id: '',
            name: '運費',
            number: '1',
            uni_price: `NT$ ${order.freight}`,
            price: `NT$ ${order.freight}`,
          },
        ];
      }
    } catch (err) {
      showToast('取得訂單失敗', 'error');
    }
  };

  const updateOrder = async () => {
    if (!orderData.value[0]) return; // 確保有資料

    const status = Array.isArray(orderData.value[0].status)
      ? orderData.value[0].status[0]
      : orderData.value[0].status;

    try {
      const { data } = await patchOrder({
        order_id: route.params.id,
        order_status: status,
      });

      if (data.status === 'success') {
        toastStore.showToast('訂單更新成功', 'success');
        await loadOrderItem();
      } else {
        showToast(data.message || '訂單更新失敗', 'error');
      }
    } catch (error) {
      showToast(error.response?.data?.message || error.message || '系統錯誤', 'error');
    }
  };

  const goToOrder = () => {
    router.push({ name: 'order' });
  };

  onMounted(() => {
    loadOrderItem();
  });
</script>

<template>
  <div class="order-detail">
    <TheDetailHeader
      title="訂單管理"
      @save="updateOrder"
      @cancel="goToOrder"
    />
    <Table_el
      :table-data="orderData"
      :columns="orderColumns"
    ></Table_el>
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
