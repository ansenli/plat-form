<template>
  <div class="message-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部消息" name="all" :lazy="true">
        <collapse-list active-name="all" key="all"></collapse-list>
      </el-tab-pane>
      <el-tab-pane label="包裹消息" name="package" :lazy="true">
        <collapse-list active-name="package" key="package"></collapse-list>
      </el-tab-pane>
      <el-tab-pane label="活动消息" name="activity" :lazy="true">
        <collapse-list active-name="activity" key="activity"></collapse-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import collapseList from './collapseList';
export default {
  name: 'MyMessages',
  components: {collapseList},
  computed: {
  },
  data() {
    return {
      activeName: 'all'
    };
  },
  created() {
  },
  methods: {
    handleClick() {}
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.message-container /deep/ {
  height: 100%;
  .el-tabs__item {
    height:60px;
    line-height:60px;
  }
  .el-tabs__item.is-active {
    font-weight: bold;
  }
  .el-tabs__header{
    margin-bottom: 0;
  }
}
.el-tabs /deep/ {
  height: 100%;
  .el-tabs__content {
    height: calc(100% - 200px);
    overflow:auto;
  }
}
</style>
