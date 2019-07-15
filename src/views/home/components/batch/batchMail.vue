<template>
  <div class="order-box">
    <el-table  :data="importPageData" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"  fixed></el-table-column>
      <el-table-column prop="senderName" label="寄件方姓名" width="170" fixed></el-table-column>
      <el-table-column prop="senderProvinceName" label="寄件方省份" fixed></el-table-column>
      <el-table-column prop="senderCityName" label="寄件方城市" fixed></el-table-column>
      <el-table-column prop="senderDistrictName" label="寄件方区县" fixed></el-table-column>
      <el-table-column prop="senderAddress" label="寄件方地址" fixed></el-table-column>
      <el-table-column prop="senderPhone" label="寄件方电话" fixed></el-table-column>

      <el-table-column prop="receiverName" label="收件方姓名" width="170" fixed></el-table-column>
      <el-table-column prop="receiverProvinceName" label="收件方省份" fixed></el-table-column>
      <el-table-column prop="receiverCityName" label="收件方城市" fixed></el-table-column>
      <el-table-column prop="receiverDistrictName" label="收件方区县" fixed></el-table-column>
      <el-table-column prop="receiverAddress" label="收件方地址" fixed></el-table-column>
      <el-table-column label="内件品名" fixed>
        <template slot-scope="scope">
          {{scope.row.orderProductResponseArrayList && scope.row.orderProductResponseArrayList.length>0  ? scope.row.orderProductResponseArrayList[0].name:''}}
        </template>
      </el-table-column>
      <el-table-column label="物品重量" fixed>
        <template slot-scope="scope">
          {{scope.row.orderProductResponseArrayList && scope.row.orderProductResponseArrayList.length>0  ? scope.row.orderProductResponseArrayList[0].weight:''}}
        </template>
      </el-table-column>
      <el-table-column label="保价金额" fixed>
        <template slot-scope="scope">
          {{scope.row.orderVasResponseList && scope.row.orderVasResponseList.length>0  ? scope.row.orderVasResponseList[0].amount:''}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" fixed></el-table-column>
      <el-table-column label="操作"  fixed="right" width="150">
        <template slot-scope="scope" v-if="scope.row.errorMessage && scope.row.errorMessage!=''" >
          <el-button class="btn-round" type="text" @click="editMail(scope.row)">编辑</el-button>
          <el-button class="btn-round" type="text" @click="deleteMail(scope.row)">删除</el-button>
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
        :total="total"
      ></el-pagination>
    </div>
    <edit-mail v-if="isVisible" :visible.sync="isVisible" :detail="detailData" @close="close"></edit-mail>
  </div>
</template>

<script>
import editMail from './editMail';
export default {
  name: 'batchMail',
  components: { editMail },
  props: ['importList'],
  computed: {
    // orderList: function() {
    //   return this.failList.concat(this.successList);
    // }
  },
  data() {
    return {
      importList2: [{ 'remark': '轻拿轻放', 'senderName': 'test1', 'senderPhone': '13123456781', 'senderProvinceCode': '010', 'senderProvinceName': '北京', 'senderCityCode': '110000', 'senderCityName': '北京市', 'senderDistrictCode': '110108', 'senderDistrictName': '海淀区', 'senderAddress': '东局子1111号', 'receiverName': '', 'receiverPhone': '13123456789', 'receiverProvinceCode': '021', 'receiverProvinceName': '上海', 'receiverCityCode': '310000', 'receiverCityName': '上海市', 'receiverDistrictCode': '310118', 'receiverDistrictName': '青浦区', 'receiverAddress': '上海青浦区华徐公路3029弄28号', 'orderVasResponseList': [{ 'code': 3, 'name': '保价', 'amount': 3000 }], 'orderProductResponseArrayList': [{ 'name': '文件' }], 'errorMessage': 'null收件方姓名不能为空，且不能超过50字符;    ' }, { 'remark': '轻拿轻放', 'senderName': 'test122', 'senderPhone': '021-53892392', 'senderProvinceCode': '010', 'senderProvinceName': '北京', 'senderCityCode': '110000', 'senderCityName': '北京市', 'senderDistrictCode': '110108', 'senderDistrictName': '海淀区', 'senderAddress': '东局子1112号', 'receiverName': '', 'receiverPhone': '13123456790', 'receiverProvinceCode': '021', 'receiverProvinceName': '上海', 'receiverCityCode': '310000', 'receiverCityName': '上海市', 'receiverDistrictCode': '310118', 'receiverDistrictName': '青浦区', 'receiverAddress': '上海青浦区华徐公路3029弄28号', 'orderVasResponseList': [{ 'code': 3, 'name': '保价', 'amount': 20000 }], 'orderProductResponseArrayList': [{ 'name': '服饰22', 'weight': '2' }], 'errorMessage': 'null收件方姓名不能为空，且不能超过50字符;    ' }, { 'remark': '轻拿轻放', 'senderName': 'tes33', 'senderPhone': '13123456781', 'senderProvinceCode': '010', 'senderProvinceName': '北京', 'senderCityCode': '110000', 'senderCityName': '北京市', 'senderDistrictCode': '110108', 'senderDistrictName': '海淀区', 'senderAddress': '东局子1111号', 'receiverName': '收件姓名1', 'receiverPhone': '021-8888888', 'receiverProvinceCode': '021', 'receiverProvinceName': '上海', 'receiverCityCode': '310000', 'receiverCityName': '上海市', 'receiverDistrictCode': '310118', 'receiverDistrictName': '青浦区', 'receiverAddress': '上海青浦区华徐公路3029弄28号', 'orderVasResponseList': [{ 'code': 3, 'name': '保价', 'amount': 3000 }], 'orderProductResponseArrayList': [{ 'name': '数码产品' }] }, { 'remark': '轻拿轻放', 'senderName': 'test555', 'senderPhone': '13123456791', 'senderProvinceCode': '010', 'senderProvinceName': '北京', 'senderCityCode': '110000', 'senderCityName': '北京市', 'senderDistrictCode': '110108', 'senderDistrictName': '海淀区', 'senderAddress': '东局子1112号', 'receiverName': '收件姓名2', 'receiverPhone': '13123456790', 'receiverProvinceCode': '021', 'receiverProvinceName': '上海', 'receiverCityCode': '310000', 'receiverCityName': '上海市', 'receiverDistrictCode': '310118', 'receiverDistrictName': '青浦区', 'receiverAddress': '上海青浦区华徐公路3029弄28号', 'orderVasResponseList': [{ 'code': 3, 'name': '保价', 'amount': 20000 }], 'orderProductResponseArrayList': [{ 'name': '数码产品' }] }],
      importPageData: [],
      detailData: '',
      isVisible: false,
      pageNo: 1,
      limit: 10,
      total: 0
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.errorMessage && row.errorMessage !== '') {
        return 'warning-row';
      }
      return '';
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
    // 获取列表
    getList() {
      this.importPageData = this.pagination();
    },
    // 分页
    pagination() {
      this.total = this.importList.length;
      let skipNum = (this.pageNo - 1) * this.limit;
      let data = (skipNum + this.limit >= this.importList.length) ? this.importList.slice(skipNum, this.importList.length) : this.importList.slice(skipNum, skipNum + this.limit);
      return data;
    },
    // 编辑
    editMail(item) {
      this.detailData = item;
      this.isVisible = true;
    },
    // 删除
    deleteMail(item) {
      let index = this.importList.findIndex((x) => {
        return x.id === item.id;
      });
      this.importList.splice(index, 1);
      this.getList();
    },
    close() {
      this.isVisible = false;
      this.detailData = '';
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.order-box /deep/ {
  .el-table .warning-row {
    background: #f8e3dc !important;
  }
  .el-table__body .warning-row.hover-row > td {
    background: #f8e3dc !important;
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
}
</style>
