<template>
  <div>
    <el-row>
      <el-form :model="form" :inline="true" >
        <el-form-item label="">
          <el-input :maxlength="30" v-model="form.content" style="width: 420px;" placeholder="请输入内容" class="input-with-select" clearable>
            <el-select style="width: 120px;" v-model="form.select" slot="prepend" placeholder="请选择">
              <el-option label="运单号" value="mailNo"></el-option>
              <el-option label="订单号" value="orderNo"></el-option>
              <el-option label="寄件人" value="senderName"></el-option>
              <el-option label="收件人" value="receiverName"></el-option>
              <el-option label="寄件人手机" value="senderPhone"></el-option>
              <el-option label="收件人手机" value="receiverPhone"></el-option>
            </el-select>
          </el-input>
          <!--<el-input style="width: 320px;" placeholder="请输入运单号查询"></el-input>-->
        </el-form-item>
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
        <el-form-item>
         <div class="btn16">
           <el-button @click="search(0)" type="primary">查询</el-button>
           <!-- <el-button @click="exportTable" type="primary">导出</el-button> -->
         </div>
        </el-form-item>
      </el-form>
    </el-row>
    <div ref="sendTable">
    <el-table :data="data" v-loading="isLoad" :cell-style="{'text-align': 'center'}" :header-cell-style="{'text-align': 'center'}" >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" width="190px">
        <template slot-scope="scope">
          <span class="as-link" @click="detail(scope.row.id)">{{scope.row.orderNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mailNo" label="运单号" width="190px">
        <template slot-scope="scope">
          <span class="as-link" @click="detail(scope.row.id)">{{scope.row.mailNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="寄件人/收件人" width="300px">
        <template slot-scope="scope">
          <div style="text-align: center;">
            <span style="color:#000;margin-right:5px;">{{scope.row.senderCityName | longNameShow}}</span>
            <span>{{scope.row.senderName | longNameShow}}</span>
            <img style="height: 4px; margin-top: -4px;" src="@/assets/images/send@2x.png"/>
            <span style="color:#000;margin-right:5px;">{{scope.row.receiverCityName | longNameShow}}</span>
            <span>{{scope.row.receiverName | longNameShow}}</span>
          </div>
          <div style="text-align: center;">
            {{scope.row.status | orderStatus}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="下单时间">
        <template slot-scope="scope">
          {{scope.row.createTime | dateFull}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="text-align:left;">
            <el-button class="btn-round" v-if="scope.row.status === 'WAIT'"  @click="cancelOrder(scope.row.id,scope.row.couponsMoney)">取消订单</el-button>
            <el-button class="btn-round" v-if="scope.row.status !== 'SIGNED' && scope.row.status !== 'CANCEL'"  @click="urgeOrder(scope.row.id)">催件</el-button>
            <el-button class="btn-round" v-if="scope.row.mailNo"  @click="complainOrder(scope.row)">投诉</el-button>
            <el-button class="btn-round" v-if="scope.row.status === 'SIGNED' || scope.row.status === 'SENT_SCAN' || scope.row.status === 'GOT'" @click="evalOrder(scope.row)">评价</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
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
</template>

<script>
export default {
  props: {
    isLoad: false,
    data: {
      default: {}
    },
    total: 0
  },
  components: {},
  data() {
    return {
      form: {
        select: 'mailNo',
        content: '',
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
      limit: 10
    };
  },
  filters: {
    longNameShow(val) {
      if (val.length > 5) {
        return val.substring(0, 5) + '...';
      }
      return val;
    }
  },
  created() {
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
    // 评价
    evalOrder(row) {
      let data = JSON.parse(JSON.stringify(row));
      // this.$router.push({ path: '/evaluate', query: { data: row, type: 'send' }});
      this.$router.push({ path: '/evaluate', query: { orderId: data.id, status: data.status, mailNo: data.mailNo, type: 'send' } });
    },
    // 投诉
    complainOrder(row) {
      this.$emit('complain', row);
    },
    // 催件
    urgeOrder(id) {
      this.$emit('urge', id);
    },
    // 取消订单
    cancelOrder(id, money) {
      this.$emit('cancel', id, money);
    },
    // 详情
    detail(id) {
      this.$emit('detail', id);
    },
    // limit改变
    handleSizeChange(val) {
      this.limit = val;
      this.pageNo = 1;
      this.search();
    },
    // pageNo改变
    handleCurrentChange(val) {
      this.pageNo = val;
      this.search();
    },
    // 查询
    search(type = 1) {
      // 点击查询，页面初始化为第一页
      if (type === 0) {
        this.pageNo = 1;
      }
      let query = {
        pageNo: this.pageNo,
        limit: this.limit
      };
      if (this.form.content) {
        query[this.form.select] = this.form.content;
      }
      if (this.form.startTime && this.form.endTime) {
        query.startTime = this.form.startTime;
        query.endTime = this.form.endTime;
      } else if (this.form.startTime) {
        this.form.endTime = this.form.startTime;
        query.startTime = this.form.startTime;
        query.endTime = this.form.endTime;
      }
      this.$emit('search', query);
    },
    // 导出
    exportTable() {
      this.$emit('exportTable', 1);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.as-link {
  cursor: pointer;
  color: #47086c;
}
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
</style>
