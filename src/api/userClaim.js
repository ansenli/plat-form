import request from '@/utils/request';

export default {
  //  获取用户理赔信息
  getUserClaim(data) {
    return request({
      url: '/claim',
      method: 'get',
      params: data
    });
  },
  //  会员撤销理赔
  revokeUserClaim(data) {
    return request({
      url: '/claim/cancelstatus',
      method: 'post',
      data: data
    });
  },
  //  会员留言推送C5
  sendMemberMessage(data) {
    return request({
      url: '/claim/feedback',
      method: 'post',
      data: data
    });
  },
  //  会员理赔证件上传
  IDuplaod(data) {
    return request({
      url: '/claim',
      method: 'post',
      data: data
    });
  },
  //  会员留言
  memberMessage(data) {
    return request({
      url: '/claim/voicemail',
      method: 'get',
      params: data
    });
  },
  // 获取工单详情信息
  claimDetail(data) {
    return request({
      url: '/claim/claimdetail',
      method: 'post',
      params: data
    });
  },
  // 获取工单详情信息
  claimInfo(data) {
    return request({
      url: '/claim/claiminfo',
      method: 'post',
      params: data
    });
  }

};
