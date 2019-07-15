// import Vue from 'vue';
import request from '@/utils/request';
import qs from 'qs';
// import store from '@/store';
// import router from '@/router';
// import axios from 'axios';
// import qs from 'qs';

export default {
  // 用户名密码登录
  loginByUserName(query) {
    return request({
      url: '/user/login',
      method: 'post',
      params: query
    });
  },
  // 验证码登录
  loginBySmsCode(query) {
    return request({
      url: '/user/login',
      method: 'post',
      params: query
    });
  },
  // 发送登录验证码短信
  sendLoginSmsCode(data) {
    return request({
      url: '/loginsendsms',
      method: 'post',
      params: data
    });
  },
  // 获取短信验证码(未登录)
  getNoLoginMessageSmsCode(query) {
    return request({
      url: '/user/sendregistersmscode',
      method: 'get',
      params: query
    });
  },
  // 获取用户信息
  getUserInfo() {
    return request({
      url: '/user/getuserinfo',
      method: 'get'
    });
  },
  // 注册账户
  registerUser(query, inviteId) {
    if (inviteId !== undefined) {
      return request({
        url: '/user/register?inviteId=' + inviteId,
        method: 'post',
        data: query
      });
    }
    return request({
      url: '/user/register',
      method: 'post',
      data: query
    });
  },
  /*  验证码接口  */
  // 图片验证码
  getPicSmsCode() {
    return request({
      url: '/user/vcode',
      method: 'get'
    });
  },
  // 验证图片验证码
  checkPicSmsCode(data) {
    return request({
      url: '/user/verifycode',
      method: 'get',
      params: data
    });
  },
  // 忘记密码接口
  forgetPassword(query) {
    return request({
      url: '/user/forgetpassword',
      method: 'post',
      data: query
    });
  },
  // 忘记密码发送短信
  forgetSmsCode(query) {
    return request({
      url: '/user/sendforgetsmscode',
      method: 'get',
      params: query
    });
  },
  // 获取头像
  getHeadIcon() {
    return request({
      url: '/fileshow',
      method: 'get',
      responseType: 'blob'
    });
  },
  sendMobileSms(query) {
    return request({
      url: '/user/sendUpdateMobile',
      method: 'get',
      params: query
    });
  },
  vefityMobileSms(query) {
    return request({
      url: '/user/varifyUpdateMobileSms',
      method: 'get',
      params: query
    });
  },
  commitChangeMobile(query) {
    return request({
      url: '/user/updateusername',
      method: 'put',
      data: query
    });
  },
  openAlipayUrl(query) {
    return request({
      url: '/user/alipaycode/' + query.type,
      method: 'get',
      params: query
    });
  },
  bindOpenId(query) {
    return request({
      url: '/user/bindOpenId',
      method: 'post',
      data: query
    });
  },
  sendBindMsg(query) {
    return request({
      url: '/user/sendbindsms',
      method: 'get',
      params: query
    });
  },
  getAlipayUserId(query) {
    return request({
      url: '/user/alipayuserid',
      method: 'get',
      params: query
    });
  },
  // 获取绑定信息
  getBindInfo(query) {
    return request({
      url: '/user/bindingo',
      method: 'get',
      params: query,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      }
    });
  },
  // 解绑
  releaseBind(query) {
    return request({
      url: '/user/releasebind',
      method: 'delete',
      data: query
    });
  },
  // 绑定用户手机号
  bingAlipyUser(query) {
    return request({
      url: '/user/pcbind',
      method: 'POST',
      data: query
    });
  },
  // 刷新token
  refresh(query) {
    return request({
      url: '/user/refresh',
      method: 'put',
      data: query
    });
  }
};
