<template>
  <div>
    <msg-dialog title="如何获取经验值？" :visible.sync="isShow" width="1000px">
      <div class="title">经验值获取方式：用户通过寄件、参与活动、购物等行为获取经验值，经验值与积分无对等关系。</div>
      <table>
        <tr>
          <th>获取方式</th>
          <th>经验值规则</th>
          <th>经验值有效期</th>
        </tr>
        <tr>
          <td>寄件</td>
          <td>10经验值/票</td>
          <td rowspan="4">
            <div style="line-height:2">实际消费金额/5 经验值
              <br>
              <span>获取的经验值；</span>
            </div>
            <div style="line-height:2;margin-top:10px">例：2017年12月31日24:00开始清零的
              <br>
              <span>过期经验值是2016年1月1日-2016年</span>
              <br>
              <span>12月31日期间获取的经验值；</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>物流评价</td>
          <td>10经验值/次</td>
        </tr>
        <tr>
          <td>主动注册</td>
          <td>100经验值</td>
        </tr>
        <tr>
          <td>完善资料</td>
          <td>20经验值</td>
        </tr>
      </table>
    </msg-dialog>
  </div>
</template>
<script>
import msgDialog from './msgDialog';
export default {
  name: 'FortuneBox',
  components: { msgDialog },
  props: ['visible'],
  watch: {
    visible(val) {
      this.isShow = val;
    },
    isShow(val) {
      this.$emit('update:visible', val);
    }
  },
  data() {
    return {
      isShow: this.visible
    };
  }
};
</script>
<style lang="scss" rel="stylesheet/scss"  scoped>
.title {
  text-align: center;
  color: #999;
  font-size: 14px;
}
table,
table tr th,
table tr td {
  border: 1px solid #ccc;
  color: #333;
  font-size: 14px;
}
table {
  width: 900px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  border-collapse: collapse;
  margin-top: 20px;
  margin-left: 20px;
}
</style>
