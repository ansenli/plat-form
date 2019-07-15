<template>
  <el-form :model="form" ref="form" :rules="rules" label-width="145px"  class="yt">
    <img class="block-title-icon" :src="imgSrc">
    <el-form-item label="姓名：" prop="name">
      <el-input size="large" v-model="form.name"  style="width: calc(100% - 40px);max-width: 420px;" :placeholder="'请输入' + (type === 'send' ? '寄' : '收') + '件人姓名'" clearable></el-input>
    </el-form-item>
    <el-form-item label="联系方式：" prop="phone">
      <el-input size="large" v-model="form.phone"  style="width: calc(100% - 40px);max-width: 420px;" placeholder="手机号/固话" clearable></el-input>
    </el-form-item>
    <el-form-item label="所属区域：" prop="region">
      <el-cascader
          size="large"
          ref="district1"
          style="width: calc(100% - 40px); max-width: 420px;"
          :options="districtOptions"
          v-model="form.region"
          :props="props"
          @change="setDistrictName"
          @active-item-change="handleItemChange">
      </el-cascader>
    </el-form-item>
    <el-form-item label="详细地址：" prop="address">
      <el-input size="large" v-model="form.address"  style="width: calc(100% - 40px);max-width: 420px;" placeholder="请输入详细地址" clearable></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import district from '@/mixins/district';
import reg from '@/utils/validateRegulars';
const { baseFn } = reg;
export default {
  name: 'basicMail',
  components: {},
  props: {
    type: {
      default: 'send'
    },
    isAddrShow: false,
    detail: {
      default: {}
    }
  },
  mixins: [district],
  computed: {
    imgSrc() {
      if (this.type === 'send') {
        return require('@/assets/images/jijianren@2x.png');
      } else {
        return require('@/assets/images/shoujianren@2x.png');
      }
    }
  },
  watch: {
    'form.region': function () {
      if (this.form.region.length > 1 && !this.isDistrictChange) {
        let val = this.form.region;
        if (val[0] === 'string' && val[1] === 'string' && val[2] === 'string') {
          return;
        } else {
          this.setDistrict(this.districtOptions, val, 0);
        }
      }
      this.isDistrictChange = false;
    }
  },
  data() {
    var valiName = baseFn('cn_letter_number');
    var valiPhone = baseFn('number_line');
    let valiAddr = baseFn('cn_letter_number');
    return {
      addressList: [],
      isShowAddr: false,
      isDistrictChange: false,
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: valiName, trigger: 'blur' },
          { max: 20, message: '不能超过20字', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机/固话', trigger: 'blur' },
          { validator: valiPhone, trigger: 'blur' },
          { max: 20, message: '不能超过20字', trigger: 'blur' }],
        region: [{ required: true, message: '请选择区域', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' },
          { max: 128, message: '不能超过128字', trigger: 'blur' },
          { min: 5, message: '不少于5字符', trigger: 'blur' },
          { validator: valiAddr, trigger: ['change', 'blur'] }]
      },
      props: {
        label: 'name',
        value: 'code',
        children: 'leafRegions'
      },
      districtOptions: [],
      form: this.detail
    };
  },
  created() {
    var _this = this;
    _this.getDistrict('086', _this.districtOptions, function () {
      if (_this.form.region && _this.form.region.length > 1 && _this.form.region[0]) {
        _this.setDistrict(_this.districtOptions, _this.form.region, 0);
      }
    });
  },
  methods: {
    // 改变区域
    handleItemChange(val) {
      // this.selectDistrict(this.districtOptions, val);
      let limit = 3;
      if (val[0] === '00853') {
        limit = 1;
      } else if (val[0] === '886001') {
        limit = 2;
      }
      this.selectDistrict(this.districtOptions, val, limit);
    },
    setDistrictName() {
      this.isDistrictChange = true;
      this.form.regionName = this.$refs['district1'].currentLabels;
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
  .el-button--primary {
    margin-bottom: 10px;
    margin-left: 10px;
  }
}
.like-btn {
  font-size: 14px;
  color: #47086c;
  cursor: pointer;
  text-decoration: none;
  &.black {
    color: #666666;
  }
}
.yt /deep/ {
  .el-form-item__label {
    color: #333;
  }
}
</style>
