<template class="e_box">
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    background-color="transparent"
    active-text-color="#47086C"
    mode="horizontal"
    router
  >
    <template v-for="(item,index) in routes">
      <el-submenu
        v-if="!item.hidden && item.childrenShow"
        :index="'/' + item.path"
        :key="index"
        :style="{width:menuLength,textAlign:'center'}"
      >
        <template slot="title">{{item.meta.title}}</template>
        <template v-for="(itemC,indexC) in item.children">
          <el-menu-item
            @click="tracking(item,itemC)"
            v-if="!itemC.hidden && item.childrenShow && !itemC.childrenShow"
            :index="'/' + item.path + '/' + itemC.path"
            :key="indexC"
          >{{itemC.meta.title}}</el-menu-item>
          <!-- 新增多级导航菜单 -->
          <el-submenu
            id="mutilId"
            @click="tracking(item,itemC)"
            v-if="!itemC.hidden && item.childrenShow && itemC.childrenShow"
            :index="'/' + item.path + '/' + itemC.path"
            :key="indexC"
          >
            <template slot="title">{{itemC.meta.title}}</template>
            <template v-for="(subItemC,subIndexC) in itemC.children">
              <el-menu-item
                :key="subIndexC"
                :index="'/' + item.path + '/' + itemC.path + '/' + subItemC.path"
              >{{subItemC.meta.title}}</el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-submenu>
      <el-menu-item
        v-if="!item.hidden && !item.childrenShow"
        :index="'/' + item.path"
        :key="index"
        @click="trackingHome()"
      >
        <span slot="title" class="title">{{item.meta.title}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { trackEvent } from '@/utils/common';
export default {
  components: {},
  name: 'sidebar',
  data() {
    return {};
  },
  computed: {
    menuLength() {
      let number = this.routes.filter((x) => {
        return !x.hidden;
      }) || [];
      let ss = 0.75 / number.length * 100;
      return ss + '%';
    },
    routes() {
      let routes = this.$router.options.routes;
      console.log('routes......', routes);
      // 这里登录后更加用户权限判断是否需要展示对应的模块
      for (let i = 0; i < routes.length; i++) {
        if (!routes[i].hidden) {
          return routes[i].children || [];
        }
      }
      return [];
    },
    isCollapse() {
      return this.$store.state.sidebar.isOpen;
    }
  },
  created() {
    // console.log(this.$route.path);
    // console.log(this.$router.options.routes);
  },
  methods: {
    tracking(itemP, item) {
      // console.log('itemP=' + JSON.stringify(itemP));
      // console.log('item=' + JSON.stringify(item));
      trackEvent(['_trackEvent', '菜单栏点击', itemP.meta.title, item.meta.title]);
    },
    trackingHome() {
      trackEvent(['_trackEvent', '菜单栏点击', '点击首页', '点击首页']);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.title {
  padding: 0 10px;
  font-size: 16px;
}

#mutilId {
  padding: 7.5px 0px !important;
  margin: 0 20px;
  color: #909399 !important;
  &:hover {
    color: #303133 !important;
    background: #e5e9f2 !important;
    outline: none !important;
  }
}
/deep/ {
  .el-submenu__title:hover {
    color: #303133 !important;
    background: #e5e9f2 !important;
    outline: none !important;
  }
}
</style>
