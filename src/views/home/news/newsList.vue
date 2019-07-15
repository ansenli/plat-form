<template>
  <div class="yt-box">
    <div class="nav"><a href="/home">首页</a> > 活动列表</div>
    <div class="n_list">
        <div class="item" v-for="(item,index) in list" :key="index" @click="toDetail(item.id)">
          <img src="@/assets/images/nwe@2x.png" class="img_tag" v-if="item.firstOne">
          <span>{{item.title}}</span>
          <span class="date">{{item.createTime | dateFull}}</span>
        </div>
      <div class="page-box">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[10, 20, 50]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
export default {
  name: 'newsList',
  props: {},
  components: {},
  data() {
    return {
      list: [],
      pageNo: 1,
      limit: 10,
      total: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let data = {
        limit: this.limit,
        pageNo: this.pageNo
      };
      netAPI.getNewsList(data).then(res => {
        this.list = res.items;
        this.total = parseInt(res.total);
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.pageNo = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList();
    },
    toDetail(id) {
      this.$router.push({
        name: 'newsDetail',
        params: { id: id }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.n_list {
  padding: 28px 36px;
  background: #fff;
  width: 1400px;
}
.item {
  background: #f2f2f2;
  font-size: 16px;
  color: #333;
  margin-bottom: 14px;
  overflow: hidden;
  height: 60px;
  line-height: 60px;
  border-radius: 10px;
  padding: 0 48px;
  box-sizing: border-box;
  position: relative;
  &:hover {
    cursor: pointer;
  }
  span {
    display: inline-block;
  }
  .date {
    float: right;
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
.img_tag {
  position: absolute;
  left: 0;
  top: -5px;
}
</style>
