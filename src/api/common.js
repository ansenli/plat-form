import request from '@/utils/request';

export default {
  // 签到
  signedOn() {
    return request({
      url: '/usersignin',
      method: 'post',
      data: {}
    });
  },
  // 获取签到情况
  signedOnStauts() {
    return request({
      url: '/usersignin/signin',
      method: 'get'
    });
  },
  // 获取积分
  getUserIntegral() {
    return request({
      url: '/userintegral/integral',
      method: 'get'
    });
  },
  // 获取经验
  getUserExp() {
    return request({
      url: '/userexp',
      method: 'get'
    });
  },
  // 一键解析
  smartResolve(str) {
    return request({
      url: '/order/smartEntering',
      method: 'post',
      data: { address: str }
    });
  },
  // 获取省市区
  getDistrict(parentCode) {
    return request({
      url: '/region/dreigon',
      method: 'get',
      params: { parentCode: parentCode }
    });
  },
  // 获取图片
  getPictureList(type, off) {
    return request({
      url: '/fileshow/imageurl',
      method: 'get',
      params: { type: type, value: off },
      responseType: 'blob'
    });
  },
  // getPictureIds() {
  //   return request({
  //     url: '/fileshow/files',
  //     method: 'get'
  //   });
  // },
  getBanner() {
    return request({
      url: '/fileshow/filesid',
      method: 'get'
    });
  }
};
