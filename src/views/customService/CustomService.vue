<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>客服服务</el-breadcrumb-item>
      <el-breadcrumb-item v-show="nowPath">{{nowPath}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="myorder-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: 'CustomService',
  computed: {
    nowPath() {
      return this.$route.meta.title;
    }
  },
  watch: {
  },
  data() {
    return {
      select: '1',
      originType: 'all',
      menuList: [
        {name: '全部订单', value: 'all', count: 20},
        {name: '未接单', value: 'unanswered', count: 3},
        {name: '运送中', value: 'transport', count: 6},
        {name: '已签收', value: 'haveSignedIn', count: 9},
        {name: '其他', value: 'others', count: 2}
      ],
      pageNo: 1,
      limit: 10,
      total: 0
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.myorder-container {
  margin: 20px 0;
  background-color: #ffffff;
}
</style>
