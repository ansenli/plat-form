<template>
  <div>
    <div class="ticket-box" :class="{disabled: disabled}">
      <div class="left-box">
        <div class="title">{{title}}</div>
        <div class="sub-title">{{subTitle}}</div>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    subTitle: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.ticket-box {
  margin-bottom: 40px;
  margin-right: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  padding: 20px;
  width: 380px;
  height: 80px;
  border-radius: 8px;
  background: linear-gradient(to left, #AE80FF, #E71ADF);
  &.disabled {
    background: linear-gradient(to left, #A7A7A7, #D5D5D5);
  }
  .left-box {
    text-align: center;
    .title {
      color: #ffffff;
      font-size: 50px;
    }
    .sub-title {
      color: #ffffff;
      font-size: 30px;
    }
  }
}
</style>
