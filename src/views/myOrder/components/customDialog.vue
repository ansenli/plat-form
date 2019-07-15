<template>
  <div>
    <div class="mask-container" v-show="visible" @click="dialogVisible = false;"></div>
    <transition name="slide-fade">
      <div class="custom-dialog" v-show="visible">
        <slot name="header">
          <div class="header">{{title}}<i class="el-icon-close" @click="onClose"></i></div>
        </slot>
        <slot name="body"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['visible', 'title'],
  data() {
    return {
      dialogVisible: this.visible
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  created() {
  },
  methods: {
    onClose() {
      this.dialogVisible = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.mask-container {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1999;
  width: 650px;
  height: 100vh;
}
.custom-dialog /deep/ {
  z-index: 2000;
  padding: 20px;
  top: 8vh;
  position: fixed;
  right: 0;
  width: 680px;
  margin: 0 auto 50px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  .header {
    margin-left: 20px;
    color: #000;
    font-size: 16px;
    i {
      float: right;
      cursor: pointer;
    }
  }
}
</style>
