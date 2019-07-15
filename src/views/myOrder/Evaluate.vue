<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/myOrder">我的订单</el-breadcrumb-item>
      <el-breadcrumb-item>评价</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="evaluate-container">
      <template v-if="status === 'GOT' || status === 'SENT_SCAN'">
        <el-row>
          <div class="left-box">
            <img src="@/assets/images/yundan@2x.png"/><span class="txt-no">运单号</span>
            <p>{{mailNo}}</p>
            <div class="title">取件员</div>
            <div class="txt-content">
              <img src="@/assets/images/kuai@2x.png"/>
              <template v-if="empList">
                  <p><span>姓名：</span>{{empList.empName}}</p>
                  <p><span>联系方式：</span>{{empList.mobile}}</p>
                  <p><span>工号：</span>{{empList.empCode}}</p>
              </template>
            </div>
          </div>
          <div class="right-box">
            <img src="@/assets/images/ping@2x.png"/><span>取件员评价</span>
            <rate-box
                :tags="bringerTags"
                :star="bringerStar"
                @change-rate="changeRate('Bring', $event)"
                type="receive"
                @change-checkbox="changeCheckbox('Bring', $event)"
                :has-tag="true"
                :disabled="disabled1"></rate-box>
            <div class="btn-bar btn16">
              <el-button @click="back" type="info">返回</el-button>
              <el-button @click="submit" type="primary" v-if="!disabled1">提交</el-button>
            </div>
          </div>
        </el-row>
      </template>
      <template v-else-if="status === 'SIGNED' && type === 'send'">
        <el-row>
          <div class="left-box">
            <img src="@/assets/images/yundan@2x.png"/><span class="txt-no">运单号</span>
            <p>{{mailNo}}</p>
            <div class="title">取件员</div>
            <div class="txt-content">
              <img src="@/assets/images/kuai@2x.png"/>
              <template v-if="empList">
                <p><span>姓名：</span>{{empList.empName}}</p>
                <p><span>联系方式：</span>{{empList.mobile}}</p>
                <p><span>工号：</span>{{empList.empCode}}</p>
              </template>
            </div>
          </div>
          <div class="right-box">
            <img src="@/assets/images/ping@2x.png"/><span>取件员评价</span>
            <rate-box
                :tags="bringerTags"
                :star="bringerStar"
                @change-rate="changeRate('Bring', $event)"
                type="receive"
                @change-checkbox="changeCheckbox('Bring', $event)"
                :has-tag="true"
                :disabled="disabled1"></rate-box>
            <img src="@/assets/images/ping@2x.png"/><span>物流评价</span>
            <rate-box
                :star="trendStar"
                @change-rate="changeRate('Trend', $event)"
                :disabled="disabled4"></rate-box>
            <div class="btn-bar btn16">
              <el-button @click="back" type="info">返回</el-button>
              <el-button @click="submit" type="primary" v-if="!disabled1 || !disabled4">提交</el-button>
            </div>
          </div>
        </el-row>
      </template>
      <template v-else>
        <el-row>
          <div class="left-box">
            <img src="@/assets/images/yundan@2x.png"/><span class="txt-no">运单号</span>
            <p>{{mailNo}}</p>
            <div class="title">派件员</div>
            <div class="txt-content">
              <img src="@/assets/images/kuai@2x.png"/>
              <template v-if="empList">
                <p><span>姓名：</span>{{empList.empName}}</p>
                <p><span>联系方式：</span>{{empList.mobile}}</p>
                <p><span>工号：</span>{{empList.empCode}}</p>
              </template>
            </div>
          </div>
          <div class="right-box">
            <img src="@/assets/images/ping@2x.png"/><span>派件员评价</span>
            <rate-box
                :tags="senderTags"
                :star="senderStar"
                @change-rate="changeRate('Send', $event)"
                type="send"
                @change-checkbox="changeCheckbox('Send', $event)"
                :has-tag="true"
                :disabled="disabled2"></rate-box>
            <div class="btn-bar btn16">
              <el-button @click="back" type="info">返回</el-button>
              <el-button @click="submit" type="primary" v-if="!disabled2">提交</el-button>
            </div>
          </div>
        </el-row>
      </template>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
