<template>
  <div></div>
</template>

<script>
import netAPI from '@/api';
import { getStore, removeStore } from '@/utils/localStorage';
import Cookies from 'js-cookie';
import { isNull } from '@/utils/common';
export default {
  name: 'Temp',
  created() {
    const appId = getStore('alipay_app_id');
    const source = getStore('alipay_source');
    const scope = getStore('alipay_scope');
    const state = getStore('alipay_state');
    const code = getStore('alipay_auth_code');
    const type = getStore('alipay_type');
    console.log('appId:', appId, ' source:', source, ' scope:', scope, ' state:', state, ' code:', code, 'type', type);
    if (!isNull(appId) &&
      !isNull(source) &&
      !isNull(scope) &&
      !isNull(state) &&
      !isNull(code) &&
      !isNull(type)) {
      // 支付宝第三方登录特殊处理login 特殊处理
      this.getAlipayUserId({
        source: 'ALIPAY_PC',
        app_id: appId,
        scope: scope,
        state: state,
        auth_code: code
      });
    }
  },
  methods: {
    getAlipayUserId(query) {
      const type = getStore('alipay_type');
      netAPI.getAlipayUserId(query).then(res => {
        console.log('res: ', res);
        removeStore('alipay_app_id');
        const jwtToken = Cookies.get('jwt-token');
        const aliPayUserId = getStore('alipay-user-id');
        console.log('aliPayUserId=' + aliPayUserId);
        if (!isNull(jwtToken)) {
          // 已经绑定过了
          removeStore('alipay-user-id');
          removeStore('wechat-open-id');
          removeStore('source');
          this.setUserInfo(() => {
            // 首页登录
            if (parseInt(type) === 1) {
              this.$router.push('/home');
            } else if (parseInt(type) === 2) {
              // console.log('mini log 222');
              // // 弹框登录
              // let params = {
              //   close: true,
              //   removeData: '1',
              //   message: 'success'
              // };
              // parent.postMessage(params, '*');
            } else if (parseInt(type) === 3) {
              // 基本信息绑定页面
              // 绑定支付宝账号
              netAPI.bingAlipyUser({ openId: aliPayUserId, source: 'ALIPAY_PC' }).then(response => {
                console.log('绑定成功');
                this.$router.push('/accountManage/basicMess');
              }).catch(err => {
                console.log('err=' + err);
                this.$router.push('/accountManage/basicMess');
              });
            }
          });
        } else if (!isNull(aliPayUserId)) {
          if (parseInt(type) === 1) {
            this.$router.push({ path: '/bindmobile', query: { type: 1 } });
          } else if (parseInt(type) === 2) {
            // console.log('mini log 333');
            // // 弹框登录
            // let params = {
            //   close: true,
            //   removeData: '2',
            //   message: 'success'
            // };
            // parent.postMessage(params, '*');
          } else if (parseInt(type) === 3) {
            // 基本信息的绑定
            // this.$router.push({ path: '/bindmobile', query: { type: 3 } });
            this.$router.push('/accountManage/basicMess');
          }
          // this.$router.push('/bindmobile');
        }
      }, err => {
        console.log(err);
      });
    },
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
