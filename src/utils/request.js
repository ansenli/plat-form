import axios from 'axios';
import Vue from 'vue';
import Cookies from 'js-cookie';
// import router from '@/router'; // 仅仅为了测试后面会放开
import { setStore, removeStore } from '@/utils/localStorage';
import netAPI from '@/api';

// create an axios instance
const service = axios.create({
  baseURL: '/api/', // api的base_url
  // baseURL: 'steward-api', // api的base_url
  timeout: 5000, // request timeout
  headers: {
    source: 'PC'
  }
});
service.interceptors.request.use(
  config => {
    // 网安字段
    config.headers['trace'] = JSON.stringify({
      loginSource: '',
      terminalModel: ''
    });
    // 提交订单接口，未登陆不做统一跳登陆页面处理
    if (config.url === '/order') {
      config.loginType = 1;
    } else if (config.url === '/user/login') {
      config.headers['trace'] = JSON.stringify({
        loginSource: '12',
        terminalModel: '01'
      });
    }
    // console.log('config1', config);
    let token = Cookies.get('jwt-token');
    let expires = Cookies.get('jwt-token-expires');
    var timer = null;
    // console.log(expires);
    if (token) {
      config.headers['jwt-token'] = token;
      if (Date.now() - expires > 600 * 1000) {
        timer = setTimeout(function () {
          // 超过10分钟，则更新下token
          netAPI
            .refresh({ 'jwt-token': token })
            .then(response => {
              let data = response.token;
              // console.log('data=' + data);
              // 设置过期时间为30分钟
              Cookies.set('jwt-token', data, { expires: 1 / (24 * 2) });
              Cookies.set('jwt-token-expires', Date.now(), {
                expires: 1 / (24 * 2)
              });
              clearTimeout(timer);
            })
            .catch(err => {
              console.log('err', err);
              // 设置过期时间为15分钟
              Cookies.set('jwt-token-expires', Date.now(), {
                expires: 1 / (24 * 2) / 2
              });
              clearTimeout(timer);
            });
        }, 3000);
      }
    }
    return config;
  },
  error => {
    // Do something with request error
    Promise.reject(error);
  }
);

// respone interceptor
service.interceptors.response.use(
  res => {
    // console.log('拦截器response：', res);
    let { data, headers } = res;
    if (headers['jwt-token']) {
      Cookies.set('jwt-token', headers['jwt-token'], { expires: 1 / (24 * 2) });
      Cookies.set('jwt-token-expires', Date.now(), { expires: 1 / (24 * 2) });
    }
    // 处理ali pay login
    if (
      headers['alipay-user-id'] &&
      res.config.url === '/api/user/alipayuserid'
    ) {
      // 初始化逻辑
      removeStore('source');
      removeStore('alipay-user-id');
      setStore('alipay-user-id', headers['alipay-user-id']);
      setStore('source', 'ALIPAY_PC');
      // this.$route.push('/bindmobile');
    }
    let type = typeof data;
    switch (type) {
      case 'boolean':
      case 'number':
      case 'string':
        return data;
      case 'object':
        if (!data) {
          return;
        }
        // if (data && (!data.status || isNaN(Number(data.status)))) {
        //   return data;
        // }
        // if (data.status !== '0' && data.status !== 0) {
        //   console.log('请求错误：', data.message);
        //   Vue.prototype.$message({
        //     type: 'warning',
        //     message: data.message
        //   });
        //   return Promise.reject(data);
        // }
        return data;
    }
  },
  error => {
    // console.log('error长时间未操作的返回结果：' , JSON.stringify(error));
    // console.log(error.response.status);
    // const originalRequest = error.config;
    //
    if (
      [401].indexOf(error.response && error.response.status) > -1 &&
      error.config.loginType !== 1
    ) {
      // 刷新token失败，跳转登录页面。
      // console.log('跳转的页面：',window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : ''));
      // 仅仅为了测试后面会放开
      // router.push('/userlogin');
    } else {
      if (
        error.response.data &&
        error.response.data.message &&
        error.config.loginType !== 1
      ) {
        Vue.prototype.$message({
          type: 'warning',
          message: error.response.data.message
        });
      } else {
        if (error.response.data && error.config.loginType !== 1) {
          Vue.prototype.$notify.error({
            title: '错误：' + error.response.status,
            message: '抱歉，请求出错了！'
          });
        }
      }
    }
    // if (error.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //
    //   oauth.refreshToken().then((data) => {
    //     if (data) {
    //       return service.request(originalRequest);
    //     }
    //     // 刷新token失败，跳转登录页面。
    //     oauth.clearAuthInfo();
    //     oauth.redirectToLogin(window.location.href);
    //   });
    // }
    return Promise.reject(error);
  }
);

export default service;
