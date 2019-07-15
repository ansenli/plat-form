<template>
  <el-dialog
      class="protocol-info-dialog"
      title="会员注册服务协议"
      :visible.sync="dialogVisible"
      width="500px"
      height="60vh"
      center>
    <div class="content">
      <el-scrollbar style="height: calc(60vh - 122px);" wrapClass="yto-x-auto">
        <slot></slot>
      </el-scrollbar>
    </div>
    <span slot="footer" class="dialog-footer">
      <a @click="dialogVisible = false">我知道了</a>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible'],
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    dialogVisible(newVal) {
      this.$emit('update:visible', newVal);
    }
  },
  data() {
    return {
      dialogVisible: this.visible
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.protocol-info-dialog /deep/ {
  .el-dialog {
    width: 620px!important;
    border-radius: 8px;
    .el-dialog__header {
      border: none;
      padding: 20px;
      .el-dialog__title {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .el-dialog__body {
      padding: 20px;
      margin-left: 20px;
      margin-right: 20px;
      background-color: #F7F7F7;
      border-radius: 5px;
    }
    .el-dialog__footer {
      padding: 20px;
    }
  }
  .protocol-link {
    font-size: 14px;
    color: #AC41EB;
    cursor: pointer;
  }
  .content {
    background-color: #F7F7F7;
  }
  .dialog-footer {
    a {
      font-size: 16px;
      color: #47086C;
      cursor: pointer;
    }
  }
}
</style>
