import request from '@/utils/fetch';
export async function queryRule(params) {
  let data = { page: params.current, size: params.pageSize, ...params };
  delete data.current;
  delete data.pageSize;
  let res = await request('/userManage/getList', {
    method: 'POST',
    data,
  });
  let result = res.data;
  result.data = result.list;
  delete result.list;

  return result;
}
