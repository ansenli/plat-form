import request from '@/utils/request';

export default {
  // 修改基本信息
  changeMess(data) {
    return request({
      url: '/user/saveuserinfo',
      method: 'post',
      data: data
    });
  },
  // 是否有密码
  hasPassword() {
    return request({
      url: '/user/pass',
      method: 'get'
    });
  },
  // 密码修改
  changePassword(data) {
    return request({
      url: '/user/passwordchange',
      method: 'post',
      data: data
    });
  },
  // 获取消息
  getUserMessages(data) {
    return request({
      url: '/usermessage/message',
      method: 'get',
      params: data
    });
  },
  // 消息已读
  updateUserMessages(data) {
    return request({
      url: '/usermessage',
      method: 'put',
      data: { id: data }
    });
  },
  // 获取地址列表
  getAddressList(data) {
    return request({
      url: '/user/address/getAddressList',
      method: 'post',
      data: data
    });
  },
  // 根据id获取地址信息
  getAddressById(id) {
    return request({
      url: '/user/address/' + id,
      method: 'get'
    });
  },
  // 保存地址
  saveAddress(data) {
    return request({
      url: '/user/address',
      method: 'post',
      data: data
    });
  },
  // 更新地址
  updateAddress(data) {
    return request({
      url: '/user/address',
      method: 'put',
      data: data
    });
  },
  // 删除地址
  deleteAddress(id) {
    return request({
      url: '/user/address/' + id,
      method: 'delete'
    });
  },
  // 获取邀请用户人数
  getFriendCount() {
    return request({
      url: '/userinvitation/userinfo',
      method: 'get'
    });
  },
  // 邀请链接
  getInviteLink() {
    return request({
      url: '/user/QRCodeurl',
      method: 'get'
    });
  },
  // 实名认证
  excuteRealName(data) {
    return request({
      url: '/user/realnameinfo',
      method: 'put',
      data: data
    });
  },
  // 实名认证短信验证码
  sendrealnamesms(data) {
    return request({
      url: '/user/sendrealnamesms',
      method: 'get',
      params: data
    });
  },
  // 获取实名认证信息
  getRealNameInfo() {
    return request({
      url: '/user/realname',
      method: 'get'
    });
  },
  // 会员动态
  getNewsList(data) {
    return request({
      url: '/user/usertrend',
      method: 'get',
      params: data
    });
  },
  // 会员详情
  getNewsDetail(data) {
    return request({
      url: '/user/usertrends',
      method: 'get',
      params: data
    });
  }
};
