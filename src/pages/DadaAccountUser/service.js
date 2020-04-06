import request from '@/utils/fetch';

export async function queryRule(params) {
  let data = {
    page: (params && params.current) || 1,
    size: (params && params.pageSize) || 10,
    ...params,
  };
  delete data.current;
  delete data.pageSize;
  data.brandId = localStorage.getItem('brandId'); // auto reload
  let res = await request('/brand/getWalletBillsList', {
    method: 'POST',
    data,
  });
  let result = res.data;
  result.data = result.list;
  delete result.list;

  return result;
}

export async function getQrUrl(amount) {
  let res = await request('/brand/getRechargeUrl', {
    method: 'POST',
    data: { amount },
  });
  if (res.data) {
    return res.data;
  }
}

export async function checkPay(orderCode) {
  let res = await request('/brand/queryRechargeResult', {
    method: 'POST',
    data: { orderCode },
  });
  if (res.data) {
    return res.data;
  }
}

export async function mineSum() {
  let res = await request('/brand/getBrandWallet', {
    method: 'POST',
  });
  if (res.data) {
    return res.data;
  }
}
