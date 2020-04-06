import request from '@/utils/fetch';

export async function queryRule(params) {
  if (params.name) {
    params.productName = params.name;
    delete params.name;
  }
  let data = { page: params.current, size: params.pageSize, ...params };
  delete data.current;
  delete data.pageSize;
  let res = await request('/product/getList', {
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
  return res.data || null;
}

export async function classesList() {
  let res = await request('/productSort/getAll', {
    method: 'POST',
  });
  return res.data || null;
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
export async function shelve(params) {
  return request('/product/batchOnOffShelve', {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateRule(params) {
  return request('/product/update', {
    method: 'POST',
    data: { ...params },
  });
}

export async function updateStatus(params) {
  return request('/product/onOffShelve', {
    method: 'POST',
    data: { ...params },
  });
}

export async function updateVerifyStatus(params) {
  return request('/product/audit', {
    method: 'POST',
    data: { ...params },
  });
}
