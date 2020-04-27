import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin, loginOut } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {

  },
  effects: {
    *login({ payload }, { call, put }) {

      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully
      if (response.code === 0) {
        yield put({
          type: 'changeAuthorty',
          payload: response,
        }); // Login successfully
        //存token
        localStorage.setItem("access_token", response.data.accessToken);
        localStorage.setItem("refresh_token", response.data.refreshToken);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    *logout(_, { call }) {

      yield call(loginOut);
      //清除token
      localStorage.clear()
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
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
      console.log(payload.msg)
      return { status: payload.code, type: payload.msg };
    },
    changeAuthorty(state, { payload }) {
      setAuthority(payload.data.currentAuthority || '');
      return { status: payload.code, type: payload.msg };
    }
  },
};
export default Model;
