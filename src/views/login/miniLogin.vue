<template>
  <div class="login-mini-wrap">
    <div class="login-mini-container">
      <div class="login-box">
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
                <el-input style="width: 370px;" @keyup.enter.native="login" :maxlength="4" placeholder="输入图形验证码" v-model="loginform.picSmsCode"></el-input>
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
                <el-input style="width: 370px;" @keyup.enter.native="login" :maxlength="4" placeholder="输入图形验证码" v-model="picSmsCode"></el-input>
                <img class="piccode" @click="refreshPic" alt="" :src="src"/>
              </el-form-item>
              <el-row>
                <el-form-item class="left-pull" label="" prop="smsCode">
                  <el-input style="width: 370px;" @keyup.enter.native="login" placeholder="验证码" v-model="loginformSms.smsCode">
                    <!--<svg-icon slot="prefix" icon-class="group4"></svg-icon>-->
                  </el-input>
                  <el-button class="smscode-btn piccode" @click="getCode" :disabled="timeText >= 0">{{timeText >= 0 ? timeText + 's' : '获取验证码'}}</el-button>
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
            <el-checkbox v-model="autoLogin" v-if="false">记住我</el-checkbox>
            <router-link v-if="activeName === 'userName'" class="link-right" to="forget_password">忘记密码？</router-link>
          </div>
          <div class="btn-bar clearfix">
            <el-button class="login-btn" @click="login" type="primary" size="medium">登录</el-button>
          </div>
        </el-tabs>
        <div class="bottom-register">
          <router-link class="register-btn" to="register">注册</router-link>
        </div>
        <div class="bottom-line" v-if="false">
          第三方登录
        </div>
        <div class="bottom-other" v-if="false">
          <!-- <router-link to=""><img src="@/assets/images/wechat@2x.png" /></router-link>
          <router-link to=""><img src="@/assets/images/QQ@2x.png" /></router-link> -->
          <a href="#"><img src="@/assets/images/zhi@2x.png" @click="openAlipay" /></a>
        </div>
      </div>
      <div id="yytt" style="position: fixed;"></div>
    </div>
     <el-dialog id="completeDialog" title="支付宝登录" :visible.sync="alipayDialogShow" width="650px" center >
        <div  id="completeDiv" >
          <iframe  :src="alipayIframeUrl" width="620px"  height='650px'></iframe>
        </div>
     </el-dialog>
     <el-dialog  title="账号绑定" :visible.sync="alipayBindShow" width="850px" center >
        <div  id="completeDiv" >
          <iframe  src="/bindmobile?type=2" width="820px"  height='650px'></iframe>
        </div>
     </el-dialog>
  </div>
</template>

<script>
import netAPI from '@/api';
import Cookies from 'js-cookie';
import timeText from '@/mixins/timeText';
import reg from '@/utils/validateRegulars';
import { trackEvent } from '@/utils/common';
let { baseFn } = reg;
export default {
  name: 'miniLogin',
  mixins: [timeText],
  components: {},
  watch: {
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
      loginform: {
        userName: '',
        password: '',
        picSmsCode: ''
      },
      loginformSms: {
        username: '',
        smsCode: ''
      },
      alipayIframeUrl: '',
      alipayDialogShow: false,
      alipayBindShow: false,
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
  mounted() {
    // 增加一个postMessage来监听消息
    // window.addEventListener('message', this.postMessageListener);
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
              this.setUserInfo(() => {
                this.$emit('login-back');
              });
            }).catch(() => {
              this.refreshPic();
            });
          };
        });
      } else {
        trackEvent(['_trackEvent', '登录', '手机号登录', '手机号登录']);
        this.$refs['loginformSms'].validate(valid => {
          if (valid) {
            netAPI.loginBySmsCode({
              username: this.loginformSms.username,
              smsCode: this.loginformSms.smsCode
            }).then(res => {
              this.setUserInfo(() => {
                this.$emit('login-back');
              });
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
    },
    openAlipay() {
      console.log('come in...');
      netAPI.openAlipayUrl({ type: 2 }).then(res => {
        this.alipayIframeUrl = res;
        this.alipayDialogShow = true;
        document.getElementById('completeDiv').innerHTML = "<iframe  src='" + this.alipayIframeUrl + "' height='650px'  width='620px'></iframe>";
      });
    }
    // postMessageListener(e) {
    //   console.log('postMessageListener start');
    //   let data = e.data;
    //   console.log('data=' + data);
    //   if (data.close) {
    //     this.alipayDialogShow = false;
    //   }
    //   if (data.removeData === '1') {
    //     this.setUserInfo(() => {
    //       this.$emit('login-back');
    //     });
    //   } else if (data.removeData === '2') {
    //     this.alipayBindShow = true;
    //   } else if (data.removeData === '3') {
    //     // 绑定号码之后的回调
    //     this.alipayDialogShow = false;
    //     this.alipayBindShow = false;
    //     this.setUserInfo(() => {
    //       this.$emit('login-back');
    //     });
    //   }
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.login-mini-container /deep/ {
  padding: 0 60px;

  .el-tabs__item {
    font-size: 16px;
  }
  .el-input--small .el-input__inner {
    height: 48px;
    line-height: 48px;
    border-radius: 3px;
    background: transparent;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 24px;
  }
  .el-dialog__header {
    border-bottom: 0;
  }
  .login-btn {
    border: none;
    // color: $white;
    background-color: #47086c;
    width: 100%;
    height: 48px;
    font-size: 16px;
    margin-top: 30px;
  }
  .bottom-register {
    margin-top: 30px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    a {
      text-decoration: none;
    }
  }
  .bottom-line {
    margin-top: 30px;
    text-align: center;
    font-size: 16px;
    color: #999;
    position: relative;
    &::before {
      content: '';
      width: 90px;
      height: 1px;
      background-color: #ddd;
      display: block;
      position: absolute;
      bottom: 8px;
    }
    &::after {
      content: '';
      width: 90px;
      height: 1px;
      background-color: #ddd;
      display: block;
      position: absolute;
      bottom: 8px;
      right: 0;
    }
  }
  .bottom-other {
    margin-top: 30px;
    text-align: center;
    a {
      text-decoration: underline;
      padding: 0 30px;
      display: inline-block;
      &:first-of-type {
        margin-right: 80px;
      }
      img {
        width: 48px;
        height: 48px;
      }
    }
  }
  .piccode {
    width: 110px;
    height: 48px;
    position: absolute;
    top: 0px;
    right: 2px;
  }
  .smscode-btn {
    border: 1px solid #dcdfe6;
  }
  .link-right {
    float: right;
    text-decoration: none;
  }
}
</style>
