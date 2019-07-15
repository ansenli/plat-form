<template>
  <div class="m-box">
    <div class="nav"><a href="/home">首页</a> > 模板管理</div>
    <template-manage></template-manage>
  </div>
</template>

<script>
import templateManage from './templateManage';
export default {
  name: 'MailTemplate',
  props: {},
  components: { templateManage },
  data() {
    return {
    };
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.nav {
  font-size: 14px;
  color: #999;
  padding: 20px;
}
a {
  text-decoration: none;
  color: #999;
}
</style>
