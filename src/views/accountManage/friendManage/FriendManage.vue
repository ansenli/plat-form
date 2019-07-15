<template>
  <div class="friend-page">
    <img src="@//assets/images/banner@2x.png">
    <div class="text-container">
      <div class="mess">用户名：<span>18751985521</span>已邀请<span style="color: #E69B24;">{{count}}</span>位好友</div>
      <img class="share-btn" @click="share" src="@/assets/images/bu@2x.png">
      <div class="line-title">活动规则</div>
      <div class="rules">
        <div>1. 成功邀请1名好友成功注册会员，即可获得500积分，另加20经验值；</div>
        <div>2. 积分，经验值由系统后台发放至您的会员账户，请在圆通会员‘积分明细，经验值明细’中查看；</div>
        <div>3. 积分使用权益：积分可兑换快递抵用券，积分抽奖使用；</div>
        <div>4. 本次活动的最终解释权归圆通速递有限公司所有。</div>
      </div>
      <div class="line-title">我的分享</div>
    </div>
    <el-dialog
        class="qrcode-dialog"
        title=""
        width="340px"
        :visible.sync="dialogVisible">
      <div id="qrcode" class="link-qrcode"></div>
    </el-dialog>
  </div>
</template>

<script>
import netAPI from '@/api';
import qrcode from 'qrcode';
export default {
  name: 'FriendManage',
  components: {},
  computed: {
  },
  data() {
    return {
      dialogVisible: false,
      count: 0,
      link: '',
      show: false
    };
  },
  created() {
    netAPI.getFriendCount().then(res => {
      this.count = res.length;
    });
  },
  methods: {
    share() {
      netAPI.getInviteLink().then(res => {
        this.link = res;
        qrcode.toCanvas(res, {
          errorCorrectionLevel: 'H',
          height: 300,
          width: 300,
          colorDark: '#000000',
          colorLight: '#ffffff'
        }, (wrong, canvas) => {
          this.dialogVisible = true;
          this.$nextTick(() => {
            let dom = document.getElementById('qrcode');
            dom.innerHTML = '';
            dom.appendChild(canvas);
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.friend-page {
  position: relative;
  .link-qrcode {
  }
  .qrcode-dialog /deep/ {
    .el-dialog {
      .el-dialog__header {
        border: none;
      }
    }
  }
  & > img {
    width: 100%;
  }
  .text-container {
    text-align: center;
    width: 426pt;
    position: absolute;
    left: calc(50% - 213pt);
    bottom: 30pt;
    & > img.share-btn {
      cursor: pointer;
      margin-bottom: 25pt;
      width: 164pt;
      height: 40pt;
    }
    .mess {
      margin-bottom: 20pt;
      color: #914BF3;
      font-size: 12pt;
      font-weight: bold;
      font-family: "Microsoft YaHei";
    }
    .rules {
      text-align: left;
      margin-top: 20pt;
      margin-bottom: 20pt;
      font-size: 9pt;
      color: #ffffff;
      font-family: "Microsoft YaHei";
      font-weight: bold;
      div:not(:last-child) {
        margin-bottom: 10pt;
      }
    }
  }
}
</style>
