<template>
  <div class="template-info-box">
    <el-form ref="form" label-width="145px">
      <el-row style="border-bottom: 1px solid #CCCCCC;">
        <el-col class="form-block" :span="12" style="border-right: 1px solid #CCCCCC;">
          <img class="block-title-icon" src="@/assets/images/jijianren@2x.png">
          <el-form-item label="姓名：">
            <el-input style="width: calc(100% - 40px);max-width: 420px;" placeholder="请输入寄件人姓名"></el-input>
            <div style="display: inline-block; cursor: pointer; text-align: center; vertical-align: middle;">
              <img src="@/assets/images/adress@2x.png" style="width: 20px; height: 20px;">
              <p style="margin: 0px; padding: 0px;font-size: 12px; color: #333333; line-height: 12px;">地址簿</p>
            </div>
          </el-form-item>
          <el-form-item label="联系方式：">
            <el-input style="width: calc(100% - 40px);max-width: 420px;" placeholder="手机号/固话"></el-input>
          </el-form-item>
          <el-form-item label="所属区域：">
            <el-select style="width: calc(100% - 40px);max-width: 420px;" placeholder="请选择">
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址：">
            <el-input style="width: calc(100% - 40px);max-width: 420px;" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <a @click="smartInputShow1 = !smartInputShow1" style="margin-left: 145px;" class="like-btn">智能录入</a>
          <template v-if="smartInputShow1">
            <el-form-item>
              <el-input
                  style="width: calc(100% - 40px);max-width: 420px;"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  placeholder="如：张三，XX省XX市XX街道，13112345678">
              </el-input>
            </el-form-item>
            <div class="btn-tool-bar">
              <a class="like-btn black">清空</a>
              <el-button>一键录入</el-button>
            </div>
          </template>
        </el-col>
        <el-col class="form-block" :span="12">
          <img class="block-title-icon" src="@/assets/images/shoujianren@2x.png">
          <el-form-item label="姓名：">
            <el-input style="width: calc(100% - 40px);max-width: 420px;" placeholder="请输入收件人姓名"></el-input>
            <div style="display: inline-block; cursor: pointer; text-align: center; vertical-align: middle;">
              <img src="@/assets/images/adress@2x.png" style="width: 20px; height: 20px;">
              <p style="margin: 0px; padding: 0px;font-size: 12px; color: #333333; line-height: 12px;">地址簿</p>
            </div>
          </el-form-item>
          <el-form-item label="联系方式：">
            <el-input style="width: calc(100% - 40px);max-width: 420px;" placeholder="手机号/固话"></el-input>
          </el-form-item>
          <el-form-item label="所属区域：">
            <el-select style="width: calc(100% - 40px);max-width: 420px;" placeholder="请选择">
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址：">
            <el-input style="width: calc(100% - 40px);max-width: 420px;" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <a @click="smartInputShow2 = !smartInputShow2" style="margin-left: 145px;" class="like-btn">智能录入</a>
          <template v-if="smartInputShow2">
            <el-form-item>
              <el-input
                  style="width: calc(100% - 40px);max-width: 420px;"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  placeholder="如：张三，XX省XX市XX街道，13112345678">
              </el-input>
            </el-form-item>
            <div class="btn-tool-bar">
              <a class="like-btn black">清空</a>
              <el-button>一键录入</el-button>
            </div>
          </template>
        </el-col>
      </el-row>
      <div style="text-align: center; height: 40px; margin-top: 20px;">
        <el-button type="primary">确定</el-button>
        <el-button type="info" plain>取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
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
.template-info-box {
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
