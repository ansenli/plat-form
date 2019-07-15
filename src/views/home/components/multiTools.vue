<template>
  <div class="yto-box">
    <el-row>
      <el-col :span="10">
        <el-col :span="8" style="text-align: center;">
          <a>
            <div class="link-block" @click="goDetail(2)">
              <img src="@/assets/images/online@2x.png"/>
              <div>在线客服</div>
            </div>
          </a>
        </el-col>
        <el-col :span="8" style="text-align: center;">
          <a>
            <div class="link-block"  @click="goDetail(1)">
              <img src="@/assets/images/wangdian@2x.png"/>
              <div>网点查询</div>
            </div>
          </a>
        </el-col>
        <el-col :span="8" style="text-align: center;">
          <a>
            <div class="link-block" @click="goDetail(3)">
              <img src="@/assets/images/calculation@2x.png"/>
              <div>运费查询</div>
            </div>
          </a>
        </el-col>
      </el-col>
      <el-col :span="14">
        <div style="display: flex;margin-left:20px;margin-top:8px;padding-left:20px;border-left:2px solid #ccc">
          <img style="width: 36px; height: 36px;margin-right: 20px;" src="@/assets/images/member@2x.png"/>
          <div class="link-block;">
            <div class="t_title" v-for="(item,index) in list" :key="index" @click="toDetail(item.id)">{{item.title}}</div>
          </div>
          <router-link to="newsList" class="like-btn">
            <div class="btnMore" v-if="total > 2">更多></div>
          </router-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import netAPI from '@/api';
import { trackEvent } from '@/utils/common';
export default {
  name: 'multiTools',
  props: {},
  data() {
    return {
      list: [],
      total: 0
    };
  },
  created() {
    let query = {
      pageNo: 1,
      limit: 2
    };
    netAPI.getNewsList(query).then(res => {
      this.list = res.items;
      this.total = res.total;
    });
  },
  methods: {
    //  1-网点查询,2-在线客服,3-运费查询
    goDetail(type) {
      switch (type) {
        case 1:
          window.open('http://www.yto.net.cn/express/service/querysupport/branchsearch.html', '_blank');
          trackEvent(['_trackEvent', '查询服务', '网点查询', '网点查询']);
          break;
        case 2:
          // if (location.host.indexOf('localhost') >= 0 || location.host.indexOf('test') >= 0) {
          //   window.open('http://online-test.yto.net.cn/', '', 'width=1066,height=818,top=150');
          // } else {
          //   window.open('http://online.yto.net.cn/', '', 'width=1066,height=818,top=150');
          // }
          window.open('http://online.yto.net.cn/', '', 'width=1066,height=818,top=150');
          trackEvent(['_trackEvent', '查询服务', '在线客服', '在线客服查询']);
          break;
        case 3:
          window.open('http://www.yto.net.cn/express/service/querysupport/standardPrice.html/', '_blank');
          trackEvent(['_trackEvent', '查询服务', '运费查询', '运费查询']);
          break;
      }
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
.yto-box {
  padding: 15px;
  border-radius: 8px;
  background-color: white;
  .link-block {
    display: inline-block;
    text-align: center;
    div {
      font-size: 14px;
      color: #333333;
    }
    img {
      width: 32px;
      height: 32px;
    }
  }
  .btnMore {
    position: absolute;
    right: 0;
    top: 20px;
    font-size: 14px;
    color: #999;
  }
  .t_title {
    font-size: 14px;
    color: #333;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 2px 0;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
