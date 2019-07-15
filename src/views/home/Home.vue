<template>
  <div class="container">
    <div class="container-content">首页信息</div>
  </div>
</template>

<script>
export default {
  components: {
  },
  name: 'Home',
  watch: {
  },
  inject: ['reload'],
  data() {
    return {
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.container {
  background: #fff;
  min-height: calc((100vh - 40pt) - 88px);
  &-content {
    padding: 0px;
    line-height: 90px;
  }
}
</style>
