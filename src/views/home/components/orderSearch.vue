<template>
  <div class="yto-box">
    <div style="display:flex;">
      <div style="flex:1;">
        <el-input size="large" placeholder="请输入运单号点击查询" v-model="form.input" clearable></el-input>
      </div>
      <div style="padding-left:20px;" class="btn16">
        <el-button @click="search" type="primary" size="large">查询</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { trackEvent } from '@/utils/common';
export default {
  name: 'orderSearch',
  props: {},
  data() {
    return {
      form: {
        input: ''
      }
    };
  },
  methods: {
    // 校验查询字段
    // 校验查询字段
    check() {
      if (this.form.input.length === 0) {
        this.$message({
          type: 'warning',
          message: '请输入运单号'
        });
        return false;
      }
      let arrNo = this.form.input.split(',');
      if (arrNo && arrNo.length > 5) {
        this.$message({
          type: 'warning',
          message: '一次最多只能查询5个'
        });
        return false;
      }
      for (let itemNo of arrNo) {
        if (!/^[A-Za-z\d]+$/.test(itemNo)) {
          this.$message({
            type: 'warning',
            message: '不能包含特殊字符'
          });
          return false;
        }
        if (!/^([8][0]|[9][9]|[D][D]|[G][8]|[6][0-9]|[7][0]|[7][9]|[7][8])[0-9]{16}$|^([8][A-Za-z0-9]|[G][0-9]|[D][D]|[M][0-9]|[B][9]|[D][B]|[1-7][0-9]|[H][1]|[Z][0-9]|[D][0-9]|[V][0-9]|[C][0-9]|[G][9])[0-9]{10}$|^([8][1][5][7]|[G][0][0][1])[0-9]{8}$|^([YTM])[0-9]{14}$|^YT[0-9]{13}$/.test(itemNo)) {
          this.$message({
            type: 'warning',
            message: '请输入正确的运单号'
          });
          return false;
        }
      }
      return true;
    },
    // 查询走件
    search() {
      trackEvent(['_trackEvent', '查询服务', '查件查询', '查件查询']);
      if (!this.check()) {
        return false;
      }
      this.$router.push({
        path: 'customService/myCheckPieces',
        query: { mailNo: this.form.input }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.yto-box {
  height: 44px;
  border-radius: 8px;
}
</style>
