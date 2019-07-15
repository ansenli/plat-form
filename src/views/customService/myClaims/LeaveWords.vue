<template>
  <el-scrollbar wrap-class="yto-x-hidden" style="height: 200px;">
    <div class="mess">
      <div class="row-one">
          <span>会员姓名*****</span>
          <span>会员手机号*****</span>
          <span>2018-09-09 09:20</span>
      </div>
      <div class="row-two">内容回复内容回复内容回复内容回复内容回复内容回复</div>
    </div>
    <div class="mess">
      <div class="row-one">
        <span>会员姓名*****</span>
        <span>会员手机号*****</span>
        <span>2018-09-09 09:20</span>
      </div>
      <div class="row-two">内容回复内容回复内容回复内容回复内容回复内容回复</div>
    </div>
    <div class="mess">
      <div class="row-one">
        <span>会员姓名*****</span>
        <span>会员手机号*****</span>
        <span>2018-09-09 09:20</span>
      </div>
      <div class="row-two">内容回复内容回复内容回复内容回复内容回复内容回复</div>
    </div>
    <div class="mess">
      <div class="row-one">
        <span>会员姓名*****</span>
        <span>会员手机号*****</span>
        <span>2018-09-09 09:20</span>
      </div>
      <div class="row-two">内容回复内容回复内容回复内容回复内容回复内容回复</div>
    </div>
    <div class="mess">
      <div class="row-one">
        <span>会员姓名*****</span>
        <span>会员手机号*****</span>
        <span>2018-09-09 09:20</span>
      </div>
      <div class="row-two">内容回复内容回复内容回复内容回复内容回复内容回复</div>
    </div>
    <div class="mess">
      <div class="row-one">
        <span>会员姓名*****</span>
        <span>会员手机号*****</span>
        <span>2018-09-09 09:20</span>
      </div>
      <div class="row-two">内容回复内容回复内容回复内容回复内容回复内容回复</div>
    </div>
    <div class="mess">
      <div class="row-one">
        <span>会员姓名*****</span>
        <span>会员手机号*****</span>
        <span>2018-09-09 09:20</span>
      </div>
      <div class="row-two">内容回复内容回复内容回复内容回复内容回复内容回复</div>
    </div>
    <div class="mess">
      <div class="row-one">
        <span>会员姓名*****</span>
        <span>会员手机号*****</span>
        <span>2018-09-09 09:20</span>
      </div>
      <div class="row-two">内容回复内容回复内容回复内容回复内容回复内容回复</div>
    </div>
  </el-scrollbar>
</template>

<script>
export default {
  components: {},
  data() {
    return {
    };
  },
  watch: {
  },
  created() {
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.mess {
  &:not(:last-child) {
    margin-bottom: 20px;
  }
  .row-one {
    color: #333333;
    font-size: 14px;
    margin-bottom: 10px;
    span {
      &:not(:last-of-type) {
        margin-right: 40px;
      }
    }
  }
  .row-two {
    color: #999999;
    font-size: 14px;
  }
}
</style>
