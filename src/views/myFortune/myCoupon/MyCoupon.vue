<template>
  <div class="my-coupon-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未使用" name="unuse">
        <un-use :list="list"></un-use>
      </el-tab-pane>
      <el-tab-pane label="已使用" name="used">
        <used :list="list"></used>
      </el-tab-pane>
      <el-tab-pane label="已过期" name="over">
        <over :list="list"></over>
      </el-tab-pane>
      <el-tab-pane label="抵用券激活" name="register">
        <register-coupon></register-coupon>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import netAPI from '@/api';
import unUse from './components/unUse';
import used from './components/used';
import over from './components/over';
import registerCoupon from './components/registerCoupon';
const ACTIVE_NAME = {unuse: 1, used: 2, over: 3};
export default {
  name: 'MyCoupon',
  components: {unUse, used, over, registerCoupon},
  data() {
    return {
      activeName: 'unuse',
      limit: 9999,
      pageNo: 1,
      list: []
    };
  },
  created() {
    this.getUnused();
  },
  methods: {
    // 切换tab页
    handleClick({name}) {
      this.list = [];
      if (name !== 'register') {
        netAPI.getCouponList({
          status: ACTIVE_NAME[name]
        }).then(res => {
          this.list = res;
        });
      }
    },
    getUnused() {
      netAPI.getCouponList({
        status: 1
      }).then(res => {
        this.list = res;
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.my-coupon-container /deep/ {
  background-color: white;
  margin-top:20px;
  .el-tabs__header {
    margin:0 0 20px;
    height:60px;
    line-height: 60px;
  }
  .el-tabs__nav-scroll {
    margin-left:40px;
  }
  .el-tabs__item.is-active {
    font-weight: bold;
  }
  .box {
    display: inline-block;
  }
  .ticket-btn {
    display: inline-block;
    text-align: center;
    line-height: 28px;
    width: 100px;
    height: 28px;
    color: white;
    font-size: 16px;
    border: 1px solid white;
    cursor: pointer;
  }
}
</style>
