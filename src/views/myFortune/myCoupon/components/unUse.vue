<template>
  <div class="intagral-mall-container">
    <ticket v-for="(item, index) in list" :key="index" class="box" :title="'￥' + item.couponValue" subTitle="快递抵用券">
      <span class="ticket-btn" @click="use(item.id)">立即使用</span>
    </ticket>
  </div>
</template>

<script>
import ticket from '@/views/myFortune/components/ticketBox';
export default {
  components: {ticket},
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    use(val) {
      console.log(val);
      // this.$alert('使用功能还未开发');
      this.$router.push({name: 'Home', params: {id: val}});
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.intagral-mall-container {
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  margin-left:15px;
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
