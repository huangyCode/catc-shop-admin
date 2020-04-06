import { stringify } from 'querystring';
import { router } from 'umi';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import request from '@/utils/fetch';
import MD5 from '@/utils/MD5';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      //{userName: "admin", password: "ant.design", type: "account"}
      let res = yield request('/admin/signIn', {
        method: 'POST',
        data: { userName: payload.userName, password: MD5(payload.password) },
      });
      if (res.code == 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: res.data || {},
        }); // Login successfully
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        // console.log(params);
        // if (redirect) {
        //   console.log(111111)
        //   const redirectUrlParams = new URL(redirect);
        //
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   }
        //   return router.replace(redirect);
        // }
        router.replace('/');
      }
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      if (localStorage.getItem('brandId')) {
        localStorage.removeItem('brandId');
      }
      localStorage.removeItem('token');
      localStorage.removeItem('antd-pro-authority');
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log(payload.currentAuthority);
      localStorage.setItem('merchantId', payload.merchantId);
      setAuthority('admin');
      localStorage.setItem('token', payload.token); // auto reload
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
