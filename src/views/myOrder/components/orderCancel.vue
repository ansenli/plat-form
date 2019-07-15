<template>
  <el-dialog :modal="true" title="取消订单" :visible.sync="dialogVisible" width="680px" center>
    <div class="title">订单揽收之后不能取消订单哦</div>
    <div class="cancel-box">
      <el-radio-group v-model="reasonType"  @change="changeType">
        <el-radio-button v-for="(item, index) in items" :label="item.id"  :key="index" :value="item.name">{{item.name}}</el-radio-button>
      </el-radio-group>
      <el-form label-width="78px" v-if="textVisible">
        <el-form-item label="更多原因">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="remark" maxlength="150"></el-input>
          <span class="t-tip">{{count}}/150</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn16">
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button type="info" plain @click="cancel">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import netAPI from '@/api';
export default {
  props: ['visible', 'orderId', 'couponsMoney'],
  inject: ['reload'],
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    dialogVisible(newVal) {
      this.$emit('update:visible', newVal);
    }
  },
  computed: {
    textVisible: function () {
      return this.reasonType === 0 || false;
    },
    count: function () {
      return (this.remark && this.remark.length) || 0;
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      reasonType: 1,
      remark: '',
      items: [
        { id: 1, name: '不在业务员收派范围' },
        { id: 2, name: '禁运品' },
        { id: 3, name: '高价值不宜快递物品' },
        { id: 4, name: '超重超方' },
        { id: 5, name: '业务员要求' },
        { id: 6, name: '价格不能接受' },
        { id: 7, name: '业务员不同意使用代金劵' },
        { id: 8, name: '业务员不能按时取件' },
        { id: 9, name: '重复下单' },
        { id: 0, name: '其他' }
      ]
    };
  },
  created() { },
  methods: {
    // 提交
    submit() {
      if (this.reasonType === 0 && this.remark.length === 0) {
        this.$message({
          type: 'warning',
          message: '其他原因不能为空'
        });
        return false;
      }
      let item = this.items.find((x) => {
        return x.id === this.reasonType;
      });

      let remark = (this.reasonType === 0) ? this.remark : item && item.name;
      let data = {
        orderId: this.orderId,
        reasonType: this.reasonType,
        remark: remark
      };
      netAPI.cancelOrder(data).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: this.couponsMoney > 0 ? '取消订单成功!(抵用券五小时后归还)' : '取消订单成功!'
          });
          this.cancel();
          this.reload();
        }
      });
    },
    // 取消
    cancel() {
      this.dialogVisible = false;
      this.reasonType = 1;
    },
    changeType(type) {
      this.reasonType = type;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" rel="stylesheet/scss" scoped>
.title {
  font-size: 16px;
  color: rgba(204, 204, 204, 1);
  text-align: center;
  margin-bottom: 20px;
}
.cancel-box /deep/ {
  .el-radio-button {
    margin-right: 15px;
    margin-bottom: 20px;
    border-radius: 10px;
    border: 1px dashed #ccc;
    background: #fff;
    font-size: 14px;
    color: #666;

    .el-radio-button__inner {
      border: 0;
      background: transparent;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background: #47086c !important;
      border-color: #47086c !important;
      border-radius: 10px;
    }
  }
}
.dialog-footer {
  text-align: center;
}
.t-tip {
  position: absolute;
  right: 6px;
  bottom: 0;
  color: #999;
}
</style>
