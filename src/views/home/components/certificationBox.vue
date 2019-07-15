<template>
<div class="cert_box">
        <el-form :model="smsform" ref="cert_form" :rules="rules">
          <el-form-item label="手机号码" label-width="100px" prop="mobile">
            <el-input v-model="smsform.mobile" autocomplete="off" :disabled="true" style="width:410px;"></el-input>
          </el-form-item>
          <el-form-item label="短信验证码" label-width="100px"  prop="verifyCode">
            <el-input  :maxlength="6" placeholder="输入短信验证码" v-model="smsform.verifyCode" style="width:310px;"></el-input>
            <el-button class="smscode-btn" @click="getCode" :disabled="timeText >= 0">{{timeText >= 0 ? timeText + 's' : '获取验证码'}}</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit">确定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
 </div>
</template>

<script>
import netAPI from '@/api';
import Cookies from 'js-cookie';
import timeText from '@/mixins/timeText';
export default {
  name: 'certificationBox',
  mixins: [timeText],
  components: {},
  watch: {
  },
  computed: {
  },
  data() {
    return {
      smsform: {
        verifyCode: '',
        mobile: this.$store.state.user.userName
      },
      rules: {
        verifyCode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      timeText: '获取验证码'
    };
  },
  created() {
  },
  methods: {
    getCode() {
      if (this.smsform.mobile === '') {
        this.$message({
          type: 'warning',
          message: '手机号不能为空'
        });
        return false;
      }
      netAPI.getOrderSmsCode(this.smsform.mobile).then(() => {
        let time = 60;
        Cookies.set('smsCode22', new Date(), { expires: (1 / (24 * 60)) });
        this.timeText = time;
        this.setText();
      }).catch(() => {
      });
    },
    submit() {
      let data = {
        phoneNo: this.smsform.mobile,
        smsCode: this.smsform.verifyCode
      };
      this.$refs['cert_form'].validate(valid => {
        if (valid) {
          netAPI.checkSmsCode(data).then(res => {
            if (res && res.status) {
              // 再调用一次
              this.$emit('cert-submit', this.smsform.verifyCode);
              this.cancel();
            } else {
              this.$message({
                type: 'warning',
                message: res && res.message
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.smsform.verifyCode = '';
      this.$refs['cert_form'].resetFields();
      this.$emit('cert-close');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.cert_box /deep/ {
  .dialog-footer {
    text-align: center;
  }
}
</style>
