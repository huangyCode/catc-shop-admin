import request from '@/utils/fetch';

export async function queryRule(params) {
  let data = { page: params.current, size: params.pageSize, ...params };
  delete data.current;
  delete data.pageSize;
  let res = await request('/productSort/getList', {
    method: 'POST',
    data,
  });
  let result = res.data;
  result.data = result.list;
  delete result.list;

  return result;
}

export async function removeRule(uid) {
  return request('/productSort/delete', {
    method: 'GET',
    params: { uid },
  });
}

export async function addRule(params) {
  return request('/productSort/add', {
    method: 'POST',
    data: { ...params },
  });
}

export async function updateRule(params) {
  return request('/productSort/update', {
    method: 'POST',
    data: { ...params },
  });
}
