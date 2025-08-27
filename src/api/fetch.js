import url from './url';
import request from '@/utils/request';

// 註冊
export function signUp(data) {
  return request({
    url: `${url.users}/admin_signup.php`,
    method: 'post',
    data,
  });
}

export function login(data) {
  return request({
    url: `${url.users}/admin_login.php`,
    method: 'post',
    data,
  });
}

export function logout() {
  return request({
    url: `${url.users}/admin_logout.php`,
    method: 'get',
  });
}

export function getMember() {
  return request({
    url: `${url.member}/get_member.php`,
    method: 'get',
  });
}

export function patchMember(data) {
  return request({
    url: `${url.member}/patch_member.php`,
    method: 'patch',
    data,
  });
}

export function getOrders() {
  return request({
    url: `${url.order}/get_orders.php`,
    method: 'get',
  });
}

export function getOrderItem(data) {
  return request({
    url: `${url.order}/get_order_items.php?order_id=${data.order_id}`,
    method: 'get',
  });
}

export function patchOrder(data) {
  return request({
    url: `${url.order}/patch_order.php`,
    method: 'patch',
    data,
  });
}

export function getProducts() {
  return request({
    url: `${url.product}/get_product.php`,
    method: 'get',
  });
}

export function getProductsCategory() {
  return request({
    url: `${url.product}/get_product_category.php`,
    method: 'get',
  });
}

export function patchProducts(id, payload) {
  return request({
    url: `${url.product}/patch_product.php?product_id=${id}`,
    method: 'patch',
    data: payload,
  });
}

export function patchProductsActive(id, payload) {
  return request({
    url: `${url.product}/patch_product_active.php`,
    method: 'patch',
    data: payload,
  });
}

export function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  return request({
    url: `${url.product}/patch_product.php`,
    method: 'post', // 圖片上傳必須使用 'post' 方法
    data: formData, // 將 FormData 物件作為 payload
  });
}

export function createProducts(payload) {
  return request({
    url: `${url.product}/post_product.php`,
    method: 'post',
    data: payload,
  });
}
