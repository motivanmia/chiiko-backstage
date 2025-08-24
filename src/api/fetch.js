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
