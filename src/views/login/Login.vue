<template>
  <div class="login-wrap">
    <div class="login-container">
      <div class="login-box">
        <img class="login-logo" src="@/assets/images/logo@2x.png" />
        <el-tabs v-model="activeName" @tab-click="refreshPic">
          <el-tab-pane label="账号登录" name="userName">
            <el-form :model="loginform" status-icon :rules="rules" ref="loginform" class="form" key="form1">
              <el-form-item label="" prop="userName">
                <el-input @keyup.enter.native="login" placeholder="用户名/手机号" v-model="loginform.userName">
                  <!--<svg-icon slot="prefix" icon-class="group"></svg-icon>-->
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input type="password" @keyup.enter.native="login" placeholder="密码" v-model="loginform.password">
                  <!--<svg-icon slot="prefix" icon-class="password"></svg-icon>-->
                </el-input>
              </el-form-item>
              <el-form-item class="left-pull" label="" prop="picSmsCode">
                <el-input style="width: 295px;" @keyup.enter.native="login" :maxlength="4" placeholder="输入图形验证码" v-model="loginform.picSmsCode"></el-input>
                <img class="piccode" @click="refreshPic" alt="" :src="src"/>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="手机号登录" name="userMobile">
            <el-form :model="loginformSms" status-icon :rules="rules2" ref="loginformSms" class="form" key="form2">
              <el-form-item label="" prop="username">
                <el-input @keyup.enter.native="login" placeholder="手机号" v-model="loginformSms.username">
                  <!--<svg-icon slot="prefix" icon-class="group2"></svg-icon>-->
                </el-input>
              </el-form-item>
              <el-form-item class="left-pull" label="">
                <el-input style="width: 295px;" @keyup.enter.native="login" :maxlength="4" placeholder="输入图形验证码" v-model="picSmsCode"></el-input>
                <img class="piccode" @click="refreshPic" alt="" :src="src"/>
              </el-form-item>
              <el-row>
                <el-form-item class="left-pull" label="" prop="smsCode">
                  <el-input style="width: 295px;" @keyup.enter.native="login" placeholder="验证码" v-model="loginformSms.smsCode">
                    <!--<svg-icon slot="prefix" icon-class="group4"></svg-icon>-->
                  </el-input>
                  <el-button class="smscode-btn" @click="getCode" :disabled="timeText >= 0">{{timeText >= 0 ? timeText + 's' : '获取验证码'}}</el-button>
                </el-form-item>
              </el-row>
              <!--<div style="margin-bottom: 10px;">-->
              <!--<remote-js js-url="http://g.alicdn.com/sd/ncpc/nc.js?t=2015052012" @load-js-finish="loadRongJs"></remote-js>-->
              <!--<div :id="modelName" :class="[modelName]">-->
              <!--<div class="nc-container" ></div>-->
              <!--</div>-->
              <!--</div>-->
            </el-form>
          </el-tab-pane>
          <!--<el-checkbox v-model="autoLogin">记住我</el-checkbox>-->
          <div class="clearfix">
            <router-link v-if="activeName === 'userName'" class="link-right" to="forget_password">忘记密码？</router-link>
          </div>
          <div class="btn-bar clearfix">
            <el-button class="login-btn" @click="login" type="primary" size="medium">登录</el-button>
          </div>
        </el-tabs>
        <div class="bottom-register">
          <router-link class="register-btn" to="register">注册</router-link>
        </div>
        <div class="bottom-line">
          第三方登录
        </div>
        <div class="bottom-other">
          <router-link to="" v-if="false"><img src="@/assets/images/wechat@2x.png" /></router-link>
          <a href="#"><img src="@/assets/images/zhi@2x.png" @click="openAlipay" /></a>
          <router-link to="" v-if="false"><img src="@/assets/images/QQ@2x.png" /></router-link>
          <!-- <iframe :src="alipayIframe" v-if="alipayIframeShow" width="200" height="200"></iframe> -->
          <!--<el-dialog id="completeDialog" title="支付宝登录" :visible.sync="alipayDialogShow" width="50%" top = "3%"  >
            <div  id="completeDiv" >
              <iframe  :src="alipayIframeUrl" height="1000" width="100%"></iframe>
            </div>
          </el-dialog>-->
        </div>
      </div>
      <div id="yytt" style="position: fixed;"></div>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
