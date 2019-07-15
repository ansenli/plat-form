<template>
  <div class="mess-box">
    <div class="header"><img :src="imgSrc">{{title}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['title', 'icon'],
  computed: {
    imgSrc() {
      return require('@/assets/images/' + this.icon);
    }
  },
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.mess-box {
  background-color: white;
  margin-bottom: 20px;
  &:first-of-type {
    margin-top: 20px;
  }
  .header {
    color: #333333;
    padding: 20px;
    font-size: 16px;
    border-bottom: 2px solid #F7F7F7;
    img {
      width: 16px;
      height: 14px;
      margin-right: 10px;
    }
  }
}
</style>
