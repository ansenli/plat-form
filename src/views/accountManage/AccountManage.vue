<template>
  <div class="account-manage-container">
    <el-container style="height: auto;">
      <el-aside width="200px" style="min-height: calc(100vh - 40pt - 40px);">
        <aside-type-list
          @click-item="toPath"
          :originType="originType"
          :menu-list="menuList"
          pageType="2"
        ></aside-type-list>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import asideTypeList from '@/views/myOrder/components/asideTypeList';
export default {
  name: 'AccountManage',
  components: { asideTypeList },
  computed: {
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.originType = val.name;
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    this.originType = this.$route.name;
  },
  data() {
    return {
      originType: '',
      menuList: [
        { name: '常见问题', value: 'BasicMess' },
        { name: '错误编码', value: 'MyMessages' }
      ]
    };
  },
  methods: {
    toPath(item) {
      this.originType = item.value;
      this.$router.push({ name: item.value });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.account-manage-container {
  margin: 20px 0;
  background-color: #ffffff;
}
</style>
