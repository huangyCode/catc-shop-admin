import request from '@/utils/fetch';
export async function getDetail() {
  let r = await request('/merchant/shopDetail', {
    method: 'GET',
  });
  return r.data;
}
export async function updateDetail(params) {
  return request('/merchant/shopUpdate', {
    method: 'POST',
    data: { ...params },
  });
}

export async function getServices() {
  let r = await request('/service/listByShop', {
    method: 'GET',
  });
  return r.data;
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
