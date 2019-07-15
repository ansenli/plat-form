<template>
  <div class="yt-box">
    <div class="nav"><a href="/home">首页</a> > 活动详情</div>
    <div class="detail">
      <div class="title">{{detail.title}}</div>
      <div class="date" v-if="detail.updateTime">{{detail.updateTime | dateFull}}</div>
      <div class="content" v-html="detail.content"></div>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
export default {
  name: 'newsDetail',
  props: {},
  components: {},
  data() {
    return {
      detail: {}
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      let data = {
        id: this.$route.params.id
      };
      netAPI.getNewsDetail(data).then(res => {
        this.detail = res;
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.detail {
  padding: 30px 40px;
  color: #333;
  font-size: 14px;
  background: #fff;
  .title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
  .date {
    padding-bottom: 20px;
    padding-top: 20px;
    text-align: center;
    border-bottom: 1px solid #d4d4d4;
  }
  .content {
    padding: 30px 40px 30px 24px;
    text-indent: 2em;
  }
}
.nav {
  font-size: 14px;
  color: #999;
  padding: 20px;
}
a {
  text-decoration: none;
  color: #999;
}
</style>
