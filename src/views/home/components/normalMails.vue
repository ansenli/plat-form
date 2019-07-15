<template>
  <div class="normal-mail-box">
    <el-row style="border-bottom: 1px solid #c0c4cc; display: flex;">
      <el-col :span="12" style="border-right: 1px solid #c0c4cc;">
        <normal-base-mail-component
            ref="sendForm"
            :isAddrShow="true"
            @show-address-book="showAddressBook('send')"
            type="send"
            key="send" :number="this.number" @change-mobile="changeMobile" @change-address="changeAging"></normal-base-mail-component>
        <div @click="showTemplate" class="echelon-btn"></div>
      </el-col>
      <el-col :span="12">
        <normal-base-mail-component
            ref="receiveForm"
            :isAddrShow="true"
            @show-address-book="showAddressBook('receive')"
            type="receive"
            key="receive"
            @change-address="changeAging"></normal-base-mail-component>
      </el-col>
    </el-row>
    <el-row style="border-bottom: 1px solid #c0c4cc; display: flex;">
      <el-col :span="12" style="border-right: 1px solid #c0c4cc;">
        <normal-increment-mail-component ref="increForm" :agingList="agingList" @set-aging="setAging"></normal-increment-mail-component>
      </el-col>
      <el-col :span="12">
        <normal-goods-mail-component ref="goodsForm" @change-weight="changeAging" :couponsList="couponsList"  :number="this.number" :totalCoupon="totalCoupon"  @select-coupon="selectCoupon" :selectAging="selectAging"></normal-goods-mail-component>
        <img @click="deleteOne" src="@/assets/images/delete@2x.png" style="float: right;margin-right: 20px;" v-if="this.number > 1"/>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import normalBaseMailComponent from './normalBaseMailComponent';
import normalIncrementMailComponent from './normalIncrementMailComponent';
import normalGoodsMailComponent from './normalGoodsMailComponent';
export default {
  components: { normalBaseMailComponent, normalIncrementMailComponent, normalGoodsMailComponent },
  props: ['number', 'couponsList', 'totalCoupon', 'agingList'],
  data() {
    return {
      selectAging: ''
    };
  },
  methods: {
    // 显示寄件模板
    showTemplate() {
      this.$emit('show-template');
    },
    // 显示电话簿
    showAddressBook(type) {
      this.$emit('show-address-book', type);
    },
    // 删除此订单
    deleteOne() {
      this.$emit('delete');
    },
    // 选择优惠券
    selectCoupon(value, number) {
      this.$emit('select-coupon', value, number);
    },
    // 寄件人手机号码发生改变
    changeMobile(phone) {
      this.$emit('change-mobile', phone);
    },
    // 寄（收）件人地址改变
    changeAging() {
      this.$emit('change-aging');
    },
    // 改变时效
    setAging(value) {
      this.selectAging = value;
    },
    // 重量改变
    changeWeight() {

    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.normal-mail-box {
  .echelon-btn {
    position: relative;
    top: calc(-50% - 40px);
    left: calc(100% - 30px);
    width: 30px;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 0px;
      height: 80px;
      border-right: 30px solid #47086c;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
    }
    &:after {
      text-align: center;
      position: absolute;
      left: 7px;
      top: 16px;
      width: 14px;
      height: 80px;
      content: '模板寄件';
      color: white;
      font-size: 14px;
    }
  }
}
</style>
