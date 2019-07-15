<template>
  <div class="login-wrap">
    <div class="login-container">
      <div class="login-box">
        <img class="login-logo" src="@/assets/images/logo@2x.png" />
            <label style="font: bold; color: azure; margin-left: 41%;">绑定手机号</label>
            <el-form :model="bindMobilleform" status-icon :rules="rules2" style="margin-top: 6%" ref="loginformSms" class="form" key="form2">
              <el-form-item label="" prop="username">
                <el-input placeholder="手机号" v-model="bindMobilleform.username">
                  <!--<svg-icon slot="prefix" icon-class="group2"></svg-icon>-->
                </el-input>
              </el-form-item>
              <el-form-item class="left-pull" label="">
                <el-input style="width: 295px;" :maxlength="4" placeholder="输入图形验证码" v-model="picSmsCode"></el-input>
                <img class="piccode" @click="refreshPic" alt="" :src="src"/>
              </el-form-item>
              <el-row>
                <el-form-item class="left-pull" label="" prop="smsCode">
                  <el-input style="width: 295px;" placeholder="验证码" v-model="bindMobilleform.smsCode">
                    <!--<svg-icon slot="prefix" icon-class="group4"></svg-icon>-->
                  </el-input>
                  <el-button class="smscode-btn" @click="getSmsCode" :disabled="timeText >= 0">{{timeText >= 0 ? timeText + 's' : '获取验证码'}}</el-button>
                </el-form-item>
              </el-row>
            </el-form>
          <div class="btn-bar clearfix">
            <el-button class="login-btn" @click="bindMobile" type="primary" size="medium">完成</el-button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
import timeText from '@/mixins/timeText';
import Cookies from 'js-cookie';
import { getStore, removeStore } from '@/utils/localStorage';
import { GetUrlParam } from '@/utils/common';
export default {
  name: 'BindMobile',
  mixins: [timeText],
  components: {},
  watch: {
  },
  data() {
    return {
      src: '',
      randValue: '',
      timeText: '获取验证码',
      userName: '',
      smsCode: '',
      picSmsCode: '',
      bindMobilleform: {
        userName: '',
        picSmsCode: ''
      },
      rules2: {
        username: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        picSmsCode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        smsCode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    /* const appId = getStore('alipay_app_id');
    const source = getStore('alipay_source');
    const scope = getStore('alipay_scope');
    const state = getStore('alipay_state');
    const code = getStore('alipay_auth_code');
    console.log('appId:', appId, ' source:', source, ' scope:', scope, ' state:', state, ' code:', code);
    if (appId !== undefined && appId !== '' && appId !== null && source !== undefined && source !== '' && source !== null && scope !== undefined && scope !== '' && scope !== null && state !== undefined && state !== '' && state !== null && code !== undefined && code !== '' && code !== null) {
      // 支付宝第三方登录特殊处理login 特殊处理
      this.getAlipayUserId({
        source: source,
        app_id: appId,
        scope: scope,
        state: state,
        auth_code: code
      });
    } */

    this.refreshPic();
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
    bindMobile() {
      const type = GetUrlParam('type');
      const openId = getStore('alipay-user-id') || getStore('wechat-open-id');
      const source = getStore('source');
      if (openId === undefined || openId === '' || openId === null || source === undefined || source === '' || source === null) {
        this.$message({
          type: 'warning',
          message: '参数不全，请确认后再次提交'
        });
      }
      netAPI.bindOpenId({
        code: this.bindMobilleform.smsCode,
        mobile: this.bindMobilleform.username,
        openId: openId,
        orSource: source
      }).then(res => {
        this.$message({
          type: 'success',
          message: '绑定成功！'
        });
        //  删除缓存openId和source
        removeStore('alipay-user-id');
        removeStore('wechat-open-id');
        removeStore('source');
        this.setUserInfo(() => {
          // 首页登录
          if (type && parseInt(type) === 1) {
            this.$router.push('/home');
          } else if (type && parseInt(type) === 2) {
            // // 弹框登录
            // let params = {
            //   close: true,
            //   removeData: '3',
            //   message: 'success'
            // };
            // parent.postMessage(params, '*');
          }
        });
      }).catch((res) => {
        console.log(res);
        this.$message({
          type: 'warning',
          message: '绑定失败！'
        });
        this.refreshPic();
      });
    },
    getSmsCode() {
      if (this.bindMobilleform.username === '') {
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
      if (!/(^1[2|3|4|5|7|6|9|8]\d{9}$)/.test(this.bindMobilleform.username)) {
        this.$message({
          type: 'warning',
          message: '手机号格式不正确'
        });
        return false;
      }
      let query = {
        randValue: this.randValue,
        picCode: this.picSmsCode,
        mobile: this.bindMobilleform.username
      };
      netAPI.sendBindMsg(query).then(() => {
        let time = 60;
        Cookies.set('smsCode2', new Date(), { expires: (1 / (24 * 60)) });
        this.timeText = time;
        this.setText();
      }).catch(() => {
        this.refreshPic();
      });
    },
    /* getAlipayUserId(query) {
      netAPI.getAlipayUserId(query).then(res => {
        console.log('res: ', res);
        /!* const alipayUserId = getStore('alipay-user-id');
        if (alipayUserId !== undefined && alipayUserId !== '' && alipayUserId !== null) {
          // 跳转到绑定页面
          this.$router.push({
            name: 'BindMobile'
          });
        } *!/
      }, err => {
        console.log(err);
      });
    }, */
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
    }
  }
};
</script>

<style scoped>
</style>