import rateBox from './components/rateBox';
export default {
  name: 'Evaluate',
  components: {rateBox},
  inject: ['reload'],
  data() {
    return {
      bringerTags: [],
      bringerStar: null,
      senderTags: [],
      senderStar: null,
      trendStar: null,
      disabled1: false,
      disabled2: false,
      disabled4: false,
      isEvaluate: false,
      type: 'send',
      orderId: '',
      mailNo: '',
      status: '',
      empList: null,
      data: {
        starBring: null,
        starTrend: null,
        starSend: null,
        tagsBring: [],
        tagsSend: []
      }
    };
  },
  watch: {
  },
  created() {
    this.pageInit();
  },
  methods: {
    // 返回之前页面
    back() {
      this.$router.back();
    },
    // 页面初始化
    pageInit() {
      let query = this.$route.query;
      console.log(query);
      this.orderId = query.orderId;
      this.status = query.status;
      this.mailNo = query.mailNo;
      this.type = query.type;
      netAPI.getEvalMess({
        orderId: this.orderId
      }).then(res => {
        for (let i = 0, l = res.length; i < l; i++) {
          let data = res[i];
          this['disabled' + data.business] = true;
          switch (data.business) {
            case 1:// 取件
              this.bringerStar = data.star;
              this.bringerTags = data.tags.split(',');
              break;
            case 2:// 派件
              this.senderStar = data.star;
              this.senderTags = data.tags.split(',');
              break;
            case 4:// 物流
              this.trendStar = data.star;
              break;
          }
        }
      });
      netAPI.empMess({
        orderId: this.orderId,
        isAccept: query.type === 'send' ? 0 : 1
      }).then(res => {
        this.empList = res;
      });
    },
    // 改变分数
    changeRate(type, data) {
      this.data['star' + type] = data;
    },
    // 改变tag选择
    changeCheckbox(type, data) {
      this.data['tags' + type] = data;
    },
    // 提交
    submit() {
      let data = {
        orderId: this.orderId,
        type: this.type === 'send' ? 1 : 2,
        remark: ''
      };
      if (this.type === 'send') {
        if (this.status === 'GOT' || this.status === 'SENT_SCAN') {
          if (!this.data.starBring) {
            this.$message({
              type: 'warning',
              message: '请评价取件员！'
            });
            return false;
          }
          data.star = this.data.starBring;
          data.tags = this.data.tagsBring.join(',');
          data.business = 1;// 取件员评价
          data.empCode = this.empList.empCode;
          this.save([data]);
        } else {
          let arr = [];
          let data1 = JSON.parse(JSON.stringify(data));
          if (!this.disabled4 && this.data.starTrend) {
            data.star = this.data.starTrend;
            data.business = 4;// 物流评价
            data.empCode = this.empList.empCode;
            arr.push(data);
          }
          if (!this.disabled1 && this.data.starBring) {
            data1.star = this.data.starBring;
            data1.tags = this.data.tagsBring.join(',');
            data1.business = 1;// 取件员评价
            data1.empCode = this.empList.empCode;
            arr.push(data1);
          }
          if (arr.length === 0) {
            this.$message({
              type: 'warning',
              message: '请填写评价信息！'
            });
            return false;
          }
          this.save(arr);
        }
      } else {
        if (!this.data.starSend) {
          this.$message({
            type: 'warning',
            message: '请评价派件员！'
          });
          return false;
        }
        data.star = this.data.starSend;
        data.tags = this.data.tagsSend.join(',');
        data.business = 2;// 派件员评价
        data.empCode = this.empList.empCode;
        this.save([data]);
      }
    },
    // 保存公共方法
    save(data) {
      netAPI.saveEvaluate(data).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '评价成功！'
          });
          this.reload();
        } else {
          this.$message({
            type: 'error',
            message: '评价失败！'
          });
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.evaluate-container /deep/ {
  margin: 20px 0;
  background-color: #ffffff;
  .el-row {
    display: flex;
    .left-box {
      width: 400px;
      font-size:14px;
      .title {
        &:before {
          position: relative;
          top: -3px;
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background-color: #47086C;
          border-radius: 50%;
          margin-right:5px;
        }
      }
      .txt-content{
        color:#000;
        p {
          // text-align: center;
          margin-left:110px;
          span {
            color:#666;
            display:inline-block;
            text-align: right;
            width:70px;
          }
        }
        img {
          vertical-align: middle;
          display:block;
          margin:0 auto;
        }
      }
      &>p {
        text-align: center;
        color: #3482DB;
      }
      .txt-no {
        font-size:16px;
        margin-left:10px;
      }
    }
    .right-box {
      position: relative;
      width: calc(100% - 407px);
      &.flex {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
      .btn-bar {
        text-align: right;
        position: absolute;
        right: 20px;
        bottom: 20px;
      }
      .evaluate-bar {
        &:first-of-type {
          margin-top: 30px;
        }
        margin-left: 130px;
        &>span {
          color: #666666;
        }
        .evaluate-selector {
          vertical-align: top;
          display: inline-block;
          .el-rate {
            margin-bottom: 10px;
          }
        }
      }
      &>img {
        vertical-align: middle;
        &+span {
          vertical-align: middle;
          font-size:16px;
          margin-left:10px;
          color:#333;
        }
      }
    }
    &:not(:last-child) {
      border-bottom: 1px solid #CCCCCC;
    }
    &>div {
      padding: 20px;
      box-sizing: border-box;
      &:not(:last-child) {
        border-right: 1px solid #CCCCCC;
      }
    }
  }
}
</style>
