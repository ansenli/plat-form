<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="145px" class="yt">
    <img class="block-title-icon" src="@/assets/images/zengzhi@2x.png">
    <el-form-item label="增值服务：" prop="insurance">
      <el-checkbox v-model="form.isInsurance" label="保价" @change="toggleCheck" border></el-checkbox>
      <span v-show="form.isInsurance && form.insurance > 0 && insuranceFee">保价费用：{{insuranceFee}}元</span>
      <br v-show="form.isInsurance">
      <el-input
        v-show="form.isInsurance"
        @change="getInsuranceFee"
        style="max-width: 220px;"
        v-model="form.insurance"
        type="number"
        min="100"
        max="30000"
      ></el-input>
      <a href="#" @click="onFee">保费标准</a>
    </el-form-item>
    <el-form-item label="特殊备注：">
      <!-- <el-row>
        <el-checkbox-button
          @change="setRemark(remark1, '需要纸箱')"
          v-model="remark1"
          label="需要纸箱"
          border
        ></el-checkbox-button>
        <el-checkbox-button
          @change="setRemark(remark2, '需要爬楼')"
          v-model="remark2"
          label="需要爬楼"
          border
        ></el-checkbox-button>
        <el-checkbox-button
          @change="setRemark(remark3, '缺文件袋')"
          v-model="remark3"
          label="缺文件袋"
          border
        ></el-checkbox-button>
        <el-checkbox-button
          @change="setRemark(remark4, '需要胶带')"
          v-model="remark4"
          label="需要胶带"
          border
        ></el-checkbox-button>
        <el-checkbox-button
          @change="setRemark(remark5, '来前电话')"
          v-model="remark5"
          label="来前电话"
          border
        ></el-checkbox-button>
      </el-row> -->
      <el-row>
        <el-input
          size="large"
          v-model="form.remark"
          style="width: calc(100% - 40px);max-width: 420px;"
          placeholder="请输入您想对快递小哥说的话"
          maxlength="50"
        ></el-input>
      </el-row>
    </el-form-item>
    <el-dialog title="保费标准" :visible.sync="isFeeDialog" width="500px" append-to-body>
      <div class="title">声明保价价值高于3万元，系统默认保价金额3万元;保价金额低于100元,系统默认保价金额100元</div>
      <h4>
        <span>100(含)-1000(含)</span> 1元
      </h4>
      <h4>
        <span>1000-2000(含)</span>2元
      </h4>
      <h4>
        <span>2000-1万(含)</span>3‰
      </h4>
      <h4>
        <span>1万-3万(含)</span>5‰
      </h4>
    </el-dialog>
  </el-form>
</template>

<script>
import netAPI from '@/api';
import reg from '@/utils/validateRegulars';
const { baseFn } = reg;
export default {
  name: 'incrementMail',
  props: {
    detail: {
      default: {}
    }
  },
  computed: {},
  watch: {
    'form.remark': function (newremark, oldremark) {
      this.form.remark = newremark.replace(
        // eslint-disable-next-line no-useless-escape
        /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.\。\?\,\，\!\ ]/g,
        ''
      );
    }
  },
  data() {
    let valiAddr = baseFn('cn_letter_number');
    let valiInsurance = (rule, value, callback) => {
      if (this.form.isInsurance) {
        let regObj = reg.reg['int'];
        if (!regObj.reg.test(value)) {
          callback(new Error(regObj.message));
          return false;
        }
        if (value < 100 || value > 30000) {
          callback(new Error('请输入100-30000之间整数'));
          return false;
        }
      }
      callback();
    };
    return {
      insuranceFee: '',
      // form: {
      //   isInsurance: false,
      //   insurance: '',
      //   remark: ''
      // },
      form: this.detail,
      rules: {
        insurance: [{ validator: valiInsurance, trigger: ['blur'] }],
        remark: [{ max: 50, message: '不能超过50字', trigger: 'blur' }, { validator: valiAddr, trigger: 'blur' }]
      },
      remark1: false,
      remark2: false,
      remark3: false,
      remark4: false,
      remark5: false,
      isFeeDialog: false
    };
  },
  created() {
    this.getInsuranceFee(this.form.insurance);
  },
  mounted() {
  },
  methods: {
    // 切换是否保价按钮
    toggleCheck() {
      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
      });
    },
    // 获取保费
    getInsuranceFee(val) {
      this.form.insurance = parseInt(val);
      if (!isNaN(val) && val >= 100 && val <= 30000) {
        netAPI.getInsuranceFee(parseInt(val)).then(res => {
          if (res['premium']) {
            this.insuranceFee = res['premium'];
          } else {
            this.$message({
              type: 'warning',
              message: '计算保费失败，请重新输入保价计算！'
            });
          }
        });
      } else {
        this.insuranceFee = '';
      }
    },
    // 勾选备注
    setRemark(isTrue, label) {
      if (isTrue) {
        this.form.remark +=
          this.form.remark.length > 0 ? `,${label}` : `${label}`;
      } else {
        this.$set(
          this.form,
          'remark',
          this.form.remark.replace(new RegExp(`${label},`, 'g'), '')
        );
        this.$set(
          this.form,
          'remark',
          this.form.remark.replace(new RegExp(`,${label}`, 'g'), '')
        );
        this.$set(
          this.form,
          'remark',
          this.form.remark.replace(new RegExp(`${label}`, 'g'), '')
        );
      }
    },
    onFee() {
      this.isFeeDialog = true;
    },
    valiInsurance(rule, value, callback) {
      if (this.form.isInsurance) {
        let regObj = reg.reg['int'];
        if (!regObj.reg.test(value)) {
          callback(new Error(regObj.message));
          return false;
        }
        if (value < 100 || value > 30000) {
          callback(new Error('范围100-30000'));
          return false;
        }
      }
      callback();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.block-title-icon {
  position: relative;
  left: 20px;
  top: 0px;
  width: 20px;
  height: 36px;
}
.btn-tool-bar {
  display: inline-block;
  max-width: 420px;
  width: calc(100% - 145px);
  margin-left: 145px;
  text-align: right;
}
.like-btn {
  font-size: 14px;
  color: #47086c;
  cursor: pointer;
  &.black {
    color: #666666;
  }
}
.yt /deep/ {
  .el-form-item__label {
    color: #333;
  }
  .el-checkbox-button {
    margin-right: 20px;
    margin-bottom: 10px;
    border: 1px dotted #ccc;
    border-radius: 5px;
  }
  .el-checkbox-button__inner {
    border: 0;
    border-radius: 0;
    padding: 11px 15px;
  }
  .el-checkbox-button.is-checked {
    border: 1px solid #ccc;
  }
}
.title {
  color: red;
  font-size: 14px;
}
h4 {
  color: #333;
  font-size: 14px;
  span {
    margin-right: 50px;
    width: 100px;
    text-align: right;
    display: inline-block;
  }
}
</style>
