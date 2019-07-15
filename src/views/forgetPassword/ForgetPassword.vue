<template>
  <div class="login-wrap">
    <div class="login-container">
      <div class="login-box">
        <img class="login-logo" src="@/assets/images/logo@2x.png" />
        <el-tabs v-model="activeName" class="only-one-tab">
          <el-tab-pane label="忘记密码" name="forget">
            <el-form :model="forgetForm" status-icon :rules="rules" ref="forgetForm" class="form">
              <el-form-item label="" prop="mobile">
                <el-input :maxlength="11" placeholder="11位手机号" v-model="forgetForm.mobile">
                </el-input>
              </el-form-item>
              <!--<el-row>-->
              <!--<el-input style="width: 186px;" :maxlength="4" placeholder="输入图形验证码" v-model="forgetForm.picSmsCode"></el-input>-->
              <!--<img class="piccode" @click="refreshPic" alt="" :src="src" />-->
              <!--</el-row>-->
              <el-form-item class="left-pull" label="" prop="picSmsCode">
                <el-input style="width: 295px;" :maxlength="4" placeholder="输入图形验证码" v-model="forgetForm.picSmsCode"></el-input>
                <img class="piccode" @click="refreshPic" alt="" :src="src"/>
              </el-form-item>
              <el-row>
                <el-form-item class="left-pull" label="" prop="smsCode">
                  <el-input style="width: 295px;" :maxlength="6" placeholder="输入短信验证码" v-model="forgetForm.smsCode"></el-input>
                  <el-button class="smscode-btn" @click="getMessageSmsCode" :disabled="timeText >= 0">{{timeText >= 0 ? timeText + 's' : '获取验证码'}}</el-button>
                </el-form-item>
              </el-row>
              <el-form-item label="" prop="password">
                <el-input type="password" :maxlength="28" placeholder="6-28位密码数字、字母组合" v-model="forgetForm.password">
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="confirm">
                <el-input type="password" :maxlength="28" placeholder="确认密码" v-model="forgetForm.confirm">
                </el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <div class="btn-bar" style="margin-top: 20px;">
            <el-button class="login-btn" @click="next" type="primary" size="medium">确认</el-button>
          </div>
        </el-tabs>
        <div class="bottom-register">
          <router-link to="/userlogin">登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
import Cookies from 'js-cookie';
import timeText from '@/mixins/timeText';
import reg from '@/utils/validateRegulars';
let { baseFn } = reg;

export default {
  name: 'ForgetPassword',
  mixins: [timeText],
  components: {},
  data() {
    let valiMobile = (rule, value, callback) => {
      if (!/(^1[3|4|5|7|8]\d{9}$)/.test(value)) {
        return callback(new Error('手机号格式不正确'));
      }
      callback();
    };
    let valiPassword = baseFn('password');
    let valiConfirm = (rule, value, callback) => {
      if (this.forgetForm.password !== this.forgetForm.confirm) {
        return callback(new Error('两次密码输入不一致'));
      }
      callback();
    };
    return {
      activeName: 'forget',
      timeText: '获取验证码',
      forgetForm: {
        mobile: '',
        picSmsCode: '',
        smsCode: '',
        password: '',
        confirm: ''
      },
      src: '',
      sessionId: '',
      rules: {
        mobile: [{ validator: valiMobile, trigger: 'blur' }],
        smsCode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        picSmsCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: ['change', 'blur'] },
          { min: 6, message: '长度不能小于6', trigger: ['change', 'blur'] },
          { validator: valiPassword, trigger: ['change', 'blur'] }
        ],
        confirm: [
          { required: true, message: '密码不能为空', trigger: ['change', 'blur'] },
          { min: 6, message: '长度不能小于6', trigger: ['change', 'blur'] },
          { validator: valiConfirm, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.refreshPic();
    let time = Cookies.get('smsCode3');
    if (time) {
      let showTime = 60 - parseInt((new Date().getTime() - new Date(time).getTime()) / 1000);
      this.timeText = showTime;
      this.setText();
    }
  },
  methods: {
    // 获取图片验证码
    refreshPic() {
      netAPI.getPicSmsCode().then(response => {
        if (response.base64Img && response.randValue) {
          this.src = response.base64Img;
          this.randValue = response.randValue;
        } else {
          this.$message({
            type: 'warning',
            message: '服务器返回内容有误！'
          });
        }
      });
    },
    // 下一步
    next() {
      this.$refs['forgetForm'].validate(valid => {
        if (!valid) {
          return false;
        }
        if (!this.forgetForm.mobile) {
          this.$message({
            type: 'warning',
            message: '请填写手机号！'
          });
          return false;
        }
        if (!this.forgetForm.smsCode) {
          this.$message({
            type: 'warning',
            message: '请填写短信验证码！'
          });
          return false;
        }
        let data = {
          inputCode: this.forgetForm.smsCode,
          username: this.forgetForm.mobile,
          password: this.forgetForm.password,
          rePassword: this.forgetForm.confirm
        };
        netAPI.forgetPassword(data).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功,请登录！'
          });
          this.$router.push('/userlogin');
        }).catch(() => {
          this.refreshPic();
        });
      });
    },
    // 获取短信验证码
    getMessageSmsCode() {
      if (!this.forgetForm.mobile) {
        this.$message({
          type: 'warning',
          message: '请填写手机号！'
        });
        return false;
      }
      if (this.forgetForm.picSmsCode === '') {
        this.$message({
          type: 'warning',
          message: '图片验证码不能为空'
        });
        return false;
      }
      let query = {
        username: this.forgetForm.mobile,
        picCode: this.forgetForm.picSmsCode,
        randValue: this.randValue
      };
      netAPI.forgetSmsCode(query).then(() => {
        let time = 60;
        Cookies.set('smsCode3', new Date(), { expires: (1 / (24 * 60)) });
        this.timeText = time;
        this.setText();
      }).finally(() => {
        this.refreshPic();
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