import Cookies from 'js-cookie';
import timeText from '@/mixins/timeText';
import reg from '@/utils/validateRegulars';
import { trackEvent } from '@/utils/common';
let { baseFn } = reg;

let hasFrom = false;
// const whiteList = ['/login', '/register', '/forget_password', '/home'];
export default {
  name: 'Login',
  mixins: [timeText],
  components: {},
  watch: {
    // timeText(newVal) {
    //   if (newVal === 0) {
    //     this.isBlockSlided = false;
    //     this.nc.reset();
    //   }
    // }
  },
  data() {
    let valiMobile = baseFn('cn_mobile');
    return {
      src: '',
      randValue: '',
      timeText: '获取验证码',
      activeName: 'userName',
      userName: '',
      password: '',
      mobile: '',
      smsCode: '',
      autoLogin: false,
      picSmsCode: '',
      alipayIframeUrl: '',
      alipayDialogShow: false,
      loginform: {
        userName: '',
        password: '',
        picSmsCode: ''
      },
      loginformSms: {
        username: '',
        smsCode: ''
      },
      rules: {
        userName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '不能为空', trigger: 'blur' }],
        picSmsCode: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      rules2: {
        username: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: valiMobile, trigger: 'blur' }
        ],
        smsCode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  // 路由检验
  // beforeRouteEnter(to, from, next) {
  //   console.log('login页面from:', from);
  //   if (from.path.indexOf(whiteList) === -1) {
  //     hasFrom = true;
  //   }
  //   next();
  // },
  created() {
    this.refreshPic();
    // this.ncInit();
    let time = Cookies.get('smsCode2');
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
    login() {
      if (this.activeName === 'userName') {
        trackEvent(['_trackEvent', '登录', '账号登录', '账号登录']);
        this.$refs['loginform'].validate(valid => {
          if (valid) {
            netAPI.loginByUserName({
              randValue: this.randValue,
              code: this.loginform.picSmsCode,
              username: this.loginform.userName,
              password: this.loginform.password
            }).then(res => {
              this.$message({
                type: 'success',
                message: '登录成功！',
                duration: 1000
              });
              this.setUserInfo(() => {
                if (hasFrom) {
                  this.$router.back();
                } else {
                  this.$router.push('/home');
                }
              });
            }).catch(() => {
              this.refreshPic();
            });
          }
        });
      } else {
        trackEvent(['_trackEvent', '登录', '手机号登录', '手机号登录']);
        this.$refs['loginformSms'].validate(valid => {
          if (valid) {
            netAPI.loginBySmsCode({
              username: this.loginformSms.username,
              smsCode: this.loginformSms.smsCode
            }).then(res => {
              this.$message({
                type: 'success',
                message: '登录成功！',
                duration: 1000
              });
              this.setUserInfo(() => {
                if (hasFrom) {
                  this.$router.back();
                } else {
                  this.$router.push('/home');
                }
              });
              Cookies.remove('smsCode2');
            }).catch(() => {
              this.refreshPic();
            });
          }
        });
      }
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
    getCode() {
      if (this.loginformSms.username === '') {
        this.$message({
          type: 'warning',
          message: '手机号不能为空'
        });
        return false;
      }
      if (this.picSmsCode === '') {
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
      // netAPI.checkPicSmsCode({
      //   randValue: this.randValue,
      //   code: this.picSmsCode
      // }).then(res => {
      //   if (res) {
      let query = {
        randValue: this.randValue,
        code: this.picSmsCode,
        username: this.loginformSms.username
      };
      netAPI.sendLoginSmsCode(query).then(() => {
        let time = 60;
        Cookies.set('smsCode2', new Date(), { expires: (1 / (24 * 60)) });
        this.timeText = time;
        this.setText();
      }).catch(() => {
        this.refreshPic();
      });
      // }
      // }).catch(() => {
      // });
    },
    openAlipay() {
      console.log('come in...');
      trackEvent(['_trackEvent', '登录', '支付宝登录', '支付宝登录']);
      netAPI.openAlipayUrl({ type: 1 }).then(res => {
        console.log(res);
        window.open(res);
        /* this.alipayDialogShow = true;
        this.alipayIframeUrl = res; */
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
