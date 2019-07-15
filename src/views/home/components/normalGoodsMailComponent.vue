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
      <el-radio-group @change="setWeight" v-model="weightRadio">
        <el-radio label="1">1KG</el-radio>
        <el-radio label="2">2KG</el-radio>
        <el-radio label="3">3KG</el-radio>
        <el-radio label="other">其他</el-radio>
      </el-radio-group>
      <div v-show="isWeightInput" style="display:inline-block;">
        <el-input style="max-width: 80px;" v-model="form.weight" type="number" min="0" max="50" @blur="changeWeight"></el-input>&nbsp;KG
      </div>
    </el-form-item>
    <el-form-item label="抵用券：" v-if="number==1 && selectAging!='CND'">
      <span v-if="couponsList.length === 0">无可用抵用券</span>
      <el-select clearable size="large" ref="ioio" v-else v-model="form.couponsMoney" :placeholder="placeName" @change="setCoupon" :disabled="disabled">
        <el-option
          v-for="item in couponsArr"
          :key="item.id"
          :label="item.couponValue + ' 元'"
          :value="item.id"
          :disabled="item.disabled">
          <span style="float: left">{{ item.couponValue }} 元</span>
          <span style="float: right; color: #8492a6; font-size: 13px">有效期 {{ item.expirationTime | dateYmd }}</span>
        </el-option>
      </el-select>
      <!--<el-radio-group v-else v-model="form.couponsMoney">-->
        <!--<el-checkbox v-for="(item) in couponsList" :key="item.id" :label="item.couponValue" border>{{item.couponValue}} 元</el-checkbox>-->
      <!--</el-radio-group>-->
    </el-form-item>
  </el-form>
</template>

<script>
import reg from '@/utils/validateRegulars';
import Cookies from 'js-cookie';
const { baseFn } = reg;
export default {
  props: ['couponsList', 'number', 'totalCoupon', 'selectAging'],
  computed: {
    couponsArr: function () {
      return this.couponsList;
    },
    placeName: function () {
      return this.totalCoupon > 10 ? '今日抵用券次数已用完' : '请选择抵用券';
    },
    disabled: function () {
      return this.totalCoupon > 10;
    }
  },
  mounted() {
    if (this.isLogin) {
      this.getConponInfo();
    }
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
      }
      callback();
    };
    return {
      isLogin: Cookies.get('jwt-token'),
      isWeightInput: false,
      weightRadio: '1',
      options: ['食品', '文件', '服饰', '生活用品', '数码产品'],
      form: {
        weight: '1',
        name: '',
        couponsMoney: ''
      },
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'change' },
          { max: 128, message: '不能超过128字', trigger: 'blur' },
          { validator: valiName, trigger: 'blur' }
        ],
        weight: [{ validator: valiWeight, trigger: 'blur' }, { max: 10, message: '不能超过10字', trigger: 'blur' }]
      }
    };
  },
  methods: {
    getConponInfo() {
      let id = this.$route.params.id;
      if (id && id.length > 0) {
        this.form.couponsMoney = id;
        this.$delete(this.$route.params, 'id');
      }
    },
    setWeight(val) {
      if (val === 'other') {
        this.isWeightInput = true;
        this.form.weight = '';
      } else {
        this.isWeightInput = false;
        this.form.weight = val;
        this.$emit('change-weight');
      }
    },
    // 改变重量
    changeWeight() {
      if (this.form.weight) {
        this.$emit('change-weight');
      }
    },
    setCoupon(value) {
      console.log('res=' + value);
      this.$emit('select-coupon', value, this.number);
    },
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
    right: 240px;
    bottom: -20px;
  }
}
</style>
