export const dropOptions = [
  { value: 'all', label: '所有訂單' },
  { value: 'pending', label: '待確認' },
  { value: 'shipped', label: '已出貨' },
  { value: 'cancel', label: '取消' },
  { value: 'completed', label: '已完成' },
];

export const columns = [
  { prop: 'order_id', label: '訂單編號' },
  { prop: 'member_id', label: '會員編號' },
  { prop: 'date', label: '訂單日期' },
  { prop: 'price', label: '金額' },
  { prop: 'status', label: '訂單狀態' },
  { prop: 'icon', label: '內容', type: 'button-detail', width: 60 },
];
