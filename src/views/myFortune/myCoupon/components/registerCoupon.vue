<template>
  <div class="register-coupon-container">
    <el-form :inline="true" :model="form" label-width="96px">
      <el-form-item label="抵用券码:" prop="ticketCode">
        <el-input v-model="form.ticketCode" size="large"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="ticketCodeEncrypt">
        <el-input v-model="form.ticketCodeEncrypt" size="large"></el-input>
      </el-form-item>
      <el-button type="primary" @click="register" :disabled="disabled" size="large">激活</el-button>
    </el-form>
  </div>
</template>

<script>
import netAPI from '@/api';
export default {
  components: {},
  props: {},
  data() {
    return {
      disabled: false,
      form: {
        ticketCode: '',
        ticketCodeEncrypt: ''
      }
    };
  },
  created() {
  },
  methods: {
    // 激活
    register() {
      if (this.form.ticketCode === '') {
        this.$message({
          type: 'warning',
          message: '请输入抵用券码'
        });
        return false;
      }
      if (this.form.ticketCodeEncrypt === '') {
        this.$message({
          type: 'warning',
          message: '请输入抵用券密码'
        });
        return false;
      }
      this.disabled = true;
      netAPI.registerCoupon(this.form).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '激活成功'
          });
          // this.$ref['form'].resetFields();
          this.form.ticketCode = '';
          this.form.ticketCodeEncrypt = '';
        }
      }).finally(() => {
        this.disabled = false;
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.register-coupon-container /deep/ {
  background-color: white;
  margin-left: 15px;
  .el-form-item__label {
    color: #333;
  }
  .el-input__inner {
    width: 300px;
  }
}
</style>
