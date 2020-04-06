import request from '@/utils/fetch';

export async function getDetail() {
  let r = await request('/merchant/shopStaffInfo', {
    method: 'GET',
  });
  return r.data;
}

export async function update(params) {
  return request('/merchant/modifyStaffInfo', {
    method: 'POST',
    data: { ...params },
  });
}

export async function add(params) {
  await request('/merchant/increaseStaffInfo', {
    method: 'POST',
    data: { ...params },
  });
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
