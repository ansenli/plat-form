import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/index';
import { getStore, removeStore, setStore } from '@/utils/localStorage';
import Layout from '@/views/layout/Index';
import Cookies from 'js-cookie';
// import { isNull } from '@/utils/common';
// import user from "../store/modules/user";

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  base: '',
  routes: [
    // 登录
    {
      path: '/userlogin',
      name: 'Login',
      hidden: true,
      component: () => import('@/views/login/Login')
    },
    {
      path: '/temp',
      name: 'Temp',
      hidden: true,
      component: () => import('@/views/login/Temp')
    },
    // openid和手机号绑定
    {
      path: '/bindmobile',
      name: 'BindMobile',
      hidden: true,
      component: () => import('@/views/login/BindMobile')
    },
    // 注册
    {
      path: '/register',
      name: 'Register',
      hidden: true,
      component: () => import('@/views/register/Register')
    },
    // 忘记密码
    {
      path: '/forget_password',
      name: 'ForgetPassword',
      hidden: true,
      component: () => import('@/views/forgetPassword/ForgetPassword')
    },
    // 主页
    {
      path: '',
      name: 'Index',
      redirect: '/home',
      component: Layout,
      children: [
        // 首页
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/home/Home'),
          hidden: false,
          meta: { title: '首页', icon: 'home', keepAlive: true }
        },
        { // 接口审核模块
          path: 'MyOrderCheck',
          name: 'MyOrderCheck',
          component: () => import('@/views/myOrder/MyOrderCheck'),
          hidden: true,
          meta: { title: '接口审核', icon: '', keepAlive: true },
          childrenShow: true,
          children: [
            {
              path: 'all',
              name: 'all',
              component: () => import('@/views/myOrder/MyOrderCheck'),
              meta: { title: '接口审核1', icon: '', keepAlive: true }
            },
            {
              path: 'unanswered',
              name: 'unanswered',
              component: () => import('@/views/myOrder/MyOrderCheck'),
              meta: { title: '接口审核2', icon: '', keepAlive: true }
            }
          ]
        },
        { // 后台管理模块
          path: 'MyOrderSystem',
          name: 'MyOrderSystem',
          component: () => import('@/views/myOrder/MyOrderSystem'),
          meta: { title: '后台管理', icon: '', keepAlive: true },
          childrenShow: true,
          children: [
            {
              path: 'all',
              name: 'all',
              component: () => import('@/views/myOrder/MyOrderSystem'),
              meta: { title: '后台管理1', icon: '', keepAlive: true }
            },
            {
              path: 'unanswered',
              name: 'unanswered',
              component: () => import('@/views/myOrder/MyOrderSystem'),
              meta: { title: '后台管理2', icon: '', keepAlive: true }
            }
          ]
        },
        // { // 接口对接模块
        //   path: 'myOrder',
        //   name: 'MyOrder',
        //   component: () => import('@/views/myOrder/MyOrder'),
        //   meta: { title: '接口对接', icon: '', keepAlive: true },
        //   childrenShow: true,
        //   children: [
        //     {
        //       path: 'all',
        //       name: 'all',
        //       component: () => import('@/views/myOrder/MyOrder'),
        //       meta: { title: '开发者信息', icon: '', keepAlive: true }
        //     },
        //     {
        //       path: 'unanswered',
        //       name: 'unanswered',
        //       component: () => import('@/views/myOrder/MyOrder'),
        //       meta: { title: '接口管理', icon: '', keepAlive: true }
        //     },
        //     {
        //       path: 'transport',
        //       name: 'transport',
        //       component: () => import('@/views/myOrder/MyOrder'),
        //       meta: { title: '我的电子面单', icon: '', keepAlive: true }
        //     },
        //     {
        //       path: 'haveSignedIn',
        //       name: 'haveSignedIn',
        //       component: () => import('@/views/myOrder/MyOrder'),
        //       meta: { title: '在线API测试', icon: '', keepAlive: true }
        //     },
        //     {
        //       path: 'others',
        //       name: 'others',
        //       component: () => import('@/views/myOrder/MyOrder'),
        //       meta: { title: 'API测试进度', icon: '', keepAlive: true }
        //     }
        //   ]
        // },
        // 接口对接：linkInterFace
        // 开发者信息：developerInformation
        // 接口管理：interfaceManage
        // 我的电子面单：myElectronicList
        // 在线API测试：onlineApiTesting
        // API测试进度：ApiTestProgress
        { // 接口对接模块
          path: 'linkInterFace',
          name: 'LinkInterFace',
          component: () => import('@/views/linkInterFace/LinkInterFace'),
          meta: { title: '接口对接', icon: '', keepAlive: true },
          childrenShow: true,
          children: [
            {
              path: 'developerInformation',
              name: 'DeveloperInformation',
              component: () => import('@/views/linkInterFace/DeveloperInformation'),
              meta: { title: '开发者信息', icon: '', keepAlive: true }
            },
            {
              path: 'interfaceManage',
              name: 'InterfaceManage',
              component: () => import('@/views/linkInterFace/InterfaceManage'),
              meta: { title: '接口管理', icon: '', keepAlive: true }
            },
            {
              path: 'myElectronicList',
              name: 'MyElectronicList',
              component: () => import('@/views/linkInterFace/MyElectronicList'),
              meta: { title: '我的电子面单', icon: '', keepAlive: true }
            },
            {
              path: 'onlineApiTesting',
              name: 'OnlineApiTesting',
              component: () => import('@/views/linkInterFace/OnlineApiTesting'),
              meta: { title: '在线API测试', icon: '', keepAlive: true }
            },
            {
              path: 'apiTestProgress',
              name: 'ApiTestProgress',
              component: () => import('@/views/linkInterFace/ApiTestProgress'),
              meta: { title: 'API测试进度', icon: '', keepAlive: true }
            }
          ]
        },
        { // 接口文档模块
          path: 'MyOrderOther',
          name: 'MyOrderOther',
          component: () => import('@/views/myOrder/MyOrderOther'),
          meta: { title: '接口文档', icon: '', keepAlive: true },
          childrenShow: true,
          children: [
            {
              path: 'all',
              name: 'all',
              component: () => import('@/views/myOrder/MyOrderOther'),
              meta: { title: '平台介绍', icon: '', keepAlive: true }
            },
            {
              path: 'unanswered',
              name: 'unanswered',
              component: () => import('@/views/myOrder/MyOrderOther'),
              meta: { title: '订单服务', icon: '', keepAlive: true }
            },
            {
              path: 'transport',
              name: 'transport',
              component: () => import('@/views/myOrder/MyOrderOther'),
              meta: { title: '查询服务', icon: '', keepAlive: true }
            },
            {
              path: 'haveSignedIn',
              name: 'haveSignedIn',
              component: () => import('@/views/myOrder/MyOrderOther'),
              meta: { title: '物流信息服务', icon: '', keepAlive: true }
            },
            {
              path: 'others',
              name: 'others',
              component: () => import('@/views/myOrder/MyOrderOther'),
              meta: { title: '电子面单服务', icon: '', keepAlive: true }
            },
            {
              path: 'others',
              name: 'others',
              component: () => import('@/views/myOrder/MyOrderOther'),
              meta: { title: '仓配服务', icon: '', keepAlive: true }
            }
          ]
        },
        { // 常见问题配置
          path: 'commonProblems',
          name: 'CommonProblems',
          component: () => import('@/views/commonProblems/CommonProblems'),
          meta: { title: '常见问题', keepAlive: true },
          hidden: false,
          childrenShow: true,
          children: [
            {
              path: 'commonProblemList',
              name: 'CommonProblemList',
              component: () =>
                import('@/views/commonProblems/components/CommonProblemList'),
              meta: { title: '常见问题' }
            },
            {
              path: 'errorCodes',
              name: 'ErrorCodes',
              component: () =>
                import('@/views/commonProblems/components/ErrorCodes'),
              meta: { title: '错误编码' }
            }
          ]
        }
      ]
    }
  ]
});

const whiteList = [
  '/userlogin',
  '/register',
  '/forget_password',
  '/bindmobile',
  '/temp',
  '/home',
  '/customService/myCheckPieces',
  '/newsList',
  '/news/newsDetail/:id'
]; // no redirect whitelist
router.beforeEach((to, from, next) => {
  let token = Cookies.get('jwt-token');
  if (!token) {
    removeStore('userInfo');
    store.commit('SET_NICKNAME', '');
    store.commit('SET_USERNAME', '');
    store.commit('SET_HEADICON', '');
  }
  // 上一页地址
  setStore('previous_page_url', window.location.origin + from.path);
  if (getStore('userInfo')) {
    let userInfo = getStore('userInfo');
    store
      .dispatch('GetUserInfo', userInfo)
      .then(() => {
        // 拉取user_info
        next();
      })
      .catch(() => {
        store.dispatch('FedLogOut');
      });
  } else {
    if (
      whiteList.indexOf(to.path) !== -1 ||
      to.path.indexOf('/news/newsDetail') !== -1
    ) {
      next();
    } else {
      // 为了测试先放开登录验证
      // next('/userlogin');
      next();
    } // 否则全部重定向到登录页
  }
});

export default router;
