<template>
  <custom-dialog :title="status | orderStatus" :visible.sync="dialogVisible">
    <div class="body" slot="body">
      <div class="custom-flex-box section">
        <div style="flex-grow: 1;">
          <img class="label-icon" src="@/assets/images/yundan@2x.png">
          <label>运单号</label>
          <span class="blue">{{mailNo}}</span>
        </div>
        <div style="flex-grow: 1;">
          <img class="label-icon" src="@/assets/images/dingdan@2x.png">
          <label>订单号</label>
          <span class="blue">{{orderNo}}</span>
        </div>
      </div>
      <div class="section">
        <img class="label-icon" src="@/assets/images/ji@2x.png">
        <div class="inline-box">
          <span>{{senderName}}</span><span>{{senderPhone}}</span><span>{{senderProvinceName + senderCityName + senderDistrictName + senderAddress}}</span>
        </div>
      </div>
      <div class="section">
        <img class="label-icon" src="@/assets/images/shou@2x.png">
        <div class="inline-box">
          <span>{{receiverName}}</span><span>{{receiverPhone}}</span><span>{{receiverProvinceName + receiverCityName + receiverDistrictName + receiverAddress}}</span>
        </div>
      </div>
      <div class="custom-flex-box section">
        <img style="width: 24px;height: 24px; margin-right: 20px;" class="label-icon" src="@/assets/images/wu@2x.png">
        <div style="flex-grow: 1;" class="custom-flex-box wrap mess-box">
          <div class="half-box">
            <label>物品名称</label>
            <span>{{productName}}</span>
          </div>
          <div class="half-box">
            <label>物品重量</label>
            <span v-if="productWeight">{{productWeight}}&nbsp;kg</span>
          </div>
          <div class="half-box">
            <label>时效产品</label>
            <span>{{timeEffort}}</span>
          </div>
          <div class="half-box">
            <label>付款方式</label>
            <span>{{payType}}</span>
          </div>
          <div class="half-box">
            <label>抵用券</label>
            <span>{{couponsMoney}}</span>
          </div>
          <div class="half-box">
            <label>特殊备注</label>
            <span>{{remark}}</span>
          </div>
          <div class="half-box">
            <label>下单时间</label>
            <span>{{createTime | dateFull}}</span>
          </div>
          <div class="half-box">
            <label>声明价值</label>
            <span>{{insurance ? (insurance + '元') : ''}}</span>
          </div>
          <div class="half-box" v-if="predictTakeTime">
            <label>预计取件时间</label>
            <span>{{predictTakeTime | dateFull}}</span>
          </div>
          <div class="half-box" v-if="predictDeliveryTime">
            <label>预计送达时间</label>
            <span>{{predictDeliveryTime | dateYmd}}</span>
            <span class="fh" v-if="compensateStatus">已赔付抵用券</span>
          </div>
        </div>
      </div>
      <div class="w-box">
        <el-collapse>
          <el-collapse-item name="1">
            <template slot="title">
              <img style="margin-left: 24px;margin-right:20px;" class="label-icon" src="@/assets/images/gui@2x.png">
              <span>物流轨迹</span>
            </template>
            <div v-if="items.length === 0" style="text-align: center">暂无走件信息</div>
            <el-scrollbar v-else wrapClass="yto-x-hidden" style="height: 180px;">
              <ul>
                <li v-for="(item, index) in items[0].waybillProcessInfo" :key="index"><p>{{item.waybillProcessInfo.processInfo}}</p><p>{{item.waybillProcessInfo.upload_Time | dateFull}}</p></li>
              </ul>
            </el-scrollbar>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </custom-dialog>
</template>

