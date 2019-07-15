<template>
  <div class="login-box">
    <img class="login-logo" src="@/assets/images/logo@2x.png"/>
    <el-tabs v-model="activeName" class="only-one-tab">
      <el-tab-pane label="注册" name="register">
        <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" class="form">
          <el-form-item label="" prop="mobile">
            <el-input :maxlength="11" placeholder="11位手机号" v-model="registerForm.mobile">
            </el-input>
          </el-form-item>
          <!--<el-row>-->
            <!--<el-input style="width: 186px;" :maxlength="4" placeholder="输入图形验证码" v-model="registerForm.picSmsCode"></el-input>-->
            <!--<img class="piccode" @click="refreshPic" alt="" :src="src" />-->
          <!--</el-row>-->
          <el-form-item class="left-pull" label="" prop="picSmsCode">
            <el-input style="width: 295px;" :maxlength="4" placeholder="输入图形验证码" v-model="registerForm.picSmsCode"></el-input>
            <img class="piccode" @click="refreshPic" alt="" :src="src"/>
          </el-form-item>
          <el-row>
            <el-form-item class="left-pull" label="" prop="smsCode">
              <el-input style="width: 295px;" :maxlength="6" placeholder="输入短信验证码" v-model="registerForm.smsCode"></el-input>
              <el-button class="smscode-btn" @click="getMessageSmsCode" :disabled="timeText >= 0">{{timeText >= 0 ? timeText + 's' : '获取验证码'}}</el-button>
            </el-form-item>
          </el-row>
          <!--<div style="margin-bottom: 10px;">-->
            <!--<remote-js js-url="http://g.alicdn.com/sd/ncpc/nc.js?t=2015052012" @load-js-finish="loadRongJs"></remote-js>-->
            <!--<div :id="modelName" :class="[modelName]">-->
              <!--<div class="nc-container" ></div>-->
            <!--</div>-->
          <!--</div>-->
          <el-form-item label="" prop="password">
            <el-input type="password" :maxlength="25" placeholder="8-25位密码数字、字母组合" v-model="registerForm.password">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="confirm">
            <el-input type="password" :maxlength="25" placeholder="确认密码" v-model="registerForm.confirm">
            </el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <div class="btn-bar" style="margin-top: 20px;">
        <el-button class="login-btn" @click="next" type="primary" size="medium">注册</el-button>
      </div>
    </el-tabs>
    <div class="bottom-register">
      <!-- 已有账号， -->
      <router-link to="/userlogin">登录</router-link>
    </div>
    <div style="text-align: center; margin-top: 30px;">
      <el-checkbox class="circle-checkbox" v-model="checked">我同意</el-checkbox><a class="protocol-link" @click="isShow = true">《会员注册服务协议》</a>
    </div>
    <protocol-info :visible.sync="isShow"><protocol-register></protocol-register></protocol-info>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import timeText from '@/mixins/timeText';
// import nc from '@/mixins/nc';
// import remoteJs from '@/components/remoteJs';
import netAPI from '@/api';
import reg from '@/utils/validateRegulars';
import ProtocolInfo from './ProtocolInfo';
import protocolRegister from './protocol-register';
import { trackEvent } from '@/utils/common';
let { baseFn } = reg;
export default {
  name: 'Register',
  mixins: [timeText],
  components: { ProtocolInfo, protocolRegister },
  watch: {
    // timeText(newVal) {
    //   if (newVal === '0') {
    //     this.isBlockSlided = false;
    //     this.nc.reset();
    //   }
    // }
  },
  data() {
    let valiMobile = baseFn('cn_mobile');
    let valiPassword = baseFn('password');
    let valiConfirm = (rule, value, callback) => {
      if (this.registerForm.password !== this.registerForm.confirm) {
        return callback(new Error('两次密码输入不一致'));
      }
      callback();
    };
    return {
      checked: false,
      isShow: false,
      timeText: '获取验证码',
      activeName: 'register',
      registerForm: {
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
          // { required: true, message: '不能为空', trigger: 'blur' }
        ],
        picSmsCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: ['change', 'blur'] },
          { min: 8, message: '长度不能小于8', trigger: ['change', 'blur'] },
          { validator: valiPassword, trigger: ['change', 'blur'] }
        ],
        confirm: [
          { required: true, message: '密码不能为空', trigger: ['change', 'blur'] },
          { min: 8, message: '长度不能小于8', trigger: ['change', 'blur'] },
          { validator: valiConfirm, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.refreshPic();
    // this.ncInit();
    let time = Cookies.get('smsCode1');
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
      trackEvent(['_trackEvent', '注册', '注册', '注册']);
      this.$refs['registerForm'].validate(valid => {
        if (!valid) {
          return false;
        }
        if (!this.registerForm.mobile) {
          this.$message({
            type: 'warning',
            message: '请填写手机号！'
          });
          return false;
        }
        if (!this.registerForm.smsCode) {
          this.$message({
            type: 'warning',
            message: '请填写短信验证码！'
          });
          return false;
        }
        if (!this.checked) {
          this.$message({
            type: 'warning',
            message: '请阅读并同意《会员注册服务协议》！'
          });
          return false;
        }
        let data = {
          inputCode: this.registerForm.smsCode,
          mobile: this.registerForm.mobile,
          password: this.registerForm.password,
          repassword: this.registerForm.confirm
        };
        let inviteId = this.$route.query.inviteId;
        netAPI.registerUser(data, inviteId).then(res => {
          if (res === '1' || res === 1) {
            // 注册成功调用登录接口
            netAPI.loginBySmsCode({
              username: this.registerForm.mobile,
              smsCode: this.registerForm.smsCode
            }).then(resLog => {
              this.$message({
                type: 'success',
                message: '登录成功！',
                duration: 1000
              });
              this.setUserInfo(() => {
                this.$router.push('/home');
              });
            });
          } else {
            this.$message({
              type: 'warning',
              message: '注册失败！'
            });
          }
        }).catch(() => {
          this.refreshPic();
        });
      });
    },
    // 保存用户信息
    setUserInfo(callback) {
      netAPI.getUserInfo().then(res => {
        let info = {};
        res['username'] && (info['username'] = res['username']);
        res['nickName'] && (info['nickName'] = res['nickName']);
        res['headIcon'] && (info['headIcon'] = res['headIcon']);
        res['userId'] && (info['userId'] = res['userId']);
        this.$store.commit('SET_USERINFO', info);
        if (callback) {
          callback();
        }
      });
    },
    // 获取短信验证码
    getMessageSmsCode() {
      if (!this.registerForm.mobile) {
        this.$message({
          type: 'warning',
          message: '请填写手机号！'
        });
        return false;
      }
      if (this.registerForm.picSmsCode === '') {
        this.$message({
          type: 'warning',
          message: '图片验证码不能为空'
        });
        return false;
      }
      // if (!this.isBlockSlided) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请先拖动滑块至右侧！'
      //   });
      //   return false;
      // }
      let query = {
        randValue: this.randValue,
        vcode: this.registerForm.picSmsCode,
        username: this.registerForm.mobile
      };
      netAPI.getNoLoginMessageSmsCode(query).then(() => {
        let time = 60;
        Cookies.set('smsCode1', new Date(), { expires: (1 / (24 * 60)) });
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
.protocol-link {
  font-size: 14px;
  color: #ac41eb;
  cursor: pointer;
}
</style>
