<template>
  <div class="eb-box">
    <i class="el-icon-back" @click="backToMain"></i>
    <br>
    <p class="b-title">基本信息</p>
    <div class="b-box">
      <div class="tag">
        <label>理赔编号:</label>
        <span>{{detail.id}}</span>
      </div>
      <div class="tag">
        <label>运单号码:</label>
        <span>{{detail.waybillNo}}</span>
      </div>
      <div class="tag">
        <label>支付金额:</label>
        <span>{{detail.paymentAmount}}</span>
      </div>
      <div class="tag">
        <label>支付时间:</label>
        <span>{{detail.paymentTime}}</span>
      </div>
    </div>
    <div class="b-box">
      <div class="tag">
        <label>工单状态:</label>
        <span>{{detail.claimState}}</span>
      </div>
      <div class="tag">
        <label>客户姓名:</label>
        <span>{{detail.customerName}}</span>
      </div>
    </div>
    <div class="p-box">
      <p class="b-title">理赔信息</p>
      <!--<hr style="border-bottom: 1px solid #dcdfe6; margin-top: 1px;"/>-->
      <el-row :gutter="20" justify="center" align="center">
        <el-col :span="6">
          <label>客户类型:</label>
          <el-select v-model="detail.customerType" placeholder="请选择">
            <el-option
              v-for="item in customerTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <label>姓名:</label>
          <el-input v-model="detail.customerName" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="6">
          <label>手机号:</label>
          <el-input v-model="detail.customerTel" :disabled="true" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="6">
          <label>理赔金额:</label>
          <el-input v-model="detail.claimAmount" :disabled="true" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center" align="center">
        <el-col :span="6">
          <label>收款账户类型:</label>
          <el-select
            v-model="detail.receivableAccountsType"
            @change="changeAccount"
            placeholder="请选择"
          >
            <el-option
              v-for="item in accountOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <label v-if="isBankShow">开户行:</label>
          <el-input v-if="isBankShow" v-model="detail.openingBank" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="6">
          <label>账户姓名:</label>
          <el-input v-model="detail.accountName" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="6">
          <label>账户号:</label>
          <el-input v-model="detail.accountCode" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="up-box">
      <p class="b-title">
        附件上传
        <span>大小不超过2MB</span>
      </p>
      <el-row>
        <el-col :span="6">
          <div class="up-item">
            <upload-image
              :type="1"
              :userAttachmentList="userAttachmentList"
              @remove-image="removeImage"
              @file-upload="fileUpload"
              :baseUrl="baseUrl"
              :mobile="mobile"
              key="1"
            >
              <label>
                发件底单图片:
                <span>(最多上传2张)</span>
              </label>
            </upload-image>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="up-item">
            <upload-image
              :type="2"
              :userAttachmentList="userAttachmentList"
              @remove-image="removeImage"
              @file-upload="fileUpload"
              :baseUrl="baseUrl"
              :mobile="mobile"
              key="2"
            >
              <label>
                交易图片:
                <span>(最多上传2张)</span>
              </label>
            </upload-image>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="up-item">
            <upload-image
              :type="5"
              :userAttachmentList="userAttachmentList"
              @remove-image="removeImage"
              @file-upload="fileUpload"
              :baseUrl="baseUrl"
              :mobile="mobile"
              key="5"
            >
              <label>
                  <el-tooltip class="item" effect="dark" content="证件图片必须上传两张" placement="top">
                    <span class="tip_msg">?</span>
                  </el-tooltip> 证件图片:
                <span>(身份证、驾驶证、军人证)</span>
                <!-- <span>(最多上传2张)</span> -->
              </label>
            </upload-image>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="up-item">
            <upload-image
              :type="3"
              :userAttachmentList="userAttachmentList"
              @remove-image="removeImage"
              @file-upload="fileUpload"
              :baseUrl="baseUrl"
              :mobile="mobile"
              key="3"
            >
              <label>
                价值证明图片:
                <span>(最多上传2张)</span>
                <i class="el-icon-download"></i>
                <a
                  href="../../../../static/doc/jzzm.docx"
                  download
                  style="color: #3c8dbc;text-decoration: none"
                >价值证明模板</a>
              </label>
            </upload-image>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="up-item">
            <upload-image
              :type="4"
              :userAttachmentList="userAttachmentList"
              @remove-image="removeImage"
              @file-upload="fileUpload"
              :baseUrl="baseUrl"
              :mobile="mobile"
              key="4"
            >
              <label>
                委托书图片:
                <span>(最多上传2张)</span>
                <i class="el-icon-download"></i>
                <a
                  href="../../../../static/doc/grwts.docx"
                  download
                  style="color: #3c8dbc;text-decoration: none"
                >个人模板</a>
                <br>
                <i class="el-icon-download"></i>
                <a
                  href="../../../../static/doc/cgswts.docx"
                  download
                  style="color: #3c8dbc;text-decoration: none"
                >企业模板</a>
              </label>
            </upload-image>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--<hr style="border-bottom: 1px solid #C4C4C5; margin-top: 1.5%;"/>-->
    <div style="width: 100%; height: 60%">
      <el-checkbox v-model="checked" @change="changeStatus">我已阅读并同意《理赔协议》</el-checkbox>
      <el-dialog title="理赔协议" width="30%" :visible.sync="claimDialogVisible" right>
        <div>
         <p> 甲方（客户）：<span>{{detail.customerName}}</span></p>
         <p>乙方（快递公司）：圆通速递有限公司</p>
         <div> <p style="line-height:1.8;">与甲方
          <span id="agreeYear"></span>年
          <span id="agreeMonth"></span>月
          <span id="agreeDay"></span>日协商从乙方寄出快件（单号：
          <span>{{detail.waybillNo}}</span> 内件为：□文件/□物品），在运输途中□破损/□遗失/□短少/ ______ 。现经双方协商一致，达成如下：</p>
         <ul>
          <li>
          乙方支付甲方人民币（
          <span>{{detail.claimAmount}}</span> 元大写（
          <span>{{claimAmountUppercase.claimAmountUppercase}}</span> ），以作补偿。
          </li>
          <li>乙方支付上述款项后，甲方保证就此事不再以任何形式、任何理由向乙方提出任何赔偿费用要求。
          </li>
          <li>甲方对上述填写资料确保真实有效，后续产生问题，乙方保留追究权利。</li>
          </ul>
          <p style="margin-top:10px;">注：最终解释权归乙方所有</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="claimDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-button type="primary" style="margin-left: 95%;" @click="commitClaim">提交</el-button>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import netAPI from '@/api';
