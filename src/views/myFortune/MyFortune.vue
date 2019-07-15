<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的财富</el-breadcrumb-item>
      <el-breadcrumb-item>{{routeTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'MyFortune',
  computed: {
    routeTitle() {
      return this.$route.meta.title || '';
    }
  }
};
</script>

<style scoped>
</style>
