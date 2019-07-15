<template>
  <div>
    <el-dialog :title="title" :visible.sync="isShow" :width="width" @close="close">
      <slot></slot>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'msgDialog',
  props: ['visible', 'title', 'width'],
  watch: {
    visible(val) {
      this.isShow = val;
    },
    isShow(val) {
      this.$emit('update:visible', val);
    }
  },
  data() {
    return {
      isShow: this.visible
    };
  },
  methods: {
    close() {
      this.isShow = false;
      this.$emit('close-msg');
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss"  scoped>
</style>
