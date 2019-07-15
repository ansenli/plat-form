<template>
  <el-form ref="form" label-width="145px">
    <img class="block-title-icon" :src="imgSrc">
    <el-form-item label="姓名：">
      <el-input style="width: calc(100% - 40px);max-width: 420px;" placeholder="Real Name"></el-input>
    </el-form-item>
    <el-form-item label="联系方式：">
      <el-input style="width: calc(100% - 40px);max-width: 420px;" placeholder="Mobile/Telephone"></el-input>
    </el-form-item>
    <el-form-item label="所属区域：">
      <el-select style="width: calc(100% - 40px);max-width: 420px;" placeholder="Province City District">
      </el-select>
    </el-form-item>
    <el-form-item label="详细地址：">
      <el-input style="width: calc(100% - 40px);max-width: 420px;" placeholder="Address"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    type: {
      default: 'send'
    }
  },
  computed: {
    imgSrc() {
      if (this.type === 'send') {
        return require('@/assets/images/jijianren@2x.png');
      } else {
        return require('@/assets/images/shoujianren@2x.png');
      }
    }
  },
  data() {
    return {
      smartInputShow: false
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
