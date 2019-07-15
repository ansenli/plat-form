<template>
  <div class="yto-box">
    <div style="display:flex;">
      <div style="flex:1;">
        <el-input placeholder="请输入运单号点击查询" v-model="input" clearable></el-input>
      </div>
      <div style="padding-left:20px;">
        <el-button type="primary">查询</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shortcut',
  props: {},
  data() {
    return {
      input: ''
    };
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
