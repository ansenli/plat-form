<template>
  <div class="fortune-mess-container">
    <mess-box icon="dengji@2x.png" title="会员等级">
      <el-row>
        <el-col :span="6" style="border-right: 1pt solid #F7F7F7">
          <div class="userBox">
            <img class="head-icon" :src="getIcon" v-if="getIcon">
            <img class="head-icon" src="@/assets/images/noLogin.png" v-else>
            <div class="btn-line">
              <el-button class="exp-btn" @click="toTranslate">经验值：<span>{{expValue}}</span></el-button>
              <el-button @click="signedOn" class="sign-on-btn" :disabled="isSignedOn">签到<img src="@/assets/images/integral@2x.png"/></el-button>
            </div>
            <div class="btn-line">
              <div class="as-link" @click="toCoupon">抵用券:<span>{{couponNum}} 张</span></div>
              <div class="as-link" @click="toJiFen">积分:<span>{{integral}}</span></div>
            </div>
            <div class="btn-line">
              <div class="exchange-line" @click="toIntegralMall">
                <img src="@/assets/images/exchange@2x.png"/>积分兑换
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="detail-integral-mess">
            <div class="mess-row">
              当前等级：<span>{{userLevel}}</span>
            </div>
            <div class="mess-row">
              经验值：<span style="color: #E69B24;">{{expValue}}</span>
            </div>
            <div class="mess-row">
              距离升级{{nextLevelName}}还需经验：<span style="color: #47086C;">{{nextLevelExp}}</span>
            </div>
            <div class="mess-row">
              经验值=
              <span class="exp-block">寄件</span>
              <i class="el-icon-plus"></i>
              <span class="exp-block">物流评价</span>
              <i class="el-icon-plus"></i>
              <span class="exp-block">主动注册</span>
              <!-- <i class="el-icon-plus"></i> -->
              <!-- <span class="exp-block">邀请好友</span> -->
              <i class="el-icon-plus"></i>
              <span class="exp-block">完善资料</span>
              <i class="el-icon-minus"></i>
              <span class="exp-block">过期经验值</span>
            </div>
            <el-button class="intro-exp-btn" @click="showExpress">经验值介绍</el-button>
          </div>
        </el-col>
      </el-row>
    </mess-box>
    <mess-box icon="tequan@2x.png" title="等级特权">
      <el-row>
        <el-col class="list-box" :span="6">
          <ul class="simple-list">
            <li><img src="@/assets/images/dazhong@2x.png"/>大众会员</li>
            <li><span></span>寄件积分奖励</li>
            <li class="no_p"><span></span>生日特权</li>
            <li><span></span>积分好礼</li>
          </ul>
        </el-col>
        <el-col class="list-box" :span="6">
          <ul class="simple-list">
            <li><img src="@/assets/images/huangjin@2x.png"/>黄金会员</li>
            <li><span></span>寄件积分奖励</li>
            <li class="no_p"><span></span>消费满赠（寄8票免1票）</li>
            <li class="no_p"><span></span>生日特权</li>
            <li><span></span>积分好礼</li>
          </ul>
        </el-col>
        <el-col class="list-box" :span="6">
          <ul class="simple-list">
            <li><img src="@/assets/images/bojin@2x.png"/>铂金会员</li>
            <li><span></span>寄件积分奖励</li>
            <li class="no_p"><span></span>消费满赠（寄7票免1票）</li>
            <li class="no_p"><span></span>生日特权</li>
            <li><span></span>积分好礼</li>
          </ul>
        </el-col>
        <el-col class="list-box" :span="6">
          <ul class="simple-list">
            <li><img src="@/assets/images/zuanshi@2x.png"/>钻石会员</li>
            <li><span></span>寄件积分奖励</li>
            <li class="no_p"><span></span>消费满赠（寄6票免1票）</li>
            <li class="no_p"><span></span>生日特权</li>
            <li><span></span>积分好礼</li>
          </ul>
        </el-col>
      </el-row>
    </mess-box>
    <mess-box icon="guanli@2x.png" title="积分管理">
      <el-row class="integral-manage-box">
        <el-col @click.native="routerTo('integralDetail')" class="link-box" :span="6">
          <img src="@/assets/images/jifen@2x.png">
          <div>积分明细</div>
        </el-col>
        <el-col class="link-box" :span="6" @click.native="toCoupon">
          <img src="@/assets/images/diyongquan@2x.png">
          <div>我的抵用券</div>
        </el-col>
        <el-col class="link-box" :span="6">
          <img src="@/assets/images/choujiang@2x.png">
          <div>积分抽奖</div>
        </el-col>
        <el-col class="link-box" :span="6"  @click.native="routerTo('integralMall')">
          <img src="@/assets/images/shangcheng@2x.png">
          <div>积分商城</div>
        </el-col>
      </el-row>
    </mess-box>
    <mess-box icon="shuoming@2x.png" title="积分说明" v-if="false">
      <table class="intro-table">
        <tr>
          <td>获取方式</td>
          <td>注册</td>
          <td>完善资料</td>
          <td>签到</td>
          <td>连续签到</td>
          <td>邀请新会员</td>
        </tr>
        <tr>
          <td>赠送积分值</td>
          <td>100</td>
          <td>20</td>
          <td>5</td>
          <td>5*天数，最高50</td>
          <td>500/位</td>
        </tr>
      </table>
    </mess-box>
    <mess-box icon="liliang@2x.png" title="流量信息" v-if="isUnicom">
      <div class="yt_content">
        <Unicom></Unicom>
        <!-- <a  class="link-text" href="https://m.10010.com/queen/yto-express/yuantong.html" target="_blank">尊敬的圆通会员，点此了解联通圆卡，享受流量服务</a> -->
      </div>
    </mess-box>
    <fortune-box :visible.sync="isVisible"></fortune-box>
  </div>
