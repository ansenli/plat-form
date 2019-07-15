<template>
  <div class="">
    <el-row>
      <el-button type="primary" @click="addOne" class="btn_add">新增</el-button>
      <el-table :data="items" @row-click="selectOne">
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="手机">
          <template slot-scope="scope">
            {{scope.row.encryptionUserPhone || scope.row.userPhone}}
          </template>
        </el-table-column>
        <el-table-column label="详细地址">
          <template slot-scope="scope">
            {{scope.row.prov + (scope.row.city || '') + (scope.row.district || '') + scope.row.address}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="地址类型">
          <template slot-scope="scope">
            <label v-if="scope.row.addressType === '1'">
              寄件地址
            </label>
            <label v-if="scope.row.addressType === '2'">
              收件地址
            </label>
          </template>
        </el-table-column> -->

        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
            <el-button class="btn-round" @click.stop="modifyItem(scope.row.id)" type="text" size="small">修改</el-button>
            <el-button class="btn-round" @click.stop="deleteItem(scope.row.id)" type="text" size="small">删除</el-button>
            <!-- <el-button class="btn-round" v-if="!scope.row.isDefault" @click.stop="setDefault(scope.row.id)" type="text" size="small">设为默认</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
            v-if="!showInDialog"
            key="pagination1"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 50]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-pagination
            v-else
            key="pagination2"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager-count="5"
            :current-page.sync="page"
            :page-sizes="[10, 20, 50]"
            :page-size="limit"
            layout="sizes, prev, pager, next"
            :total="total">
        </el-pagination>
      </div>
    </el-row>
    <address-info-dialog  @refresh-list="getList" :editId="editId" :visible.sync="infoDialogIsShow" :type="attrType"></address-info-dialog>
  </div>
</template>

<script>
import netAPI from '@/api';
import addressInfoDialog from './AddressInfoDialog';
import { trackEvent } from '@/utils/common';
export default {
  name: 'AddressManage',
  props: {
    showInDialog: false,
    type: ''
  },
  components: { addressInfoDialog },
  computed: {
  },
  data() {
    return {
      items: [],
      infoDialogIsShow: false,
      editId: '',
      page: 1,
      limit: 10,
      total: 0,
      attrType: this.type
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 选中某条
    selectOne(row) {
      if (this.showInDialog) {
        let data = JSON.parse(JSON.stringify(row));
        this.$emit('select', data);
      }
    },
    // 设为默认
    setDefault(id) {
      netAPI.getAddressById(id).then(res => {
        res.defaultAddress = true;
        return netAPI.updateAddress(res);
      }).then(res => {
        this.getList();
      });
    },
    // 点击修改
    modifyItem(id) {
      trackEvent(['_trackEvent', '地址簿', '修改', '修改地址簿', id]);
      this.editId = id;
      this.infoDialogIsShow = true;
    },
    // 点击删除
    deleteItem(id) {
      trackEvent(['_trackEvent', '地址簿', '删除', '删除地址簿', id]);
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if (action === 'confirm') {
            netAPI.deleteAddress(id).then(res => {
              this.page = 1;
              this.getList();
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
            });
          }
        }
      });
    },
    // 换页
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.getList();
    },
    // 获取列表
    getList() {
      console.log('type=' + this.attrType);
      let param = { limit: this.limit, pageNo: this.page };
      if (this.attrType !== '') {
        param.addressType = this.attrType;
      }
      netAPI.getAddressList(param).then(res => {
        this.items = res.items;
        this.total = Number(res.total);
      });
    },
    // 新增
    addOne() {
      trackEvent(['_trackEvent', '地址簿', '新增', '新增地址簿']);
      this.infoDialogIsShow = true;
      this.editId = '';
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.btn_add {
  width: 80px;
  margin-bottom: 20px;
  font-size: 14px;
  box-sizing: border-box;
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
