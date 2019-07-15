<template>
  <el-container>
    <el-container>
      <el-header class="yto-header" style="height: 80px; border-bottom: 1px solid #E5E9F2;">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
            <navBar></navBar>
          </el-col>
        </el-row>
      </el-header>
      <el-scrollbar style="height: calc(100vh - 80px);background:#fff;" wrapClass="yto-x-auto">
        <el-main>
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
              <router-view v-if="isRouterAlive" :key="key"></router-view>
            </el-col>
          </el-row>
        </el-main>
      </el-scrollbar>
      <el-row type="flex" class="row-bg" justify="center" align="middle">
        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
          <el-footer class="yto-footer">
            <div class="left">
              © 2018. All RIGHT RESERVED. 圆通速递有限公司 版权所有
              <span style="color:#47086C">沪ICP备05004632号</span>
            </div>
            <div class="right">
              <a class="icon" href="http://www.yto.net.cn/" target="_blank">圆通官网</a>客服服务热线：95554，021-69777888
            </div>
          </el-footer>
        </el-col>
      </el-row>
    </el-container>
  </el-container>
</template>

<script>
import navBar from './components/navBar';
import tagsView from './components/tagsView';

export default {
  components: {
    navBar,
    tagsView
  },
  name: 'Index',
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true,
      key: Math.random()
    };
  },
  mounted() {

  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.key = Math.random();
        this.isRouterAlive = true;
      });
    }
    // isCollapse() {
    //   this.$store.commit('TOGGLE_SIDEBAR');
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.yto-header {
  background-color: #fff;
  border-bottom: 1pt solid #e5e9f2;
}
.yto-footer {
  color: #666;
  height: 60px;
  line-height: 60px;
  .left {
    float: left;
  }
  .right {
    float: right;
    .icon {
      color: #e69b24;
      font-family: MicrosoftYaHei;
      margin-right: 20px;
      text-decoration: none;
    }
  }
}
</style>
