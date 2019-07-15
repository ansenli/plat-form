import { setStore, removeStore } from '@/utils/localStorage';
// import Cookies from 'js-cookie';
const user = {
  state: {
    loginId: '',
    token: '',
    userName: '',
    nickName: '',
    headIcon: '',
    mobile: '',
    userId: '',
    menu: []
  },
  mutations: {
    SET_USERINFO: (state, data) => {
      setStore('userInfo', data);
      state.userName = data.userName || data.username;
      state.nickName = data.nickName;
      state.userId = data.userId;
    },
    SET_LOGINID: (state, id) => {
      state.loginId = id;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName;
    },
    SET_NICKNAME: (state, nickName) => {
      state.nickName = nickName;
    },
    SET_USERID: (state, userId) => {
      state.userId = userId;
    },
    SET_HEADICON: (state, headIcon) => {
      state.headIcon = headIcon;
      setStore('userInfo_img', headIcon);
    },
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile;
    },
    SET_MENU: (state, menu) => {
      state.menu = menu;
    },
    DEL_USERINFO: state => {
      removeStore('userInfo');
      // Cookies.remove('YTO-STEWARD-AUTOLOGIN');
    }
  },
  actions: {
    // 获取用户信息
    GetUserInfo({ commit }, userInfo) {
      if (typeof userInfo === 'string') {
        userInfo = JSON.parse(userInfo);
      }
      let user = userInfo;
      // commit('SET_TOKEN', user.accessToken);
      // commit('SET_LOGINID', user.id);
      commit('SET_NICKNAME', user.nickName);
      commit('SET_USERNAME', user.username);
      // commit('SET_HEADICON', user.headIcon);
      commit('SET_USERID', user.userId);
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeStore('userInfo');
        window.location.href = '/cockpit/#/userlogin';
        resolve();
      });
    }
  }
};
export default user;
