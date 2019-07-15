<template>
  <div>
    <el-upload
      ref="mostMails"
      class="upload-demo"
      action
      :auto-upload="false"
      :show-file-list="false"
      :on-change="resolveFile"
    >
      <template slot="trigger">
        <el-button size="large" type="info" plain>
          <i class="el-icon-document"></i>选择文件
        </el-button>
        <el-input size="large" style="width: 300px;" v-model="fileName" readonly></el-input>
      </template>
      <el-button
        style="margin-left: 10px;"
        size="large"
        type="primary"
        @click="downLoadTemplate()"
      >模板下载</el-button>
      <el-button
        v-if="importList.length < 1"
        style="margin-left: 10px;"
        size="large"
        type="primary"
        @click="fileSubmit"
      >提交</el-button>
      <el-button
       v-if="importList.length > 0"
       @click="batchSubmit"
        style="margin-left: 10px;"
        size="large"
        type="primary"
      >提交</el-button>
      <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
    </el-upload>
    <p>
      <span class="red-font">*</span>温馨提示：为保证订单完整性和准确性，请按模版导入，一次最多入100条订单，每天最多提交5次。
    </p>
    <batch-mail :importList="importList" v-if="importList.length > 0"></batch-mail>
  </div>
</template>

<script>
import xlsxJs from 'xlsx';
import netAPI from '@/api';
import Cookies from 'js-cookie';
import batchMail from './batch/batchMail';
import { trackEvent } from '@/utils/common';

