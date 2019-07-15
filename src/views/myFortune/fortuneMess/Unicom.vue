<template>
  <div class="u_box">
    <div>
      <span class="t_title">可兑换流量：<i>{{availableFlow}}M</i></span>
      <el-button size="large" type="primary" round @click="isRuleVisible=true">查看流量兑换规则</el-button>
    </div>
    <div class="tag">
      <div @click="exchange(item)" v-for="(item,index) in tags" :key="index">{{item}}M<br/><span>兑换</span></div>
    </div>
    <a href="https://m.10010.com/queen/yto-express/yuantong.html" target="_blank" class="link">下单成功签收，赠送流量可兑换联通圆卡进行使用，点击了解更多圆卡信息。</a>
    <div class="t_list">
      <el-table :data="list" :cell-style="{'text-align': 'center'}" :header-cell-style="{'text-align': 'center'}">
        <el-table-column property="amount" label="流量明细"></el-table-column>
        <el-table-column property="type" label="流量类型"></el-table-column>
        <el-table-column property="status" label="兑换状态"></el-table-column>
        <el-table-column property="updateTime" label="日期">
          <template slot-scope="scope">
            {{scope.row.updateTime | dateFull}}
          </template>
        </el-table-column>
      </el-table>
      <div class="t_page">
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
    <msg-dialog v-if="isRuleVisible" title="流量兑换活动规则" :visible.sync="isRuleVisible" width="600px" @close-msg="isRuleVisible=false">
        <ul>
          <li>圆卡用户每成功寄送一笔快递，即可享受30MB的流量奖励；每月最高可享受20笔流量赠送奖励。</li>
          <li>用户的流量账户通过绑定的圆卡手机号码识别。同一个用户如办理了一张小圆卡和一张圆卡，那么两张卡的流量不可共享。</li>
          <li>提交“流量兑换”申请后，系统会在24小时内充值到账。</li>
          <li>兑换成功后可登陆联通手机营业厅APP查询。</li>
          <li>每月第一天和最后一天（自然日）暂停兑换流量。</li>
          <li>每月可兑换10次流量，累积最高兑换1000M</li>
        </ul>
    </msg-dialog>
    <msg-dialog v-if="isShowSuccess" title="兑换成功" :visible.sync="isShowSuccess" width="500px" @close-msg="closeCallBack">
       <div class="suc_msg">发起兑换成功，预计24小时到账。具体流量到账时间，可咨询联通官方客服或关注“圆卡助手”微信公众号进行查询。</div>
    </msg-dialog>
    <msg-dialog v-if="isShowFail" title="兑换失败" :visible.sync="isShowFail" width="500px" @close-msg="closeCallBack">
       <div class="suc_msg">{{reason}}</div>
    </msg-dialog>
  </div>
</template>

<script>
import msgDialog from './msgDialog';
import netAPI from '@/api';
export default {
  components: { msgDialog },
  props: {},
  data() {
    return {
      tags: [100, 200, 300, 500],
      list: [],
      pageNo: 1,
      limit: 10,
      total: 0,
      isRuleVisible: false,
      availableFlow: 0, // 用户可用流量信息
      isShowSuccess: false,
      isShowFail: false,
      reason: ''
    };
  },
  created() {
    this.getList();
    this.getUnicomInfo();
  },
  methods: {
    // 获取明细列表
    getList() {
      let data = {
        limit: this.limit,
        pageNo: this.pageNo
      };
      netAPI.getUnicomList(data).then(res => {
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
    exchange(num) {
      netAPI.extractuserflow({ value: num }).then(res => {
        this.availableFlow = res && res.availFlow;
        if (res && res.status === 0) {
          this.isShowSuccess = true;
          this.isShowFail = false;
        } else {
          this.isShowFail = true;
          this.isShowSuccess = false;
          this.reason = res.reason;
        }
      }).catch((error) => {
        console.log('error=' + error);
        this.$message({
          type: 'fail',
          message: '网络异常,请稍后尝试！',
          duration: 1000
        });
      });
    },
    getUnicomInfo() {
      netAPI.getUnicomInfo().then(res => {
        this.availableFlow = res.availableFlow;
      }).catch(() => {
        this.availableFlow = 0;
      });
    },
    closeCallBack() {
      this.isShowSuccess = false;
      this.isShowFail = false;
      this.getList();
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.u_box {
  padding: 20px 80px;
  .t_title {
    color: #333;
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    margin-right: 15px;
    i {
      color: #47086c;
    }
  }
  .tag {
    margin-top: 40px;
    > div {
      display: inline-block;
      text-align: center;
      padding: 20px 60px;
      margin-right: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      vertical-align: middle;
      span {
        display: inline-block;
        color: #47086c;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
  .link {
    text-decoration: none;
    margin: 40px 0;
    display: inline-block;
  }
  ul {
    list-style-type: decimal;
    li {
      list-style-position: outside;
      margin-bottom: 10px;
      line-height: 1.5;
    }
  }
  .suc_msg {
    line-height: 2;
    padding: 10px;
  }
  .t_page {
    text-align: center;
    margin: 20px 0;
  }
}
</style>
