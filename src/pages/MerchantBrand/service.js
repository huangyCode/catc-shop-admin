import request from '@/utils/fetch';
export async function queryRule(params) {
  let data = { page: params.current, size: params.pageSize };
  let res = await request('/brand/getList', {
    method: 'POST',
    data,
  });
  let result = res.data;
  result.data = result.list;
  delete result.list;

  return result;
}
export async function removeRule(uid) {
  return request('/brand/delete', {
    method: 'GET',
    params: { uid },
  });
}

export async function addRule(params) {
  return request('/brand/add', {
    method: 'POST',
    data: { ...params },
  });
}

export async function updateRule(params) {
  return request('/brand/update', {
    method: 'POST',
    data: { ...params },
  });
}