import Compressor from 'compressorjs';
import axio from 'axios';
import UploadImage from './UploadImage.vue';
export default {
  components: { UploadImage },
  name: 'EditClaim',
  data() {
    return {
      customerTypes: [
        {
          value: '1',
          label: '寄件人'
        },
        {
          value: '0',
          label: '收件人'
        },
        {
          value: '2',
          label: '第三方'
        }
      ],
      accountOptions: [
        {
          value: '10',
          label: '支付宝'
        },
        {
          value: '20',
          label: '微信'
        },
        {
          value: '30',
          label: '中国建设银行'
        },
        {
          value: '40',
          label: '中国工商银行'
        },
        {
          value: '50',
          label: '招商银行'
        },
        {
          value: '60',
          label: '中国农业银行'
        },
        {
          value: '70',
          label: '中国银行'
        },
        {
          value: '80',
          label: '中国民生银行'
        },
        {
          value: '90',
          label: '中国广大银行'
        },
        {
          value: '100',
          label: '中信银行'
        },
        {
          value: '110',
          label: '上海银行'
        },
        {
          value: '120',
          label: '其他'
        }
      ],
      isBankShow: true,
      items: [],
      detail: {},
      checked: false,
      claimDialogVisible: false,
      claimAmountUppercase: '',
      c5CliamState: '',
      complaintId: '',
      baseUrl: process.env.NODE_ENV !== 'production' ? 'http://10.129.221.229:50100' : 'http://iwdgj.yto56.com.cn:18001/ec-claim',
      mobile: '',
      userAttachmentList: []
    };
  },
  watch: {},
  computed: {
    userId() {
      return this.$store.state.user.userId;
    }
  },
  created() {
    this.initData();
    this.getClaimVoucher();
    console.log('baseUrl=' + this.baseUrl);
  },
  methods: {
    initData() {
      function changeCLaimState(res) {
        if (_.isObject(res) && _.isNumber(res.claimState)) {
          switch (res.claimState) {
            case 5:
              res.claimState = '待上传';
              break;
            case 10:
              res.claimState = '审核中';
              break;
            case 20:
              res.claimState = '审核中';
              break;
            case 30:
              res.claimState = '审核中';
              break;
            case 50:
              res.claimState = '审核已驳回';
              break;
            case 40:
              res.claimState = '审核通过';
              break;
            case 60:
              res.claimState = '资料驳回';
              break;
            case 70:
              res.claimState = '撤销';
              break;
            case 80:
              res.claimState = '撤销';
              break;
          }
        }
      }
      // this.baseUrl =
      //   this.baseUrl + '/v1/crmComplaintClaimAttachment/uploadFile';
      let param = this.$route.params.item || '';
      return netAPI
        .claimDetail({
          id: param,
          associatorTel: null
        })
        .then(res => {
          if (_.isObject(res)) {
            this.c5CliamState = res.claimState;
            this.mobile = res.customerTel;
            changeCLaimState(res);
            if (
              res.receivableAccountsType === '10' ||
              res.receivableAccountsType === '20'
            ) {
              this.isBankShow = false;
            }
            this.detail = res;
            this.complaintId = res.complaintId;
          }
        });
    },
    getClaimVoucher() {
      if (this.detail.id) {
        return netAPI
          .memberMessage({
            limit: 9999,
            pageNo: 1,
            claimId: this.detail.id,
            replyUserMobile: this.detail.customerTel
          })
          .then(res => {
            this.items = (res && res.items) || [];
          });
      }
    },
    changeAccount() {
      if (
        this.detail.receivableAccountsType === '10' ||
        this.detail.receivableAccountsType === '20'
      ) {
        this.isBankShow = false;
      }
    },

    changeStatus() {
      if (this.checked === false) {
        this.checked = false;
        return;
      }
      this.claimInfo();
    },
    claimInfo() {
      return netAPI
        .claimInfo({
          id: this.detail.id,
          associatorTel: this.detail.customerTel
        })
        .then(res => {
          this.claimAmountUppercase = res;
          this.claimDialogVisible = true;
        });
    },
    commitClaim() {
      // 证件图片(身份证、驾驶证、军人证)
      let item1 =
        (this.userAttachmentList &&
          this.userAttachmentList.filter(x => {
            return x.attachmentType === 5;
          })) ||
        [];
      // 发件底单图片
      let item2 =
        (this.userAttachmentList &&
          this.userAttachmentList.filter(x => {
            return x.attachmentType === 1;
          })) ||
        [];
      // 交易图片
      let item3 =
        (this.userAttachmentList &&
          this.userAttachmentList.filter(x => {
            return x.attachmentType === 2;
          })) ||
        [];
      if (this.checked === false) {
        this.$message({
          type: 'info',
          message: '请先阅读理赔协议'
        });
        return;
      }
      if (item1.length !== 2) {
        this.$message({
          type: 'info',
          message: '证件图片不能有空,且需要上传2张'
        });
        return;
      }
      if (item2.length < 1 || item3.length < 1) {
        this.$message({
          type: 'info',
          message: '发件底单、交易图片至少上传一张'
        });
        return;
      }
      return netAPI
        .IDuplaod({
          id: this.detail.id,
          bigProblemId: this.detail.bigProblemId,
          customerType: this.detail.customerType,
          customerName: this.detail.customerName,
          claimAmount: this.detail.claimAmount,
          claimState: this.c5CliamState,
          receivableAccountsType: this.detail.receivableAccountsType,
          accountCode: this.detail.accountCode,
          waybillNo: this.detail.waybillNo,
          complaintId: this.complaintId,
          associatorTel: this.detail.customerTel,
          attachmentList: this.userAttachmentList,
          accountName: this.detail.accountName,
          openingBank: this.detail.openingBank
        })
        .then(res => {
          this.$message({
            type: 'success',
            message: '提交成功'
          });
          this.$router.push({
            name: 'Main'
          });
        });
    },
    getPercent(size) {
      if (size !== undefined) {
        return NaN;
      }
      var per = 1 - 10 / size;
      if (per >= 0.9472) {
        return 0;
      } else if (per >= 0.839) {
        return 0.2;
      } else if (per >= 0.7618) {
        return 0.4;
      } else if (per >= 0.6799) {
        return 0.6;
      } else if (per >= 0.4641) {
        return 0.8;
      } else {
        return NaN;
      }
    },
    removeImage: function (id) {
      let index = this.userAttachmentList.findIndex(x => {
        return x.id === id;
      });
      if (index >= 0) {
        this.userAttachmentList.splice(index, 1);
      }
    },
    fileUpload: function (item, type) {
      let formData = new FormData();
      let _this = this;
      // formData.append('file', item.file);
      console.log('上传图片接口-参数', item.file);
      const fileSize = item.file.size / (1024 * 1024);
      // 大于10m执行压缩
      if (fileSize > 10) {
        const percent = _this.getPercent(fileSize);
        const compressor = new Compressor(item.file, {
          quality: percent,
          success: function (result) {
            formData.append('file', result);
            _this.commonFileUpload(formData, type);
          }
        });
        console.log(compressor);
      } else {
        formData.append('file', item.file);
        _this.commonFileUpload(formData, type);
      }
    },
    commonFileUpload(formData, type) {
      let _this = this;
      console.log('userId=' + _this.userId);
      let url = _this.baseUrl + '/v1/crmComplaintClaimAttachment/uploadFile';
      axio
        .post(url + '?reportVipId=' + _this.userId, formData)
        .then(res => {
          console.log(res);
          _this.userAttachmentList.push({
            attachmentType: type,
            attachmentUrl:
              _this.baseUrl + '/v1/crmComplaintClaimAttachment/getFile?picId=' +
              res.data.data.attachmentUrl,
            id: res.data.data.id
          });
        });
    },
    backToMain() {
      this.$router.push({
        name: 'Main'
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.eb-box {
  padding: 40px;
  font-size: 14px;
  color: #333;
  .b-title {
    font-size: 16px;
    font-weight: 600;
    margin: 20px 0;
    span {
      display: inline-block;
      color: #999;
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .b-box {
    margin-bottom: 20px;
    .tag {
      width: 300px;
      display: inline-block;
    }
  }
}
.p-box /deep/ {
  border-top: 1px solid #ccc;
  .el-input {
    width: 200px;
  }
  .el-row {
    margin-bottom: 20px;
  }
  label {
    width: 100px;
    text-align: right;
    display: inline-block;
  }
}
.up-box /deep/ {
  padding-top: 10px;
  .el-row {
    margin-bottom: 30px;
  }
  .up-item {
    label {
      width: 100px;
      vertical-align: top;
      display: inline-block;
      span {
        display: block;
        color: #999;
      }
    }
    img {
      width: 80px;
      height: 80px;
    }
    div {
      display: inline-block;
    }
    .tip_msg {
      display: inline-block;
      width: 13px;
      height: 13px;
      border-radius: 100%;
      border: 1px solid #ccc;
      background: #ccc;
      color: #fff;
      text-align: center;
    }
  }
}
ul {
  list-style-type: decimal;
  li {
    padding: 10px;
  }
}
</style>
