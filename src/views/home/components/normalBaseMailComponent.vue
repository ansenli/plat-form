<template>
  <el-form :model="form" ref="form" :rules="rules" label-width="145px"  class="yt">
    <img class="block-title-icon" :src="imgSrc">
    <el-form-item label="姓名：" prop="name">
      <el-input size="large" v-model="form.name" style="width: calc(100% - 40px);max-width: 420px;" :placeholder="'请输入' + (type === 'send' ? '寄' : '收') + '件人姓名'" clearable></el-input>
      <div v-if="isAddrShow" @click="showAddressBook" style="display: inline-block; cursor: pointer; text-align: center; vertical-align: middle;">
        <img src="@/assets/images/adress@2x.png" style="width: 20px; height: 20px;">
        <p style="margin: 0px; padding: 0px;font-size: 12px; color: #333333; line-height: 12px;">地址簿</p>
      </div>
    </el-form-item>
    <el-form-item label="联系方式：" prop="phone">
      <el-input size="large" v-model="form.phone"  style="width: calc(100% - 40px);max-width: 420px;" placeholder="手机号/固话" clearable @blur="changeMobile"></el-input>
    </el-form-item>
    <el-form-item label="所属区域：" prop="region">
      <el-cascader
          size="large"
          ref="district"
          style="width: calc(100% - 40px); max-width: 420px;"
          :options="districtOptions"
          v-model="form.region"
          :props="props"
          @change="setDistrictName"
          @active-item-change="handleItemChange">
      </el-cascader>
    </el-form-item>
    <el-form-item label="详细地址：" prop="address">
      <el-input size="large"  @blur="changeAddress" v-model="form.address" style="width: calc(100% - 40px);max-width: 420px;" placeholder="请输入详细地址" clearable ></el-input>
    </el-form-item>
    <a @click="smartInputShow = !smartInputShow" style="margin-left: 145px;margin-bottom:10px;display:inline-block;" class="like-btn">智能录入</a>
    <template v-if="smartInputShow">
      <el-form-item>
        <el-input
            :maxlength="200"
            v-model="oneKeyInfo"
            style="width: calc(100% - 40px);max-width: 420px;"
            type="textarea"
            :rows="3"
            resize="none"
            placeholder="如：张三，XX省XX市XX街道，13112345678">
        </el-input>
      </el-form-item>
      <div class="btn-tool-bar">
        <a class="like-btn black" @click="oneKeyInfo = '';">清空</a>
        <el-button @click="analyseAddr" type="primary">一键录入</el-button>
      </div>
    </template>
  </el-form>
</template>

<script>
import netAPI from '@/api';
import district from '@/mixins/district';
import reg from '@/utils/validateRegulars';
const { baseFn } = reg;
export default {
  components: {},
  props: {
    type: {
      default: 'send'
    },
    isAddrShow: false,
    number: 0
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
      oneKeyInfo: '',
      districtOptions: [],
      smartInputShow: false,
      form: {
        name: '',
        phone: '',
        region: [],
        regionName: [],
        address: ''
      },
      limit: 10,
      page: 1,
      total: 0,
      infoDialogIsShow: false,
      editId: ''
    };
  },
  created() {
    var _this = this;
    _this.getDistrict('086', _this.districtOptions, function () {
      if (_this.form.region && _this.form.region.length > 1 && _this.form.region.length > 1) {
        _this.setDistrict(_this.districtOptions, _this.form.region, 0);
      }
    });
  },
  methods: {
    // 解析地址
    analyseAddr() {
      // 产选的 18751855212 上海市青浦区华龙路13号
      netAPI.smartResolve(this.oneKeyInfo).then(res => {
        if (res.message === 'success') {
          const data = res.data;
          this.form.name = data.name;
          this.form.phone = data.mobile || data.phone;
          this.form.region = [data.provinceCode, data.cityCode, data.countyCode];
          this.setDistrict(this.districtOptions, this.form.region, 0);
          this.form.regionName = [data.province, data.city, data.county];
          this.form.address = data.detail;
          // 解析成功后，重新计算时效产品
          this.$emit('change-address');
          this.smartInputShow = false;
        } else {
          this.$message({
            type: 'warning',
            message: '解析失败'
          });
        }
      });
    },
    // 显示电话簿
    showAddressBook() {
      this.$emit('show-address-book', this.type);
    },
    // 获取电话簿列表
    getList() {
      netAPI.getAddressList({
        limit: this.limit,
        pageNo: this.page
      }).then(res => {
        this.total = parseInt(res.total);
        this.items = res.items;
      });
    },
    // 改变区域
    handleItemChange(val) {
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
      this.form.regionName = this.$refs['district'].currentLabels;
    },
    changeMobile() {
      if (this.number === 1 && this.type === 'send') {
        // eslint-disable-next-line no-constant-condition
        if (/^((\d{3,5}|\d{3,5}-)?(\d{7,10})(-(\d{3,}))?|(1[23456789]\d{9}))$/) {
          console.log('this.phone=' + this.form.phone);
          this.$emit('change-mobile', this.form.phone);
        }
      }
    },
    changeAddress() {
      if (this.form.address) {
        this.$emit('change-address');
      }
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
