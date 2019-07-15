<template>
  <div class="timeline">
    <ul v-if="orderData.length > 0">
      <li class="timeline-item-first">
        <div class="timeline-item-time">
          <h3>08-20</h3>
          <p>10:00</p>
        </div>
        <div class="timeline-item-color">
          <i class="circle-icon"></i>
        </div>
        <div class="timeline-item-tail"></div>
        <div class="timeline-item-content">
          <h3>已签收</h3>
          <p>上海市青浦区华新镇公司 已签收 签收人：门卫</p>
        </div>
      </li>
      <li class="timeline-item-first">
        <div class="timeline-item-time">
          <h3>08-20</h3>
          <p>10:00</p>
        </div>
        <div class="timeline-item-color">
          <i class="circle-icon"></i>
        </div>
        <div class="timeline-item-tail"></div>
        <div class="timeline-item-content">
          <h3>已签收</h3>
          <p>上海市青浦区华新镇公司 已签收 签收人：门卫</p>
        </div>
      </li>
    </ul>
    <el-alert title="暂无走件流程" type="info" :closable="false" show-icon v-else>
    </el-alert>
  </div>
</template>

<script>
import netAPI from '@/api';
export default {
  name: 'orderInfo',
  props: {
    color: String,
    isShowIcon: {
      type: Boolean,
      default: true
    },
    order: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      orderData: []
    };
  },
  watch: {
    order(val) {
      if (val) {
        this.getOrderInfo(val);
      }
    }
  },
  mounted() {
    this.getOrderInfo(this.order);
  },
  methods: {
    async getOrderInfo(order) {
      this.orderData = await netAPI.getOrderInfo(order);
      this.orderData = [0, 1];
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables";
.timeline {
  li {
    list-style: none;
    position: relative;
    overflow: hidden;
    padding-bottom: 20px;
    &:first-child {
      .timeline-item-tail {
        top: 2px;
      }
      .timeline-item-color {
        border-color: $purple;
      }
      .circle-icon {
        background-color: $purple;
      }
      .timeline-item-content {
        h3 {
          color: $purple;
        }
      }
      .timeline-item-time {
        h3 {
          color: #333;
        }
      }
    }
  }
}
.timeline-item-color {
  border: 2px solid #dcdfe6;
  left: 60px;
  top: 2px;
  position: absolute;
  content: "";
  z-index: 99;
  border-radius: 99px;
}
.timeline-item-tail {
  position: absolute;
  content: "";
  height: 100%;
  width: 2px;
  left: 68px;
  top: 0;
  background-color: #dcdfe6;
}
.circle-icon {
  width: 10px;
  height: 10px;
  background-color: #dcdfe6;
  display: block;
  border-radius: 99px;
  border: 2px solid #fff;
}
.timeline-item-time {
  width: 50px;
  float: left;
  h3 {
    margin: 0;
    padding: 0;
    text-align: right;
    font-weight: lighter;
    color: #a2a5ac;
  }
  p {
    margin: 0;
    text-align: right;
    color: #a2a5ac;
  }
}
.timeline-item-content {
  float: left;
  margin-left: 40px;
  h3 {
    margin: 0;
    padding: 0;
    font-weight: 500;
    color: #a2a5ac;
  }
  p {
    margin-top: 5px;
    text-align: right;
    color: #a2a5ac;
  }
}
</style>
