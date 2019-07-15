<template>
  <el-form ref="form" label-width="145px">
    <img class="block-title-icon" src="@/assets/images/item@2x.png">
    <el-form-item label="物品类型：">
      <template slot="label">
        <div>物品类型：<span style="height: 12px; line-height: 12px;display: block;font-size: 12px;font-weight: normal;">Internal product name&nbsp;&nbsp;</span></div>
      </template>
      <el-select style="width: calc(100% - 40px);max-width: 420px;" placeholder="请选择物品类型">
      </el-select>
    </el-form-item>
    <el-form-item label="物品重量：">
      <template slot="label">
        <div>物品重量：<span style="height: 12px; line-height: 12px;display: block;font-size: 12px;font-weight: normal;">Item weight&nbsp;&nbsp;</span></div>
      </template>
      <el-checkbox label="1KG"></el-checkbox>
      <el-checkbox label="2KG"></el-checkbox>
      <el-checkbox label="3KG"></el-checkbox>
      <el-checkbox label="其他"></el-checkbox>
      <!--<el-input style="width: 100px;"></el-input>KG-->
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {},
  computed: {},
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.block-title-icon {
  position: relative;
  left: 20px;
  top: 0px;
  width: 20px;
  height: 36px;
}
.btn-tool-bar {
  display: inline-block;
  max-width: 420px;
  width: calc(100% - 145px);
  margin-left: 145px;
  text-align: right;
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
