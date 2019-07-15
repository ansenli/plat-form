<template>
  <div class="intagral-mall-container" v-loading="loading">
    <ticket v-for="(item, index) in list" :key="index" class="box" :title="'￥' + item.amount" subTitle="快递抵用券" :disabled="integral < item.amount*100">
      <span v-if="integral < item.amount*100" class="ticket-btn">积分不够</span>
      <span v-else class="ticket-btn" @click="exchange(item.amount)">立即兑换</span>
    </ticket>
  </div>
</template>

<script>
import netAPI from '@/api';
import Cookies from 'js-cookie';
import ticket from '@/views/myFortune/components/ticketBox';
export default {
  name: 'IntegralMall',
  components: { ticket },
  data() {
    return {
      list: [],
      pageNo: 1,
      limit: 10,
      total: 0,
      integral: 0,
      isLogin: Cookies.get('jwt-token'),
      loading: false
    };
  },
  created() {
    this.getUserMe();
    this.getList();
  },
  methods: {
    getUserMe() {
      netAPI.getUserIntegral().then(res => {
        this.integral = res.availIntegral;
      });
    },
    // 获取明细列表
    getList() {
      // this.integral = this.$route.params.integral;
      // console.log(this.$route.params.integral);
      netAPI.getCouponCollect().then(res => {
        this.list = res.items;
      });
    },
    // 兑换
    exchange(amount) {
      this.loading = true;
      let data = {
        value: amount
      };
      netAPI.exchangeCoupon(data).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: `成功兑换一张${amount}元抵用券`
          });
        }
      }).finally(() => {
        this.integral = this.integral - amount * 100;
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.intagral-mall-container {
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  margin-top: 20px;
  padding: 40px 40px 0;
  .box {
    display: inline-block;
  }
  .ticket-btn {
    display: inline-block;
    text-align: center;
    line-height: 28px;
    width: 100px;
    height: 28px;
    color: white;
    font-size: 16px;
    border: 1px solid white;
    cursor: pointer;
  }
}
</style>
