/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { getPageQuery } from '@/utils/utils';
import { history } from 'umi';
import { stringify } from 'querystring';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response } = error;

  if (response && response.code) {
    const errorText = codeMessage[response.code] || response.msg;
    const { code, url } = response;
    notification.error({
      message: `请求错误 ${code}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  if (options.headers === undefined) {

  } else if (options.headers) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': sessionStorage.getItem("access_token"),
      'refresh_token': sessionStorage.getItem("refresh_token"),
    };
    return (
      {
        url: url,
        options: { ...options, headers: headers },
      }
    );
  } else {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': sessionStorage.getItem("access_token"),
    };
    return (
      {
        url: url,
        options: { ...options, headers: headers },
      }
    );
  }
  return (
    {
      url: url,
      options: { ...options },
    }
  );
})

// response拦截器, 处理response
request.interceptors.response.use(async (response, options) => {
  // console.log(response.url.substring(response.url.indexOf('/api'), response.url.length))
  const data = await response.clone().json()
  if (data.code == 4010001) { //凭证过期重新登录
    notification.error({
      message: data.msg || '凭证过期请重新登录',
    })
    localStorage.clear()
    const { redirect } = getPageQuery();
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      })
    }
  } else if (data.code === 4010002) {//刷新token
    request('/api/user/token').then(data => {
      if (data !== undefined) {
        if (data.code === 0) {
          notification.error({
            message: '权限以更改请重新登录',
          })
          request('api/user/logout')
          localStorage.clear()
          const { redirect } = getPageQuery();
          if (window.location.pathname !== '/user/login' && !redirect) {
            history.replace({
              pathname: '/user/login',
              search: stringify({
                redirect: window.location.href,
              }),
            })
          }
          return;
          //刷新成功重新请求
          // sessionStorage.setItem('access_token', data.data)
          // setTimeout(
          //   request(response.url.substring(response.url.indexOf('/api'), response.url.length), {
          //     method: options.method,
          //     data: options.data
          //   })
          //   , 5000)
          // setTimeout(
          //   request('/api/user/permissions').then(data => {
          //     if (data !== undefined) {
          //       if (data.code === 0) {
          //         localStorage.setItem('antd-pro-authority', JSON.stringify(data.data))
          //       }
          //     }
          //   })
          //   , 5000)

          // //被修改权限用户刷新页面
          // window.location.reload(true)
        } else {
          request('/api/user/logout')
          localStorage.clear()
          const { redirect } = getPageQuery();
          if (window.location.pathname !== '/user/login' && !redirect) {
            history.replace({
              pathname: '/user/login',
              search: stringify({
                redirect: window.location.href,
              }),
            })
          }
        }
      }
    })
  } else if (data.code === 0) {
    return response
  } else if (data.code === 4030001) {
    notification.error({
      message: data.msg || '无权限访问',
    })
    return;
  } else if (data.code === 5000001) {
    notification.error({
      message: data.msg || '网络异常',
    })
    return;
  } else if (data.code === 4001000) {
    notification.error({
      message: data.msg || '网络异常',
    })
    localStorage.clear()
    sessionStorage.clear()
    const { redirect } = getPageQuery();
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      })
    }
  }
  else {
    return response
  }
});

export default request;
