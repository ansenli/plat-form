import request from '@/utils/request';

export default {
  // 获取保费
  getInsuranceFee(value) {
    return request({
      url: '/order/supportValue',
      method: 'post',
      data: { goodsValue: value }
    });
  },
  // 首页提交订单
  subOrderNormal(data) {
    return request({
      url: '/order',
      method: 'post',
      data: data
    });
  },
  // 批量寄件提交
  subOrderBatch(data) {
    return request({
      url: '/import',
      method: 'post',
      data: { importRequestList: data }
    });
  },
  // 寄件模板列表
  getTemplList() {
    return request({
      url: '/userexpresstemplate/template',
      method: 'get',
      params: { limit: 10, pageNo: 1 }
    });
  },
  // 单条寄件模板
  getTemplById(data) {
    return request({
      url: '/userexpresstemplate/template/id',
      method: 'get',
      params: { id: data }
    });
  },
  // 新增寄件模板
  addTempl(data) {
    return request({
      url: '/userexpresstemplate',
      method: 'post',
      data: data
    });
  },
  // 更新寄件模板
  updateTempl(data) {
    return request({
      url: '/userexpresstemplate',
      method: 'put',
      data: data
    });
  },
  // 删除寄件模板
  deleteTempl(data) {
    return request({
      url: '/userexpresstemplate',
      method: 'delete',
      params: { id: data }
    });
  },
  // 下单短信验证码
  getOrderSmsCode(data) {
    return request({
      url: '/order/sendordersmscode',
      method: 'get',
      params: { userName: data }
    });
  },
  // 优惠券使用
  validQuantity(data) {
    return request({
      url: '/order/validQuantity',
      method: 'get',
      params: { senderPhone: data }
    });
  },
  // 校验短信验证码
  checkSmsCode(data) {
    return request({
      url: '/order/checkSmsCode',
      method: 'get',
      params: data
    });
  },
  // 查询A网时效产品
  searchAgingProduct(data) {
    return request({
      url: '/order/searchAgingProduct',
      method: 'get',
      params: data
    });
  }
};
