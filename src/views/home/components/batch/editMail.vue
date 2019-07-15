<template>
  <div class="order_box">
    <el-dialog
      :modal="true"
      title="寄件编辑"
      :visible.sync="dialogVisible"
      width="1000px"
      @open="open"
      @close="close"
      center
    >
      <div class="normal-mail-box">
        <el-row style="border-bottom: 1px solid #c0c4cc; display: flex;">
          <el-col :span="12" style="border-right: 1px solid #c0c4cc;">
            <basic-mail
              ref="b_sendForm"
              :isAddrShow="true"
              type="send"
              key="send"
              :detail="sendForm"
            ></basic-mail>
          </el-col>
          <el-col :span="12">
            <basic-mail
              ref="b_receiveForm"
              :isAddrShow="true"
              type="receive"
              key="receive"
              :detail="receiveForm"
            ></basic-mail>
          </el-col>
        </el-row>
        <el-row style="border-bottom: 1px solid #c0c4cc; display: flex;">
          <el-col :span="12" style="border-right: 1px solid #c0c4cc;">
            <increment-mail ref="b_increForm" :detail="incrementForm"></increment-mail>
          </el-col>
          <el-col :span="12">
            <goods-mail ref="b_goodsForm" :detail="goodsForm"></goods-mail>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button type="info" plain @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import basicMail from './basicMail';
import incrementMail from './incrementMail';
import goodsMail from './goodsMail';
export default {
  components: { basicMail, incrementMail, goodsMail },
  props: ['visible', 'detail'],
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    dialogVisible(newVal) {
      this.$emit('update:visible', newVal);
    }
  },
  computed: {
    // sendForm: function() {
    //   return {
    //     name: this.detail.senderName,
    //     phone: this.detail.senderPhone,
    //     region: [],
    //     regionName: [],
    //     address:this.detail.senderAddress
    //   }
    // },
    // receiveForm: function() {
    //   return {
    //     name: this.detail.receiverName,
    //     phone: this.detail.receiverPhone,
    //     region: [],
    //     regionName: [],
    //     address:this.detail.receiverAddress,
    //   }
    // }
  },
  data() {
    return {
      dialogVisible: this.visible,
      sendForm: {
        name: this.detail.senderName,
        phone: this.detail.senderPhone,
        region: this.detail.senderProvinceCode && this.detail.senderCityCode && this.detail.senderDistrictCode ? [
          this.detail.senderProvinceCode,
          this.detail.senderCityCode,
          this.detail.senderDistrictCode
        ] : [],
        regionName: [
          this.detail.senderProvinceName,
          this.detail.senderCityName,
          this.detail.senderDistrictName
        ],
        address: this.detail.senderAddress
      },
      receiveForm: {
        name: this.detail.receiverName,
        phone: this.detail.receiverPhone,
        region: this.detail.receiverProvinceCode && this.detail.receiverCityCode && this.detail.receiverDistrictCode ? [
          this.detail.receiverProvinceCode,
          this.detail.receiverCityCode,
          this.detail.receiverDistrictCode
        ] : [],
        regionName: [
          this.detail.receiverProvinceName,
          this.detail.receiverCityName,
          this.detail.receiverDistrictName
        ],
        address: this.detail.receiverAddress
      },
      incrementForm: {
        isInsurance:
          !!(this.detail.orderVasResponseList &&
            this.detail.orderVasResponseList[0].amount > 0),
        insurance:
          this.detail.orderVasResponseList &&
          this.detail.orderVasResponseList[0].amount,
        remark: this.detail.remark
      },
      goodsForm: {
        weight:
          this.detail.orderProductResponseArrayList &&
          this.detail.orderProductResponseArrayList[0].weight,
        name:
          (this.detail.orderProductResponseArrayList &&
            this.detail.orderProductResponseArrayList[0].name) || ''
      }
    };
  },
  created() { },
  mounted() { },
  methods: {
    // 显示电话簿
    showAddressBook(type) {
      this.$emit('show-address-book', type);
    },
    open() { },
    close() {
      this.$refs['b_sendForm'].$refs['form'].resetFields();
      this.$refs['b_receiveForm'].$refs['form'].resetFields();
      this.$refs['b_increForm'].$refs['form'].resetFields();
      this.$refs['b_goodsForm'].$refs['form'].resetFields();
      this.$emit('close');
    },
    submit() {
      let _sendData = this.$refs['b_sendForm'].form;
      let _receiveData = this.$refs['b_receiveForm'].form;
      let _increData = this.$refs['b_increForm'].form;
      let _goodsData = this.$refs['b_goodsForm'].form;
      let valiTrue = false;
      this.$refs['b_sendForm'].$refs['form'].validate(valid => {
        valiTrue = valid;
      });
      this.$refs['b_receiveForm'].$refs['form'].validate(valid => {
        valiTrue = valid;
      });
      this.$refs['b_increForm'].$refs['form'].validate(valid => {
        valiTrue = valid;
      });
      this.$refs['b_goodsForm'].$refs['form'].validate(valid => {
        valiTrue = valid;
      });
      if (valiTrue) {
        // 寄件人信息
        this.detail.senderName = this.trim(_sendData.name);
        this.detail.senderPhone = this.trim(_sendData.phone);
        this.detail.senderAddress = this.trim(_sendData.address);
        this.detail.senderProvinceCode = _sendData.region[0];
        this.detail.senderProvinceName = _sendData.regionName[0];
        this.detail.senderCityCode = _sendData.region[1];
        this.detail.senderCityName = _sendData.regionName[1];
        this.detail.senderDistrictCode = _sendData.region[2];
        this.detail.senderDistrictName = _sendData.regionName[2];

        // 收件人信息
        this.detail.receiverName = this.trim(_receiveData.name);
        this.detail.receiverPhone = this.trim(_receiveData.phone);
        this.detail.receiverAddress = this.trim(_receiveData.address);
        this.detail.receiverProvinceCode = _receiveData.region[0];
        this.detail.receiverProvinceName = _receiveData.regionName[0];
        this.detail.receiverCityCode = _receiveData.region[1];
        this.detail.receiverCityName = _receiveData.regionName[1];
        this.detail.receiverDistrictCode = _receiveData.region[2];
        this.detail.receiverDistrictName = _receiveData.regionName[2];

        // 增值服务
        if (this.detail.orderVasResponseList && this.detail.orderVasResponseList.length > 0) {
          this.detail.orderVasResponseList[0].amount = _increData.insurance;
          this.detail.remark = _increData.remark;
        }

        // 物品信息
        if (this.detail.orderProductResponseArrayList && this.detail.orderProductResponseArrayList.length > 0) {
          this.detail.orderProductResponseArrayList[0].name = _goodsData.name;
          this.detail.orderProductResponseArrayList[0].weight = _goodsData.weight;
        }
        this.detail.errorMessage = '';
        this.close();
        console.log('change detail =' + JSON.stringify(this.detail));
      }
    },
    // 去掉首尾空格
    trim(str) {
      return (str && str.replace(/^\s+|\s+$/g, '')) || '';
    },
    cancel() {
      this.close();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.normal-mail-box {
  .echelon-btn {
    position: relative;
    top: calc(-50% - 40px);
    left: calc(100% - 30px);
    width: 30px;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 0px;
      height: 80px;
      border-right: 30px solid #47086c;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
    }
    &:after {
      text-align: center;
      position: absolute;
      left: 7px;
      top: 16px;
      width: 14px;
      height: 80px;
      content: '模板寄件';
      color: white;
      font-size: 14px;
    }
  }
}
</style>
