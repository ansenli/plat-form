<template>
  <div class="fortune-mess-container">
    <div class="mess-detail">
      <el-table :data="list" :cell-style="{'text-align': 'center'}" :header-cell-style="{'text-align': 'center'}">
        <el-table-column property="point" label="积分明细"></el-table-column>
        <el-table-column property="remark" label="积分类型"></el-table-column>
        <el-table-column property="createTime" label="日期">
          <template slot-scope="scope">
            {{scope.row.createTime | dateFull}}
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
      <h2>积分奖励规则：</h2>
      <h3>一、积分奖励规则</h3>
      <p>1.注册积分：新用户注册赠送100积分，完善资料赠送20积分；</p>
      <p>2.寄件积分：选择业务员上门取件，成功寄件，赠送发件人15积分/票（同省）、20积分/票（跨省）、除特殊时效产品；</p>
      <p>3.物流评价积分：赠送评价方20积分/票</p>
      <p>4.签到：按照签到天数赠送积分，连续签到7天，每日递增1积分值，第8天恢复到第1天赠送的积分值开始初始循环【圆卡用户按照双倍积分赠送】。</p>
      <h3>二、积分有效期</h3>
      <p>1.积分有效期（按每次积分获取时间推算，时间按自然年推，每年1月1号清理过期积分）三年，超期未兑换，系统自动清零。</p>
      <p>2.积分的使用顺序按照积分获取时间由远及近，直至客户使用完所有可用积分。积分使用到期30天前提醒用户消费积分，过期后积分清零。（根据过期失效积分后计算3年内有效积分）</p>
      <h3>三、会员专享</h3>
      <p>1、积分奖励</p>
      <p>2、经验值奖励</p>
      <p>3、会员日福利</p>
      <p>4、更多会员福利活动，请继续关注，我们会保持更新。</p>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
export default {
  name: 'IntegralDetail',
  components: {},
  data() {
    return {
      list: [],
      pageNo: 1,
      limit: 3,
      total: 0
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
      netAPI.integralDetailList(data).then(res => {
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
.mess-detail /deep/ {
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
  & > h2,
  h3,
  p {
    margin: 0 0 20px 0;
    color: #333333;
  }
  & > h2 {
    font-size: 16px;
  }
  & > h3 {
    font-size: 14px;
    font-weight: normal;
  }
  & > p {
    font-size: 14px;
    font-weight: normal;
    color: #666666;
  }
  .font-red {
    color: #eb0000;
  }
}
</style>
