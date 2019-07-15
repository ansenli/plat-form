<template>
  <div>
    <div class="t-detail">
      <el-table :data="list" :cell-style="{'text-align': 'center'}" :header-cell-style="{'text-align': 'center'}">
        <el-table-column property="amount" label="经验值明细"></el-table-column>
        <el-table-column property="type" label="经验值类型"></el-table-column>
        <el-table-column property="updateTime" label="日期">
          <template slot-scope="scope">
            {{scope.row.updateTime | dateFull}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[3,10, 20, 50]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
    <div class="regular">
      <div class="title">会员等级</div>
      <el-table
      :data="levelItems"
      :cell-style="{'text-align': 'center'}" :header-cell-style="{'text-align': 'center'}" style="width:800px;">
        <el-table-column
            prop="title"
            label="会员等级">
        </el-table-column>
        <el-table-column
            prop="desc"
            label="经验值">
        </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
export default {
  name: 'translate',
  components: {},
  data() {
    return {
      list: [],
      pageNo: 1,
      limit: 3,
      total: 0,
      levelItems: [
        { title: '大众会员', desc: '200以内经验值' },
        { title: '黄金会员', desc: '201~2000经验值' },
        { title: '铂金会员', desc: '2001~10000经验值' },
        { title: '钻石会员', desc: '10001以上经验值' }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取明细列表
    getList() {
      let data = {
        limit: this.limit,
        pageNo: this.pageNo
      };
      netAPI.translateList(data).then(res => {
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
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.t-detail /deep/ {
  text-align: center;
  padding: 40px 0 20px;
  background-color: white;
  margin-top: 20px;
  .el-table--small td {
    padding: 20px 0;
  }
  .el-pagination {
    margin-top: 30px;
  }
}

.regular {
  margin-top: 20px;
  padding: 40px;
  background-color: white;
  .title {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
</style>
