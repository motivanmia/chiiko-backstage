export const orderColumns = [
  { prop: 'order_id', label: '訂單編號' },
  { prop: 'member_id', label: '會員編號' },
  { prop: 'date', label: '訂單日期' },
  { prop: 'price', label: '金額' },
  { prop: 'status', label: '訂單狀態', type: 'status' },
];

export const memberColumns = [
  { prop: 'name', label: '收件人姓名', width: 200 },
  { prop: 'phone', label: '收件人電話', width: 200 },
  { prop: 'address', label: '收件地址' },
];

export const productColumns = [
  { prop: 'product_id', label: '商品編號' },
  { prop: 'name', label: '商品名稱' },
  { prop: 'number', label: '數量' },
  { prop: 'uni_price', label: '單價' },
  { prop: 'price', label: '小計' },
];

export const dropOptions = [
  { value: 'pending', label: '待確認' },
  { value: 'shipped', label: '已出貨' },
  { value: 'cancel', label: '取消' },
  { value: 'completed', label: '已完成' },
];
