import request from '@/utils/request';

export default {
  // 积分明细列表
  integralDetailList(data) {
    return request({
      url: '/userintegral/userintegraldetail',
      method: 'get',
      params: data
    });
  },
  // 获取优惠券面额
  getCouponCollect() {
    return request({
      url: '/pointmall',
      method: 'get'
    });
  },
  // 兑换优惠券
  exchangeCoupon(data) {
    return request({
      url: '/pointmall',
      method: 'post',
      data: data
    });
  },
  // 查询不同状态优惠券
  getCouponList(data) {
    return request({
      url: '/pointmall/couponinfo',
      method: 'get',
      params: data
    });
  },
  // 激活优惠券
  registerCoupon(data) {
    return request({
      url: '/pointmall/activecoupon',
      method: 'post',
      data: data
    });
  },
  // 经验值明细
  translateList(data) {
    return request({
      url: '/userexp/getUserExpDetail',
      method: 'get',
      params: data
    });
  },
  // 是否是圆卡用户
  isUnicomUser(data) {
    return request({
      url: '/user/queryunicomuser',
      method: 'get',
      params: data
    });
  },
  // 查询用户流量信息
  getUnicomInfo(data) {
    return request({
      url: '/user/unicomflowinfo',
      method: 'get',
      params: data
    });
  },
  // 用户流量明细
  getUnicomList(data) {
    return request({
      url: '/user/userflowpagequery',
      method: 'get',
      params: data
    });
  },
  // 用户兑换流量
  extractuserflow(data) {
    return request({
      url: '/user/extractuserflow',
      method: 'post',
      data: data
    });
  }
};
