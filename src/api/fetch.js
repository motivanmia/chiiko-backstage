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

// -------------以下舊的
export function getCarts() {
  return request({
    url: `${url.cart}/get_carts.php`,
    method: 'get',
  });
}

export function postCart(data) {
  return request({
    url: `${url.cart}/post_cart.php`,
    method: 'post',
    data,
  });
}

export function patchCart(data) {
  return request({
    url: `${url.cart}/patch_cart.php`,
    method: 'patch',
    data,
  });
}

export function deleteCart(data) {
  return request({
    url: `${url.cart}/delete_cart.php`,
    method: 'delete',
    data,
  });
}

export function deleteCarts(data) {
  return request({
    url: `${url.cart}/delete_carts.php`,
    method: 'delete',
    data,
  });
}

/**
 * 建立訂單 POST
 * @export
 * @param {String} postId 貼文ID
 * @param {Number} amt 金額
 * @param {String} description 商品說明
 * @return {Object} - HTTP request post
 */
export function postCreateOrder({ postId, amt, description }) {
  return request({
    url: `${url.payment}/createOrder`,
    method: 'post',
    data: {
      postId,
      amt,
      description,
    },
  });
}

/**
 * 取得訂單資訊 GET
 * @export
 * @param {String} orderId 訂單ID
 * @return {Object} - HTTP request get
 */
export function getOrderInfo(orderId) {
  return request({
    url: `${url.payment}/getOrderInfo/${orderId}`,
    method: 'get',
  });
}
