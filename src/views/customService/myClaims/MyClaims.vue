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
          <el-select v-model="detail.customerType" placeholder="请选择" :disabled="true">
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
          <el-input v-model="detail.customerName"  :disabled="true"></el-input>
        </el-col>
        <el-col :span="6">
          <label>手机号:</label>
          <el-input v-model="detail.customerTel" :disabled="true"></el-input>
        </el-col>
        <el-col :span="6">
          <label>理赔金额:</label>
          <el-input v-model="detail.claimAmount" :disabled="true" ></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center" align="center">
        <el-col :span="6">
          <label>收款账户类型:</label>
          <el-select v-model="detail.receivableAccountsType" placeholder="请选择" :disabled="true">
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
          <el-input
            v-if="isBankShow"
            v-model="detail.openingBank"
            :disabled="true"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <label>账户姓名:</label>
          <el-input v-model="detail.accountName" :disabled="true"></el-input>
        </el-col>
        <el-col :span="6">
          <label>账户号:</label>
          <el-input v-model="detail.accountCode"  :disabled="true"></el-input>
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
            <list-image :type="1" :userAttachmentList="userAttachmentList" key="1">
              <label>
                发件底单图片:
                <span>(最多上传2张)</span>
              </label>
            </list-image>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="up-item">
            <list-image :type="2" :userAttachmentList="userAttachmentList" key="2">
              <label>交易图片:<span>(最多上传2张)</span></label>
            </list-image>
          </div>
        </el-col>
        <el-col :span="6">
         <div class="up-item">
            <list-image :type="5" :userAttachmentList="userAttachmentList" key="5">
              <label>证件图片:<span>(身份证、驾驶证、军人证)</span><span>(最多上传2张)</span></label>
            </list-image>
          </div>
        </el-col>
        <el-col :span="6">
         <div class="up-item">
            <list-image :type="3" :userAttachmentList="userAttachmentList" key="3">
               <label>价值证明图片: <span>(最多上传2张)</span> </label>
            </list-image>
         </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
        <div class="up-item">
          <list-image :type="4" :userAttachmentList="userAttachmentList" key="4">
            <label>委托书图片:<span>(最多上传2张)</span></label>
          </list-image>
        </div>
      </el-col>
      </el-row>
    </div>
    <div style="margin-top: 40px" v-if="items.length > 0">
    <p class="b-title">留言</p>
     <el-table
      :data="items" height="250"
      style="width: 100%">
      <el-table-column
        prop="replyUserRole"
        label="角色"
        width="200">
      </el-table-column>
      <el-table-column
        prop="replyContent"
        label="内容">
      </el-table-column>
      <el-table-column
        prop="replyTime"
        label="时间">
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
import _ from 'lodash';
import Viewer from 'viewerjs';
import ListImage from './ListImage';
export default {
  components: { ListImage },
  name: 'MyClaims',
  data() {
    return {
      customerTypes: [
        {
          value: '寄件人',
          label: '寄件人'
        },
        {
          value: '收件人',
          label: '收件人'
        },
        {
          value: '第三方',
          label: '第三方'
        }
      ],
      accountOptions: [
        {
          value: '支付宝',
          label: '支付宝'
        },
        {
          value: '微信',
          label: '微信'
        },
        {
          value: '中国建设银行',
          label: '中国建设银行'
        },
        {
          value: '中国工商银行',
          label: '中国工商银行'
        },
        {
          value: '招商银行',
          label: '招商银行'
        },
        {
          value: '中国农业银行',
          label: '中国农业银行'
        },
        {
          value: '中国银行',
          label: '中国银行'
        },
        {
          value: '中国民生银行',
          label: '中国民生银行'
        },
        {
          value: '中国广大银行',
          label: '中国广大银行'
        },
        {
          value: '中信银行',
          label: '中信银行'
        },
        {
          value: '上海银行',
          label: '上海银行'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      isBankShow: true,
      items: [],
      detail: {},
      userAttachmentList: []
    };
  },
  watch: {},
  created() {
    let _this = this;
    _this.initData().then(res => {
      _this.getClaimVoucher();
    });
  },
  methods: {
    initData() {
      let param = this.$route.params.item || '';
      let _this = this;
      return netAPI
        .claimDetail({
          id: param
        })
        .then(res => {
          if (_.isObject(res)) {
            _this.changeCLaimState(res);
            if (
              res.receivableAccountsType === '支付宝' ||
              res.receivableAccountsType === '微信'
            ) {
              this.isBankShow = false;
            }
            _this.detail = res;
            _this.userAttachmentList = res.listCca || [];
          }
        });
    },
    getClaimVoucher() {
      let param = this.$route.params.item || '';
      return netAPI
        .memberMessage({
          limit: 9999,
          pageNo: 1,
          claimId: param,
          replyUserMobile: this.detail.customerTel
        })
        .then(res => {
          this.items = (res && res.items) || [];
        });
    },
    changeCLaimState(res) {
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
    },
    showImg(item) {
      if (_.isEmpty(item)) {
        this.$message({
          type: 'warn',
          message: '文件不存在不能显示'
        });
        return;
      }
      const ref = this.$refs;
      Object.keys(ref).forEach(key => {
        console.log(key, ref[key]);
        const viewer = new Viewer(ref[key]);
        console.log(viewer);
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
      margin-left:5px;
    }
    div {
      display: inline-block;
    }
  }
}
</style>