</template>

<script>
import netAPI from '@/api';
import messBox from '../components/messBox';
import FortuneBox from './FortuneBox';
import Unicom from './Unicom';
export default {
  name: 'FortuneMess',
  components: { messBox, FortuneBox, Unicom },
  computed: {},
  data() {
    return {
      getIcon: null,
      isSignedOn: false,
      expValue: 0,
      integral: 0,
      userLevel: '',
      nextLevelExp: 0,
      couponNum: 0,
      nextLevelName: '',
      isVisible: false,
      isUnicom: false
    };
  },
  created() {
    this.getUserMess();
    this.getHeadIcon();
    this.isUnicomUser();
  },
  methods: {
    // 获取头像
    getHeadIcon() {
      function blobToDataURL(blob, callback) {
        let a = new FileReader();
        a.onload = function (e) { callback(e.target.result); };
        a.readAsDataURL(blob);
      }
      netAPI.getHeadIcon().then(res => {
        if (res.size > 0) {
          blobToDataURL(res, (data) => {
            this.getIcon = data;
          });
        }
      });
    },
    routerTo(path) {
      this.$router.push(path);
    },
    // 点击签到
    signedOn() {
      netAPI.signedOn().then(res => {
        this.$message({
          type: 'success',
          message: '签到成功！'
        });
        this.getUserMess();
      });
    },
    // 获取签到情况
    signedOnStatus() {
      netAPI.signedOnStauts().then(res => {
        this.isSignedOn = res;
      });
    },
    // 用户积分和经验值
    getUserMess() {
      netAPI.getUserIntegral().then(res => {
        this.integral = res.availIntegral;
      });
      netAPI.getUserExp().then(res => {
        this.expValue = res.result;
        this.userLevel = res.userLevel;
        this.nextLevelExp = res.nextLevelExp;
        this.nextLevelName = res.nextLevelName;
      });
      netAPI.getCouponList({
        status: 1
      }).then(res => {
        this.couponNum = res.length;
      });
      this.signedOnStatus();
    },
    toCoupon() {
      this.$router.push({ name: 'MyCoupon' });
    },
    toIntegralMall() {
      this.$router.push({ name: 'IntegralMall' });
    },
    showExpress() {
      this.isVisible = true;
    },
    toJiFen() {
      this.$router.push({ name: 'IntegralDetail' });
    },
    toTranslate() {
      this.$router.push({ name: 'translate' });
    },
    isUnicomUser() {
      netAPI.isUnicomUser().then(res => {
        this.isUnicom = res;
      }).catch(() => {
        this.isUnicom = false;
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.fortune-mess-container {
  .list-box {
    display: flex;
    justify-content: center;
    .simple-list {
      padding: 40px 0;
      margin: 0;
      list-style: none;
      font-size: 16px;
      color: #333;
      li {
        &:not(:last-of-type) {
          margin-bottom: 20px;
        }
        img {
          width: 30px;
          height: 20px;
          margin-right: 12px;
        }
        span {
          margin-right: 22px;
          margin-left: 12px;
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #e69b24;
          border-radius: 8px;
        }
      }
      .no_p {
        color: gray;
        opacity: 0.5;
      }
    }
  }
  .intro-table {
    text-align: center;
    color: #333333;
    font-size: 16px;
    border-collapse: separate;
    border-spacing: 20px;
    td {
      padding-left: 60px;
    }
  }
  .link-text {
    cursor: pointer;
    padding: 20px 0 20px 100px;
    color: #47086c;
    font-size: 16px;
    text-decoration: none;
  }
  .integral-manage-box {
    .link-box {
      cursor: pointer;
      padding-top: 40px;
      padding-bottom: 20px;
      text-align: center;
      img {
        width: 180px;
        height: 148px;
        margin-bottom: 22px;
      }
      div {
        font-size: 14px;
        color: #333333;
      }
      &:not(:last-of-type) {
        border-right: 2px solid #f7f7f7;
      }
    }
  }
  .detail-integral-mess {
    padding: 40px;
    .mess-row {
      color: #333333;
      margin-bottom: 20px;
      font-size: 14px;
      .exp-block {
        text-align: center;
        display: inline-block;
        min-width: 80px;
        padding: 8px;
        border: 1px solid #999999;
        border-radius: 28px;
        color: #999999;
      }
    }
  }
  .exp-btn {
    color: #333333;
    width: 120px;
    border: 2px solid #e69b24;
    border-radius: 28px;
    span {
      color: #e69b24;
    }
  }
  .intro-exp-btn {
    padding: 10px 20px;
  }
  .sign-on-btn {
    margin-left: 20px;
    width: 120px;
    img {
      margin-left: 10px;
      height: 14px;
      width: 14px;
    }
  }
  .intro-exp-btn,
  .sign-on-btn {
    color: white;
    font-size: 14px;
    background-color: #e69b24;
    border: 2px solid #e69b24;
    border-radius: 28px;
  }
  .userBox {
    .head-icon {
      width: 106px;
      height: 106px;
      border-radius: 50%;
    }
    .btn-line {
      margin-top: 20px;
      text-align: center;
      .exchange-line {
        margin-bottom: 20px;
        cursor: pointer;
        color: #e69b24;
        font-size: 14px;
        img {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
      .as-link {
        color: #333333;
        cursor: pointer;
        display: inline-block;
        font-size: 14px;
        width: 120px;
        &:not(:first-of-type) {
          margin-left: 20px;
        }
        span {
          color: #e69b24;
        }
      }
    }
    & > img {
      margin: 20px auto 0;
      display: block;
    }
  }
  .yt_content {
    padding: 30px;
  }
}
</style>
