<template>
  <div class="account-manage-container">
    <el-container style="height: auto;">
      <el-aside
        width="200px"
        style="min-height: calc(100vh - 40pt - 88px);background:rgba(248,247,250,1);padding:0px 10px;"
      >
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
import asideTypeList from '@/components/AsideTypeListMultip';
export default {
  name: 'InterfaceDocument',
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
        { name: '平台介绍', value: 'PlatformIntroduction', code: '' },
        { name: '订单服务', value: 'OrderService', code: 'InterfaceManage' },
        { name: '查询服务', value: 'QueryService', code: 'MyElectronicList' },
        { name: '物流信息服务', value: 'LogisticsInformationService', code: 'OnlineApiTesting' },
        { name: '电子面单服务', value: 'ElectronicSingleFaceService', code: 'ApiTestProgress' },
        { name: '仓配服务', value: 'WarehouseService', code: 'ApiTestProgress' }
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
  background-color: #ffffff;
}
</style>
