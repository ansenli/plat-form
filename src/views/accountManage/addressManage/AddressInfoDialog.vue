<template>
  <el-dialog class="dialog" :modal="false" :visible.sync="isShow" @open="open" @close="close" width="650px">
    <div slot="title" class="dialog-title">
      {{editId ? '修改地址薄' : '新增地址薄'}}
    </div>
    <el-form :model="form" ref="form" :rules="rules" label-width="100px">
      <el-row>
        <el-form-item label="姓名" prop="name">
          <el-input class="custom-input"  v-model="form.name"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="联系方式" prop="phone">
          <el-input class="custom-input"  v-model="form.phone"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="所在地区" prop="region">
          <el-cascader
              ref="district"
              class="custom-input"
              :options="districtOptions"
              v-model="form.region"
              :props="props"
              @change="setDistrictName"
              @active-item-change="handleItemChange">
          </el-cascader>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="详细地址" prop="address">
          <el-input class="custom-input"  v-model="form.address"  :rows="2"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item v-if="type === 'SHIPINGADDRESS'" label=" " prop="defaultAddress">
          <el-checkbox v-model="form.defaultAddress">设为寄件默认地址</el-checkbox>
        </el-form-item>
        <el-form-item v-if="type === 'PICKUPADDRESS'" label=" " prop="defaultAddress">
          <el-checkbox v-model="form.defaultAddress">设为收件默认地址</el-checkbox>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer clearfix">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import netAPI from '@/api';
import district from '@/mixins/district';
import reg from '@/utils/validateRegulars';
let { baseFn } = reg;
export default {
  name: '',
  mixins: [district],
  components: {},
  computed: {
  },
  props: ['visible', 'editId', 'type'],
  watch: {
    visible(val) {
      this.isShow = val;
    },
    isShow(val) {
      this.$emit('update:visible', val);
    }
  },
  data() {
    let valiPhone = baseFn('number_line');
    let valiAddr = baseFn('cn_letter_number');
    return {
      isShow: this.visible,
      props: {
        label: 'name',
        value: 'code',
        children: 'leafRegions'
      },
      districtOptions: [],
      form: {
        name: '',
        phone: '',
        region: [],
        regionName: [],
        address: '',
        // defaultShipingAddress: false,
        defaultAddress: false
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] },
          { max: 20, message: '不能超过20字', trigger: ['change', 'blur'] }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] },
          { validator: valiPhone, trigger: ['change', 'blur'] },
          { max: 20, message: '不能超过20字', trigger: ['change', 'blur'] }
        ],
        region: [
          { required: true, message: '不能为空', trigger: ['change'] }
        ],
        address: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] },
          { max: 128, message: '不能超过128字', trigger: 'blur' },
          { min: 5, message: '不少于5字符', trigger: 'blur' },
          { validator: valiAddr, trigger: ['change', 'blur'] }
        ]
      }
    };
  },
  created() {
    this.getDistrict('086', this.districtOptions);
  },
  methods: {
    // 弹出
    open() {
      if (this.editId) {
        netAPI.getAddressById(this.editId).then(res => {
          if (Object.keys(res).length > 0) {
            this.form.name = res.userName;
            this.form.phone = res.userPhone;
            this.form.defaultAddress = res.isDefault;
            this.form.address = res.address;
            this.form.region = [res.provCode, res.cityCode, res.districtCode];
            this.setDistrict(this.districtOptions, this.form.region, 0);
            this.form.regionName = [res.prov, res.city, res.district];
            this.form.type = res.addressType;
            this.$nextTick(() => {
              this.$refs['form'].clearValidate();
            });
          }
        });
      }
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
      this.form.regionName = this.$refs['district'].currentLabels;
    },
    // 关闭
    close() {
      this.isShow = false;
      this.$refs['form'].resetFields();
    },
    // 提交
    submit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false;
        }
        let data = {
          userName: this.form.name,
          userPhone: this.form.phone,
          provCode: this.form.region[0],
          prov: this.form.regionName[0],
          cityCode: this.form.region[1],
          city: this.form.regionName[1],
          districtCode: this.form.region[2],
          district: this.form.regionName[2],
          address: this.form.address,
          isDefault: this.form.isDefault,
          addressType: this.type,
          type: '3'
        };
        if (this.editId.length > 0) {
          data.id = this.editId;
          netAPI.updateAddress(data).then(res => {
            this.saveCallback();
          });
        } else {
          data.id = 0;
          netAPI.saveAddress(data).then(res => {
            this.saveCallback();
          });
        }
      });
    },
    // 保存后的回调
    saveCallback() {
      this.isShow = false;
      this.$refs['form'].resetFields();
      this.$emit('refresh-list');
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.dialog /deep/ {
  .el-dialog {
    width: 500px;
  }
  .custom-input {
    width: calc(100% - 40px);
  }
  .el-dialog__body {
    height: 260px;
  }
  .dialog-footer {
    text-align: center;
  }
  .dialog-title {
    font-size: 16px;
    color: #000;
  }
  .el-input--small .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .el-form-item__label {
    color: #333;
  }
  .el-dialog__header {
    border-bottom: 0;
  }
  .el-dialog__header {
    padding: 20px 20px 0;
  }
  .el-cascader__label {
    height: 40px;
    line-height: 40px;
  }
  .el-button--small {
    width: 120px;
    height: 40px;
    font-size: 16px;
  }
}
</style>
