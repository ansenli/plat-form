<template>
  <div class="message_box">
    <el-collapse>
      <el-collapse-item v-for="(item, index) in items" :key="index">
        <template slot="title">
          <el-checkbox @change="markAsRead(item.id)" v-model="item.status" :disabled="item.status"></el-checkbox><span>【{{item.business === 1 ? '活动消息' : '包裹消息'}}】{{item.title}}</span><span style="position:absolute;top:2px;right:30px;">{{item.createTime | dateFull}}</span>
        </template>
        <div>{{item.content}}</div>
      </el-collapse-item>
    </el-collapse>
    <div class="footer-tool">
      <div style="display:inline-block;">
        <el-checkbox @change="allRead" v-model="allCheck" :disabled="isAllCheck">全部标为已读</el-checkbox>
      </div>
      <el-pagination
          style="float: right;"
          @current-change="pageChange"
          layout="prev, pager, next"
          :pager-count="5"
          :current-page="page"
          :page-size="limit"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
export default {
  components: {},
  computed: {
    isAllCheck() {
      return this.items.every(item => {
        return item.status;
      });
    }
  },
  props: {
    activeName: {
      default: ''
    }
  },
  data() {
    return {
      allCheck: false,
      businessType: {
        all: '',
        package: 2,
        activity: 1
      },
      items: [],
      total: 0,
      page: 1,
      limit: 10
    };
  },
  created() {
    this.getItems();
  },
  methods: {
    async allRead() {
      for (let i = 0, l = this.items.length; i < l; i++) {
        await netAPI.updateUserMessages(this.items[i].id);
      }
      this.getItems();
    },
    // 标记为已读
    markAsRead(id) {
      netAPI.updateUserMessages(id);
    },
    // 获取活动信息列表
    getItems() {
      netAPI.getUserMessages({
        business: this.businessType[this.activeName],
        limit: this.limit,
        pageNo: this.page
      }).then(res => {
        this.items = res.items;
        this.total = Number(res.total);
      });
    },
    // 改变页码
    pageChange(val) {
      this.page = val;
      this.getItems();
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.message_box /deep/ {
  .el-collapse-item__header {
    font-size: 14px;
    color: #333;
    height: 56px;
    line-height: 56px;
    border-bottom: 0;
    position: relative;
  }
  .el-collapse-item__wrap {
    border-bottom: 0;
  }
  .el-collapse-item {
    border-bottom: 1px dashed rgba(204, 204, 204, 1);
  }
  .el-collapse {
    border-top: 0;
  }
  .el-collapse-item__content {
    color: #666;
    font-size: 14px;
    padding: 0 30px 20px;
  }
  .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
  .el-checkbox {
    margin-right: 10px;
  }
}

.footer-tool {
  width: 100%;
  margin-top: 20px;
}
</style>