export default {
  components: { batchMail },
  props: {},
  data() {
    return {
      fileName: '',
      fileNameSuffixs: ['xls', 'xlsx', 'XLS', 'XLSX'],
      isLogin: Cookies.get('jwt-token'),
      isFail: false,
      importList: [],
      sheetArray: ''
    };
  },
  methods: {
    // 下载批量导入模板文件
    downLoadTemplate() {
      trackEvent(['_trackEvent', '批量寄件', '模板下载', '模板下载']);
      if (this.isLogin) {
        let a = document.createElement('a');
        a.href = '/static/template/batchTemplate.xls';
        const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
        if (userAgent.indexOf('Firefox')) {
          a.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            })
          );
        } else {
          a.click();
        }
        this.$message({ message: '亲，正在进行下载保存', type: 'info' });
      } else {
        this.$message({ message: '亲，您还没有登录呢', type: 'warning' });
      }
    },
    // 解析文件
    resolveFile(file) {
      if (this.isLogin) {
        this.fileName = file.name;
        this.$refs['mostMails'].uploadFiles = [file];
        this.validateFile();
        this.readFile(file);
      } else {
        this.$message({ message: '亲，您还没有登录呢', type: 'warning' });
      }
    },
    // 上传之前，做文件格式等上传前的校验
    validateFile() {
      if (this.fileName !== null) {
        // 获取文件后缀名
        let suffix = this.fileName.substring(this.fileName.lastIndexOf('.') + 1);
        // 判断后缀名是否合法
        let flag = false;
        for (let index in this.fileNameSuffixs) {
          if (suffix !== this.fileNameSuffixs[index]) {
            flag = false;
          } else {
            flag = true;
            break;
          }
        }
        if (!flag) {
          this.$message({ message: '亲，请上传Excel文件', type: 'warning' });
          return null;
        }
      }
    },
    // 读取并验证文件内容，展示到列表页面，并标出错误行。如果全都没有错误则直接入库
    readFile(file) {
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          // 以列表形式读取文件内容
          const workbook = xlsxJs.read(data, { type: 'binary' });
          for (let sheet in workbook.Sheets) {
            // sheetArray 是个二维json数组，例如：
            // ['0':['senderName':'张三','senderPhone':'13800000000'],'1':['senderName':'张三','senderPhone':'13800000000']]
            // 支持key自定义等多种形式，本次采用自定义表头别名。具体请参考sheetJs API：https://docs.sheetjs.com/#json
            this.sheetArray = xlsxJs.utils.sheet_to_json(
              workbook.Sheets[sheet],
              {
                header: [
                  'senderName',
                  'senderProvinceName',
                  'senderCityName',
                  'senderDistrictName',
                  'senderAddress',
                  'senderPhone',
                  'receiverName',
                  'receiverProvinceName',
                  'receiverCityName',
                  'receiverDistrictName',
                  'receiverAddress',
                  'receiverPhone',
                  'insuranceValue',
                  'name',
                  'weight',
                  'remark'
                ]
              }
            );
            if (this.sheetArray.length > 101) {
              this.$message.warning('亲，单个文件最大支持100条数据！');
              return false;
            } else if (this.sheetArray.length <= 0) {
              this.$message.warning('亲，您导入的是空文件！');
              return false;
              // 数据验证，验证完成后将数据展示在列表页面中，并将有错误的数据标红
            }
            console.log(this.sheetArray);
            this.dataValidation(this.sheetArray);
            this.importList = [];// 清空之前的选项
          }
        } catch (e) {
          this.$message.warning('亲，文件格式不正确！');
          return false;
        }
      };
      fileReader.readAsBinaryString(file.raw);
    },
    // 验证数据合法性
    dataValidation(sheetArray) { },
    // 提交订单
    submitData() {
      let sheetArray = this.sheetArray;
      if (!sheetArray) {
        this.$message.warning('请先选择上传文件');
        return false;
      }
      // 订单集合
      let importRequestList = [];
      for (let i in sheetArray) {
        // 数组第一个元素 为表头
        if (sheetArray.hasOwnProperty(i) && i > 0) {
          let _data = {
            orderSource: 'PC',
            channelCode: 'MYTOTEST',
            payType: '1',
            businessType: 'BATCH',
            orderExtendRequestList: [],
            orderProductRequestArrayList: [],
            orderVasRequestList: []
          };
          // 增值服务
          _data.orderVasRequestList.push({
            code: 'INSURANCE',
            name: 'INSURANCE',
            amount: sheetArray[i]['insuranceValue'] || ''
          });
          // 物品信息
          _data.orderProductRequestArrayList.push({
            name: sheetArray[i]['name'],
            weight: sheetArray[i]['weight']
          });
          _data.remark = sheetArray[i]['remark'];
          // 寄件人信息
          _data.senderDistrictName = sheetArray[i]['senderDistrictName'];
          _data.senderAddress = sheetArray[i]['senderAddress'];
          _data.senderCityName = sheetArray[i]['senderCityName'];
          _data.senderName = sheetArray[i]['senderName'];
          _data.senderPhone = sheetArray[i]['senderPhone'];
          _data.senderProvinceName = sheetArray[i]['senderProvinceName'];
          // 收件人信息
          _data.receiverDistrictName = sheetArray[i]['receiverDistrictName'];
          _data.receiverAddress = sheetArray[i]['receiverAddress'];
          _data.receiverCityName = sheetArray[i]['receiverCityName'];
          _data.receiverName = sheetArray[i]['receiverName'];
          _data.receiverPhone = sheetArray[i]['receiverPhone'];
          _data.receiverProvinceName = sheetArray[i]['receiverProvinceName'];

          importRequestList.push(_data);
        }
      }
      this.commitSubmit(importRequestList);
    },
    // 提交数据
    commitSubmit(list) {
      netAPI.subOrderBatch(list).then(res => {
        if (res.failList.length > 0) {
          this.$message({
            message: '亲，有数据验证未通过，请您根据错误提示修改后再次提交！',
            type: 'warning'
          });
          var failList = res.failList;
          if (res.successList && res.successList.length > 0) {
            // 加入成功的订单
            failList = failList.concat(res.successList);
          }
          // 添加id
          failList.map((x, index) => {
            x.id = index + 1;
          });
          this.importList = failList;
        } else {
          this.importList = [];
          this.fileName = '';
          this.sheetArray = '';
          this.$message({ message: '亲，已经提交成功了！', type: 'success' });
        }
      });
    },
    // 批量提交
    batchSubmit() {
      trackEvent(['_trackEvent', '批量寄件', '提交', '提交']);
      let requestList = [];
      let errorList = this.importList.filter(x => {
        return x.errorMessage && x.errorMessage !== '';
      });
      if (errorList && errorList.length > 0) {
        this.$message({
          message: '请检查必填项及格式是否有误',
          type: 'warning'
        });
        return false;
      }
      this.importList.forEach((item, index) => {
        let _data = {
          orderSource: 'PC',
          businessType: 'BATCH',
          orderExtendRequestList: [],
          orderProductRequestArrayList: [],
          orderVasRequestList: []
        };
        // 增值服务
        _data.orderVasRequestList.push({
          code: 'INSURANCE',
          name: 'INSURANCE',
          amount:
            item.orderVasResponseList && item.orderVasResponseList[0].amount
        });
        // 物品信息
        _data.orderProductRequestArrayList.push({
          name:
            item.orderProductResponseArrayList &&
            item.orderProductResponseArrayList[0].name,
          weight:
            item.orderProductResponseArrayList &&
            this.toDecimal(item.orderProductResponseArrayList[0].weight)
        });

        _data.remark = item.remark;
        // 寄件人信息
        _data.senderDistrictName = item.senderDistrictName;
        _data.senderAddress = item.senderAddress;
        _data.senderCityName = item.senderCityName;
        _data.senderName = item.senderName;
        _data.senderPhone = item.senderPhone;
        _data.senderProvinceName = item.senderProvinceName;
        // 收件人信息
        _data.receiverDistrictName = item.receiverDistrictName;
        _data.receiverAddress = item.receiverAddress;
        _data.receiverCityName = item.receiverCityName;
        _data.receiverName = item.receiverName;
        _data.receiverPhone = item.receiverPhone;
        _data.receiverProvinceName = item.receiverProvinceName;

        requestList.push(_data);
      });
      // 提交数据
      this.commitSubmit(requestList);
    },
    fileSubmit() {
      // 提交
      trackEvent(['_trackEvent', '批量寄件', '提交', '提交']);
      this.submitData();
    },
    // 去掉首尾空格
    trim(str) {
      return (str && str.replace(/^\s+|\s+$/g, '')) || '';
    },
    toDecimal(x) {
      var f = parseFloat(x);
      if (isNaN(f)) {
        return;
      }
      f = Math.round(x * 1000) / 1000;
      return f;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
p {
  font-size: 14px;
  color: #999999;
  margin-top: 20px;
  .red-font {
    padding: 6px;
    vertical-align: middle;
    color: red;
  }
}
.el-button--info.is-plain {
  height: 40px;
  margin-right: -8px;
}
</style>
