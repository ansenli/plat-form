<template>
  <el-form ref="form" label-width="145px">
    <img class="block-title-icon" src="@/assets/images/zengzhi@2x.png">
    <el-form-item label="时效产品：">
      <template slot="label">
        <div>时效产品：<span style="height: 12px; line-height: 12px;display: block;font-size: 12px;font-weight: normal;">Aging products&nbsp;&nbsp;</span></div>
      </template>
      <el-select style="width: calc(100% - 40px);max-width: 420px;" placeholder=""></el-select>
    </el-form-item>
    <el-form-item label="特殊备注：">
      <template slot="label">
        <div>特殊备注：<span style="height: 12px; line-height: 12px;display: block;font-size: 12px;font-weight: normal;">Special remarks&nbsp;&nbsp;</span></div>
      </template>
      <el-row>
        <el-checkbox label="需要纸箱" border></el-checkbox>
        <el-checkbox label="需要爬楼" border></el-checkbox>
        <el-checkbox label="缺文件袋" border></el-checkbox>
        <el-checkbox label="需要胶带" border></el-checkbox>
        <el-checkbox label="上门前联系" border></el-checkbox>
      </el-row>
      <el-row>
        <el-input style="width: calc(100% - 40px);max-width: 420px;" placeholder="请输入您想对快递小哥说的话" maxlength="50"></el-input>
      </el-row>
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
  color: #47086c;
  cursor: pointer;
  &.black {
    color: #666666;
  }
}
</style>
