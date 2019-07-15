<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="145px" class="yt">
    <img class="block-title-icon" src="@/assets/images/item@2x.png">
    <el-form-item label="物品类型：" prop="name">
      <el-select
          size="large"
          v-model="form.name"
          style="width: calc(100% - 40px);max-width: 420px;"
          placeholder="请选择物品类型"
          :filter-method="filterType"
          allow-create
          filterable>
        <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="物品重量：" prop="weight">
        <el-input style="width: 100px;" v-model="form.weight"  type="number"
        min="0"
        max="50"></el-input>&nbsp;KG
    </el-form-item>
  </el-form>
</template>

<script>
import reg from '@/utils/validateRegulars';
import Cookies from 'js-cookie';
const { baseFn } = reg;
export default {
  props: {
    detail: {
      default: {}
    }
  },
  computed: {},
  created() {
  },
  data() {
    var valiName = baseFn('cn_letter_number');
    let valiWeight = (rule, value, callback) => {
      if (this.isWeightInput) {
        if (value === '') {
          callback(new Error('不能为空'));
          return false;
        }
        let regObj = reg.reg['number'];
        if (!regObj.reg.test(value)) {
          callback(new Error(regObj.message));
          return false;
        }
        if (value <= 0 || value > 50) {
          callback(new Error('只支持50kg以下重量，且最多输入3位小数'));
          return false;
        }
        if (value.length > 10) {
          callback(new Error('不能超过10字'));
          return false;
        }
      }
      callback();
    };
    return {
      isLogin: Cookies.get('jwt-token'),
      isWeightInput: true,
      options: ['食品', '文件', '服饰', '生活用品', '数码产品'],
      form: this.detail,
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'change' },
          { max: 128, message: '不能超过128字', trigger: 'blur' },
          { validator: valiName, trigger: 'blur' }
        ],
        weight: [{ validator: valiWeight, trigger: 'blur' }]
      }
    };
  },
  methods: {
    filterType(value) {
      this.form.name = value;
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
  .el-form-item__error {
    // right:240px;
    bottom: -20px;
  }
}
</style>
