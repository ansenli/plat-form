import request from '@/utils/request';
import qs from 'qs';

export default {
  // 获取订单列表
  getOrderList(query) {
    return request({
      url: '/order/search',
      method: 'get',
      params: query
    });
  },
  // 获取订单走件
  getOrderWalkingPieceMess(query) {
    return request({
      url: '/waybillinfo',
      method: 'get',
      params: { traceItemRequest: query },
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      }
    });
  },
  // 获取订单详情
  getOrderDetail(query) {
    return request({
      url: '/order/detail',
      method: 'get',
      params: query
    });
  },
  // 获取数量
  getOrderCount(query) {
    return request({
      url: '/order/count',
      method: 'get',
      params: query
    });
  },
  // 根据id获取催件信息
  urgeMessById(id) {
    return request({
      url: '/urge/getUrgeByOrderId',
      method: 'get',
      params: { orderId: id }
    });
  },
  // 获取催件列表
  urgeList(data) {
    return request({
      url: '/urge/search',
      method: 'get',
      params: data
    });
  },
  // 保存催件内容
  urgeSave(data) {
    return request({
      url: '/urge/saveUrge',
      method: 'post',
      data: data
    });
  },
  // 获取投诉列表
  complainList(data) {
    return request({
      url: '/complain/h5/list', // '/complain/search',
      method: 'post',
      data: data
    });
  },
  // 保存投诉内容
  complainSave(data) {
    return request({
      url: '/complain/h5/insert',
      method: 'post',
      data: data
    });
  },
  // 根据投诉id获取投诉信息
  complainMessByComId(data) {
    return request({
      url: '/complain/h5/detail', // '/complain/getComplainDetail',
      method: 'post',
      data: data
    });
  },
  // 根据id获取投诉信息
  complainMessById(id, mailNo) {
    return request({
      url: '/complain/getLastComplain',
      method: 'get',
      params: { orderId: id, mailNo: mailNo, complainType: 0 }
    });
  },
  // 获取投诉大类
  getBigProblem(waybillNo) {
    return request({
      url: '/complain/getBigProblem',
      method: 'post',
      data: { waybillNo: waybillNo }
    });
  },
  // 获取投诉小类
  getSmallProblem(bigId) {
    return request({
      url: '/complain/getSmallProblem',
      method: 'post',
      data: { bigProblemId: bigId }
    });
  },
  // 是否可以评价
  isEvaluate(data) {
    return request({
      url: '/orderemp/evaluate',
      method: 'get',
      params: data
    });
  },
  // 获取评价
  getEvalMess(data) {
    return request({
      url: '/ordercomment/commment',
      method: 'get',
      params: data
    });
  },
  // 收件派件员
  empMess(data) {
    return request({
      url: '/orderemp',
      method: 'get',
      params: data
    });
  },
  // 保存评价
  saveEvaluate(data) {
    return request({
      url: '/ordercomment',
      method: 'post',
      data: data
    });
  },
  // 取消订单
  cancelOrder(data) {
    return request({
      url: '/order/cancel',
      method: 'post',
      data: data
    });
  }
};
