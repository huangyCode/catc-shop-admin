import request from '@/utils/fetch';

export async function queryRule(params) {
  let data = { page: params.current, size: params.pageSize };
  let res = await request('/account/getList', {
    method: 'POST',
    data,
  });
  let result = res.data;
  result.data = result.list;
  delete result.list;

  return result;
}
export async function queryBrand(params) {
  let res = await request('/brand/getAll', {
    method: 'GET',
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
  return request('/account/add', {
    method: 'POST',
    data: { ...params },
  });
}

export async function updateRule(params) {
  return request('/account/update', {
    method: 'POST',
    data: { ...params },
  });
}
