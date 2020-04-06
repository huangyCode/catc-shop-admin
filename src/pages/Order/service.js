import request from '@/utils/fetch';

export async function queryRule(params) {
  let data = { page: params.current, size: params.pageSize, ...params };

  let res = await request('/order/getList', {
    method: 'POST',
    data,
  });
  let result = res.data;
  result.data = result.list;
  delete result.list;

  return result;
}

export async function queryBrand() {
  let res = await request('/brand/getAll', {
    method: 'GET',
  });
  return res.data;
}

export async function classesList() {
  let res = await request('/productSort/getAll', {
    method: 'POST',
  });
  return res.data;
}

export async function removeRule(uid) {
  return request('/account/delete', {
    method: 'GET',
    params: { uid },
  });
}

export async function addRule(params) {
  return request('/product/add', {
    method: 'POST',
    data: { ...params },
  });
}

export async function check(params) {
  return request('/product/auditBatch', {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateRule(params) {
  return request('/order/process', {
    method: 'POST',
    data: { ...params },
  });
}

export async function detail(params) {
  return request('/order/getDetail', {
    method: 'POST',
    data: { ...params },
  });
}

export async function getReason() {
  return request('/logistics/dada/getAllOrderCancelReason', {
    method: 'POST',
  });
}

export async function sendReason(params) {
  return request('/logistics/dada/cancelDeliverByBrand', {
    method: 'POST',
    data: { ...params },
  });
}