<script>
import netAPI from '@/api';
import customDialog from './customDialog';
const PAY_TYPE = { 1: '现付' };
export default {
  components: { customDialog },
  props: ['visible', 'orderData'],
  data() {
    return {
      dialogVisible: this.visible,
      mailNo: '',
      orderNo: '',
      senderName: '',
      senderPhone: '',
      senderProvinceName: '',
      senderCityName: '',
      senderDistrictName: '',
      senderAddress: '',
      receiverName: '',
      receiverPhone: '',
      receiverProvinceName: '',
      receiverCityName: '',
      receiverDistrictName: '',
      receiverAddress: '',
      productName: '',
      productWeight: '',
      payType: '',
      remark: '',
      insurance: '',
      createTime: '',
      timeEffort: '',
      items: [],
      status: '',
      couponsMoney: '',
      predictTakeTime: '', // 预计取件时间
      predictDeliveryTime: '', // 承若送达时间
      compensateStatus: false // 原准达赔付状态
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    },
    orderData() {
      if (this.orderData) {
        this.mailNo = this.orderData.mailNo;
        // 有运单号的时候查询走件信息
        if (this.mailNo) {
          netAPI.getOrderWalkingPieceMess(this.mailNo).then(res => {
            if (res instanceof Array) {
              this.items = res;
            }
          });
        } else {
          this.items = [];
        }
        this.orderNo = this.orderData.orderNo;
        this.senderName = this.orderData.senderName;
        this.senderPhone = this.orderData.senderPhone;
        this.senderProvinceName = this.orderData.senderProvinceName;
        this.senderCityName = this.orderData.senderCityName;
        this.senderDistrictName = this.orderData.senderDistrictName;
        this.senderAddress = this.orderData.senderAddress;
        this.receiverName = this.orderData.receiverName;
        this.receiverPhone = this.orderData.receiverPhone;
        this.receiverProvinceName = this.orderData.receiverProvinceName;
        this.receiverCityName = this.orderData.receiverCityName;
        this.receiverDistrictName = this.orderData.receiverDistrictName;
        this.receiverAddress = this.orderData.receiverAddress;
        if (this.orderData.orderProductResponseArrayList) {
          this.productName = this.orderData.orderProductResponseArrayList[0].name;
          this.productWeight = this.orderData.orderProductResponseArrayList[0].weight;
        }
        // if (this.orderData.orderExtendResponseArrayList && JSON.stringify(this.orderData.orderExtendResponseArrayList).indexOf('及时达') > -1) {
        //   this.timeEffort = '及时达';
        // } else {
        //   this.timeEffort = '标准快递';
        // }
        this.timeEffort = this.orderData.agingProductName;

        // 时效产品
        if (this.orderData.orderAgingResponse) {
          let dataAging = this.orderData.orderAgingResponse;
          this.predictDeliveryTime = dataAging.promiseDeliveryTime || dataAging.predictDeliveryTime;// 预计送达时间
          this.predictTakeTime = dataAging.predictTakeTime;// 预计取件时间
          this.compensateStatus = dataAging.compensateStatus === 1;
        } else {
          this.predictDeliveryTime = '';// 预计送达时间
          this.predictTakeTime = '';// 预计取件时间
          this.compensateStatus = false;
        }

        if (this.orderData.orderVasResponseArrayList && this.orderData.orderVasResponseArrayList.length > 0) {
          this.insurance = this.orderData.orderVasResponseArrayList[0].amount;
        } else {
          this.insurance = '';
        }
        this.payType = PAY_TYPE[this.orderData.payType] || '';
        this.remark = this.orderData.remark;
        this.createTime = this.orderData.createTime;
        this.status = this.orderData.status;
        this.couponsMoney = this.orderData.couponsMoney;
      }
    }
  },
  created() {
    // netAPI.getOrderWalkingPieceMess('M00024344500').then(res => {
    // });
  },
  methods: {
    // 打开页面
    open() {
    },
    onClose() {
      this.dialogVisible = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.body {
  .section {
    padding: 20px 10px 20px 20px;
    .blue {
      color: #3482db;
    }
    .inline-box {
      // display: inline-block;
      span {
        &:not(:last-child) {
          margin-right: 20px;
        }
      }
    }
    .mess-box {
      div:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }
  & > div {
    &:not(:last-child) {
      border-bottom: 2px dashed #cccccc;
    }
    .label-icon {
      vertical-align: middle;
      margin-right: 20px;
      float: left;
    }
    label {
      font-size: 14px;
      font-weight: normal;
      color: #999999;
      margin-right: 10px;
    }
    .fh {
      color: #47086c;
      padding: 2px 5px;
      border: 1px solid #47086c;
      border-radius: 20px;
      font-size: 12px;
    }
    p {
      font-size: 14px;
      color: #333333;
      margin: 0;
      padding: 0;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }
    span {
      font-size: 14px;
      color: #333333;
    }
  }
}
.custom-flex-box {
  display: flex;
  &.wrap {
    flex-wrap: wrap;
    .half-box {
      width: 50%;
    }
  }
}

.w-box /deep/ {
  .el-collapse-item__content {
    color: #999;
    font-size: 14px;
  }
}
</style>
