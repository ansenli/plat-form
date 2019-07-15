<template>
  <div class="lp-box">
    <el-row>
      <el-form ref="form" :model="form" :inline="true">
        <el-form-item label="下单时间" prop="startTime">
          <el-date-picker
              v-model="form.startTime"
              type="date"
              :picker-options="pickerOptions"
              @change="changeSTime"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>-</el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker
              v-model="form.endTime"
              type="date"
              @change="changeETime"
              :picker-options="pickerOptions"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态" prop="status" style="margin-left:40px;">
          <el-select v-model="form.status" clearable placeholder="请选择">
            <el-option label="全部" value="ALL"></el-option>
            <el-option label="待接单" value="WAIT"></el-option>
            <el-option label="已接单" value="ACCEPT"></el-option>
            <el-option label="运输中" value="GOT"></el-option>
            <el-option label="派件中" value="SENT_SCAN"></el-option>
            <el-option label="已签收" value="SIGNED"></el-option>
            <el-option label="已取消" value="CANCEL"></el-option>
            <!-- <el-option label="揽收失败" value="NOT_SEND"></el-option>
            <el-option label="签收失败" value="FAILED"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="btn16">
            <el-button @click="getList(0)" type="primary" :disabled="loading">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :v-loading="loading" :data="list" :cell-style="{'text-align': 'center'}" :header-cell-style="{'text-align': 'center'}">
      <el-table-column
          type="index"
          label="序号"
          width="50">
      </el-table-column>
      <el-table-column
          prop="orderNo"
          label="订单号"
          width="190">
      </el-table-column>
      <el-table-column
          prop="mailNo"
          label="运单号"
          width="180">
      </el-table-column>
      <el-table-column
          prop="senderName"
          label="寄件人姓名">
      </el-table-column>
      <el-table-column
          prop="receiverName"
          label="收件人姓名">
      </el-table-column>
      <el-table-column
          prop="receiverAddress"
          label="收件人地址">
      </el-table-column>
      <el-table-column
          prop="orderCreateTime"
          label="下单时间"
          width="170px">
        <template slot-scope="scope">
          {{scope.row.orderCreateTime | dateFull}}
        </template>
      </el-table-column>
      <el-table-column
          prop="status"
          label="订单状态">
        <template slot-scope="scope">
          {{scope.row.status | orderStatus}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-round" type="text" @click="urgeOrder(scope.row.orderId, scope.row.content)">继续催件</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <urge-order v-if="isCreateUrge" :urgeId="urgeId" :urgeContent="urgeContent" :visible.sync="urgeVisible" @submit="getList"></urge-order>
  </div>
</template>

<script>
import netAPI from '@/api';
import urgeOrder from './urgeOrder';
export default {
  components: { urgeOrder },
  name: 'MyReminders',
  data() {
    return {
      isCreateUrge: false,
      urgeVisible: false,
      urgeId: '',
      urgeContent: '',
      loading: false,
      list: [],
      form: {
        status: '',
        startTime: null,
        endTime: null
      },
      pickerOptions: {
        disabledDate(time) {
          let dd = new Date(Date.now());
          dd.setMonth(dd.getMonth() - 6);
          return time.getTime() < dd.getTime() || time.getTime() > Date.now();
        }
      },
      pageNo: 1,
      limit: 10,
      total: 0
    };
  },
  watch: {
  },
  created() {
    this.getList();
  },
  methods: {
    // 改变时间
    changeETime(val) {
      if (!this.form.startTime) {
        this.$message({
          type: 'warning',
          message: '请先选择起始时间'
        });
        this.form.endTime = null;
      } else if (this.form.startTime > val) {
        this.$message({
          type: 'warning',
          message: '不能小于起始时间'
        });
        this.form.endTime = null;
      }
    },
    changeSTime(val) {
      if (this.form.endTime && val > this.form.endTime) {
        this.$message({
          type: 'warning',
          message: '不能大于起始时间'
        });
        this.form.endTime = null;
      }
    },
    // limit改变
    handleSizeChange(val) {
      this.limit = val;
      this.pageNo = 1;
      this.getList();
    },
    // pageNo改变
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList();
    },
    // 催件
    urgeOrder(id, content) {
      this.urgeId = id;
      this.urgeContent = content;
      this.isCreateUrge = true;
      this.urgeVisible = true;
    },
    // 重置查询列表
    reset() {
      this.$refs['form'].resetFields();
    },
    // 获取列表
    getList(type = 1) {
      this.loading = true;
      if (type === 0) {
        this.pageNo = 1;
      }
      let query = {
        pageNo: this.pageNo,
        limit: this.limit
      };
      if (this.form.startTime && this.form.endTime) {
        query.startTime = this.form.startTime;
        query.endTime = this.form.endTime;
      } else if (this.form.startTime) {
        this.form.endTime = this.form.startTime;
        query.startTime = this.form.startTime;
        query.endTime = this.form.endTime;
      }
      if (this.form.status && this.form.status !== 'ALL') {
        query['status'] = this.form['status'];
      }
      netAPI.urgeList(query).then(res => {
        this.total = Number(res.total);
        this.list = res.items;
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.myorder-container {
  margin: 20px 0;
  background-color: #ffffff;

  .btn-round {
    color: #47086c;
    padding: 5px 10px;
    border: 1px solid #47086c;
    border-radius: 28px;
    font-size: 14px;
    span {
      color: #47086c;
    }
  }
}
.lp-box {
  padding: 40px;
  .el-date-editor.el-input {
    width: 146px;
  }
}
</style>
