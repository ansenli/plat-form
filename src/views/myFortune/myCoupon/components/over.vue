<template>
  <div class="intagral-mall-container">
    <ticket v-for="(item, index) in list" :key="index" class="box disabled" :title="'￥' + item.couponValue" subTitle="快递抵用券" disabled>
      <span class="disabled">已过期</span>
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
  .disabled {
    color: white;
    font-size: 18px;
  }
}
</style>
