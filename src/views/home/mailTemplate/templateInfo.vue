<template>
  <div>
    <el-input v-model="templateName" :maxlength="20" placeholder="模板名称" size="large"></el-input>
    <el-row style="border-bottom: 1px solid #c0c4cc; display: flex;">
      <el-col :span="12" style="border-right: 1px solid #c0c4cc;">
        <normal-base-mail-component ref="sendForm" type="send" key="send"></normal-base-mail-component>
      </el-col>
      <el-col :span="12">
        <normal-base-mail-component ref="receiveForm" type="receive" key="receive"></normal-base-mail-component>
      </el-col>
    </el-row>
    <div style="text-align: center;margin-top:20px;" class="btn16">
      <el-button @click="save" type="primary">保存</el-button>
      <el-button @click="cancel" type="info" plain>取消</el-button>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
import normalBaseMailComponent from '../components/normalBaseMailComponent';
export default {
  name: '',
  props: {
    editId: {
      default: ''
    }
  },
  watch: {
    editId(val) {
      if (val.length > 0) {
        this.getInfoById(val);
      } else {
        this.templateName = '';
        this.$refs['sendForm'].$refs['form'].resetFields();
        this.$refs['receiveForm'].$refs['form'].resetFields();
      }
    }
  },
  components: { normalBaseMailComponent },
  data() {
    return {
      templateName: ''
    };
  },
  created() {
  },
  methods: {
    // 获取单条内容
    getInfoById(id) {
      netAPI.getTemplById(id).then(res => {
        this.templateName = res.templateName;
        let formSend = this.$refs['sendForm'].form;
        let formReceive = this.$refs['receiveForm'].form;
        formSend.name = res.senderName;
        formSend.phone = res.senderPhone;
        formSend.region = [res.senderProvinceCode, res.senderCityCode, res.senderDistrictCode];
        formSend.regionName = [res.senderProvinceName, res.senderCityName, res.senderDistrictName];
        formSend.address = res.senderAddress;
        formReceive.name = res.receiverName;
        formReceive.phone = res.receiverPhone;
        formReceive.region = [res.receiverProvinceCode, res.receiverCityCode, res.receiverDistrictCode];
        formReceive.regionName = [res.receiverProvinceName, res.receiverCityName, res.receiverDistrictName];
        formReceive.address = res.receiverAddress;
      });
    },
    // 保存
    save() {
      if (this.templateName === '') {
        this.$message({ type: 'warning', message: '模板名不能为空' });
        return false;
      }
      let valiTrue = false;
      this.$refs['sendForm'].$refs['form'].validate(valid => { valiTrue = valid; });
      if (!valiTrue) return false;
      this.$refs['receiveForm'].$refs['form'].validate(valid => { valiTrue = valid; });
      if (!valiTrue) return false;
      let data = {
        templateName: this.templateName
      };
      let formSend = this.$refs['sendForm'].form;
      let formReceive = this.$refs['receiveForm'].form;
      data.senderName = formSend.name;
      data.senderPhone = formSend.phone;
      data.senderAddress = formSend.address;
      data.senderProvinceCode = formSend.region[0];
      data.senderProvinceName = formSend.regionName[0];
      data.senderCityCode = formSend.region[1];
      data.senderCityName = formSend.regionName[1];
      data.senderDistrictCode = formSend.region[2];
      data.senderDistrictName = formSend.regionName[2];
      data.receiverName = formReceive.name;
      data.receiverPhone = formReceive.phone;
      data.receiverAddress = formReceive.address;
      data.receiverProvinceCode = formReceive.region[0];
      data.receiverProvinceName = formReceive.regionName[0];
      data.receiverCityCode = formReceive.region[1];
      data.receiverCityName = formReceive.regionName[1];
      data.receiverDistrictCode = formReceive.region[2];
      data.receiverDistrictName = formReceive.regionName[2];
      if (this.editId.length > 0) {
        data.id = this.editId;
        netAPI.updateTempl(data).then(res => {
          this.saveCallback();
        });
      } else {
        netAPI.addTempl(data).then(res => {
          this.saveCallback();
        });
      }
    },
    // 保存后回调
    saveCallback() {
      this.$message({
        type: 'success',
        message: '保存成功'
      });
      this.$emit('success');
      this.reset();
    },
    // 取消
    cancel() {
      this.reset();
      this.$emit('cancel');
    },
    // 清空
    reset() {
      this.templateName = '';
      this.$refs['sendForm'].$refs['form'].resetFields();
      this.$refs['receiveForm'].$refs['form'].resetFields();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
