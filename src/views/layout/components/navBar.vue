<template>
  <el-row type="flex">
    <el-col :span="4">
      <div @click="linkHome" class="logo-style">
        <img class="login-logo" src="@/assets/images/logo@2x.png" />
      </div>
    </el-col>
    <el-col :span="16">
      <sideBar></sideBar>
    </el-col>
    <el-col :span="4">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <template v-if="name">
            <span class="user-name">{{'hi,' + name}}</span>
            <!-- <img class="user-avatar" src="@/assets/images/notice@2x.png"> -->
            <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom">
              <div class="logout" @click="logout">
                <svg-icon icon-class="logout" class="icon"></svg-icon>
              </div>
            </el-tooltip>
          </template>
          <template v-else>
            <router-link to="/userlogin">登录</router-link>
            <router-link to="/register">注册</router-link>
          </template>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
// import netAPI from '@/api';
import Cookies from 'js-cookie';
import sideBar from './sidebar';
import { removeStore } from '@/utils/localStorage';
export default {
  components: {
    sideBar
  },
  name: 'navBar',
  data() {
    return {
    };
  },
  computed: {
    name() {
      return this.$store.state.user.nickName || this.$store.state.user.userName;
    }
  },
  created() {
  },
  methods: {
    linkHome() {
      this.$router.push({
        name: 'Home'
      });
    },
    logout() {
      removeStore('alipay_app_id');
      removeStore('alipay_source');
      removeStore('alipay_scope');
      removeStore('alipay_state');
      removeStore('alipay_auth_code');
      removeStore('alipay-user-id');
      removeStore('wechat-open-id');
      removeStore('source');

      Cookies.remove('jwt-token');
      Cookies.remove('jwt-token-expires');
      this.$router.push('/userlogin');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.logo-style {
  cursor: pointer;
  display: flex;
}
.login-logo {
  width: 126px;
  height: 50px;
  margin-top: 15px;
}
.login-title {
  line-height: 80px;
  font-size: 16px;
  color: #47086c;
  padding-left: 8px;
}
.avatar-container {
  height: 80px;
  text-align: right;
  .avatar-wrapper {
    position: relative;
    display: inline-block;
    margin-top: 30px;
    .logout {
      display: inline-block;
      cursor: pointer;
    }
    .user-name {
      color: rgba(0, 0, 0, 1);
      display: inline-block;
      vertical-align: middle;
      padding-left: 5px;
      font-size: 16px;
    }
    .user-avatar {
      width: 7pt;
      height: 8pt;
      border-radius: 10px;
      vertical-align: middle;
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: -20px;
      top: 18px;
      font-size: 12px;
      color: #bbcedc;
    }
  }
}
</style>
