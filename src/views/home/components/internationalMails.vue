<template>
  <div class="international-mail-box">
    <el-row style="border-bottom: 1px solid #c0c4cc; display: flex;">
      <el-col :span="12" style="border-right: 1px solid #c0c4cc;">
        <international-base-mail-component type="send"></international-base-mail-component>
      </el-col>
      <el-col :span="12">
        <international-base-mail-component type="receive"></international-base-mail-component>
      </el-col>
    </el-row>
    <el-row style="border-bottom: 1px solid #c0c4cc; display: flex;">
      <el-col :span="12" style="border-right: 1px solid #c0c4cc;">
        <international-increment-mail-component></international-increment-mail-component>
      </el-col>
      <el-col :span="12">
        <international-goods-mail-component></international-goods-mail-component>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import internationalBaseMailComponent from './internationalBaseMailComponent';
import internationalIncrementMailComponent from './internationalIncrementMailComponent';
import internationalGoodsMailComponent from './internationalGoodsMailComponent';
export default {
  components: {internationalBaseMailComponent, internationalIncrementMailComponent, internationalGoodsMailComponent},
  props: {},
  data() {
    return {
      smartInputShow1: false,
      smartInputShow2: false
    };
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.international-mail-box {
  .form-block {
    /*padding: 30px 115px 20px 80px;*/
    .block-title-icon {
      position: relative;
      left: 20px;
      top: 0px;
      width: 20px;
      height: 36px;
    }
  }
  .btn-tool-bar {
    display: inline-block;
    max-width: 420px;
    width: calc(100% - 145px);
    margin-left: 145px;
    text-align: right;
  }
}
.like-btn {
  font-size: 14px;
  color: #47086C;
  cursor: pointer;
  &.black {
    color: #666666;
  }
}
</style>
