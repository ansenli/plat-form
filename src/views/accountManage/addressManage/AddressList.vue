<template>
<div class="address-box">
  <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="寄件地址管理" name="first">
        <address-manage :showInDialog="true" type="1" key="1"></address-manage>
    </el-tab-pane>
    <el-tab-pane label="收件地址管理" name="second">
        <address-manage :showInDialog="true" type="2"  key="2"></address-manage>
    </el-tab-pane>
  </el-tabs> -->
  <address-manage :showInDialog="true" type="2"  key="2"></address-manage>
</div>
</template>
<script>
import AddressManage from './AddressManage';
export default {
  name: 'AddressList',
  components: { AddressManage },
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.address-box /deep/ {
  margin: 22px 0;
  background-color: #ffffff;
  .el-tabs__header {
    margin: 0 0 20px;
    height: 60px;
    line-height: 60px;
  }
  .el-tabs__item.is-active {
    font-weight: bold;
  }
}
</style>
