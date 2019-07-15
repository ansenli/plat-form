<template>
  <div class="ms_box">
    <el-dialog  title="下单成功" :visible.sync="dialogVisible" width="500px" center @close="Close">
      <div class="t_box">
        <div class="txtOrder">订单号：{{orderId}}</div>
        <a href="#" class="btn" @click="toOrder">前往我的订单查看</a>
        <div class="tip">小哥一般在2小时内联系您哦，请保持电话畅通</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['visible', 'orderId'],
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    dialogVisible(newVal) {
      this.$emit('update:visible', newVal);
    }
  },
  computed: {},
  data() {
    return {
      dialogVisible: this.visible
    };
  },
  created() {
  },
  methods: {
    Close() {
      this.$emit('to-close');
    },
    toOrder() {
      this.$emit('to-order');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.ms_box /deep/ {
  .el-dialog__title {
    font-size: 16px;
    color: #3482DB;
  }
  .el-dialog__header {
    border-bottom: 0;
  }
  .el-form-item__label {
    color: #333;
  }
  .t_box {
    text-align: center;
    .btn{
       background:#3482DB;
       color:#fff;
       border-radius: 5px;
       width: 150px;
       height: 40px;
       line-height: 40px;
       margin: 20px auto;
       display:block;
       text-decoration: none;
    }
    .tip {
      color:#999;
      font-size:14px;
    }
  }
}
</style>
