export const dropOptions = [
  { value: '待確認', label: '待確認' },
  { value: '已出貨', label: '已出貨' },
  { value: '已完成', label: '已完成' },
  { value: '取消/退貨', label: '取消/退貨' },
];

export const orderColumns = [
  { prop: 'order_id', label: '訂單編號' },
  { prop: 'member_id', label: '會員編號' },
  { prop: 'date', label: '訂單日期' },
  { prop: 'price', label: '金額' },
  { prop: 'status', label: '訂單狀態', type: 'cascader', options: dropOptions },
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
