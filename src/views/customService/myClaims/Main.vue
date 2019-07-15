<template>
  <div class="lp-box">
  <el-row>
   <el-form ref="form" :model="form" :inline="true">
     <el-form-item label="下单时间" prop="createBeginTime">
          <el-date-picker
              v-model="form.createBeginTime"
              type="date"
              :picker-options="pickerOptions"
              @change="changeSTime"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item><span style="display:inline-block;color:#666;">-</span></el-form-item>
        <el-form-item prop="createEndTime">
          <el-date-picker
              v-model="form.createEndTime"
              type="date"
              @change="changeETime"
              :picker-options="pickerOptions"
              placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="运单号码" prop="waybillNo" style="margin-left:40px;">
        <el-input placeholder="请输入运单号"  v-model="form.waybillNo" clearable></el-input>
      </el-form-item>
       <el-form-item>
        <div class="btn16" style="margin-left:40px;">
          <el-button type="primary" @click="searchClaimList" >查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
       </el-form-item>
    </el-form>
    </el-row>
    <el-table :data="items" :cell-style="{'text-align': 'center'}" :header-cell-style="{'text-align': 'center'}">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="id" label="理赔编号" width="180">
         <template slot-scope="scope">
          <span class="as-link" @click="handleShowClick(scope.row.id)">{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="claimState" label="理赔状态"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="pro.waybillNo" label="运单号"></el-table-column>
      <el-table-column prop="pro.customerName" label="客户姓名"></el-table-column>
      <el-table-column prop="pro.goodsType" label="内件物品"></el-table-column>
      <el-table-column prop="claimAmount" label="理赔金额"></el-table-column>
      <!-- <el-table-column prop="paymentAmount" label="支付金额"></el-table-column>
      <el-table-column prop="paymentTime" label="支付时间"></el-table-column> -->
      <el-table-column prop="goodsType" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            class="btn-round"
            v-if="scope.row.itemShow"
            @click="handleShowClick(scope.row.id)"
          >查看</el-button>
          <el-button
            class="btn-round"
            v-if="scope.row.itemEdit"
            @click="handleEditClick(scope.row.id)"
          >编辑</el-button>
          <el-button
            class="btn-round"
            v-if="scope.row.itemRevoke"
            @click="removeWords(scope.row.id)"
          >撤销</el-button>
          <el-button
            v-if="scope.row.itemMessage"
            @click="toWords(scope.row.id)"
            class="btn-round"
          >留言</el-button>
          <el-dialog
            title="撤销"
            :visible.sync="revokeDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="500px"
          >
            <div>
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 6}"
                placeholder="请输入内容"
                :autofocus="true"
                v-model="approverContent"
              ></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="revokeDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="commitRevokeClaim()">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog
            title="留言"
            :visible.sync="leaveFeedBackDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="500px"
          >
            <div>
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 6}"
                placeholder="请输入内容"
                :autofocus="true"
                v-model="replyContent"
              ></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="leaveFeedBackDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="LeaveFeedBackClaim()">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <el-pagination
        key="pagination1"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
import district from '@/mixins/district';
import myClaims from './MyClaims';
import _ from 'lodash';
// let {baseFn} = reg;
export default {
  name: 'Main',
  mixins: [district],
  props: {
    showInDialog: false
  },
  components: { myClaims },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      form: {
        createBeginTime: '',
        createEndTime: '',
        waybillNo: ''
      },
      items: [],
      // itemShow: false,
      // itemEdit: false,
      // itemRevoke: false,
      // itemMessage: false,
      revokeDialogVisible: false,
      approverContent: '',
      leaveFeedBackDialogVisible: false,
      replyContent: '',
      page: 1,
      limit: 10,
      total: 0,
      id: '' // 理赔id
    };
  },

  created() {
    let _this = this;
    _this.open();
    _this.getUserClaim();
  },
  methods: {
    // 改变时间
    changeETime(val) {
      if (!this.form.createBeginTime) {
        this.$message({
          type: 'warning',
          message: '请先选择开始时间'
        });
        this.form.createEndTime = null;
      } else if (this.form.createBeginTime > val) {
        this.$message({
          type: 'warning',
          message: '不能小于起始时间'
        });
        this.form.createEndTime = null;
      }
    },
    changeSTime(val) {
      if (this.form.createEndTime && val > this.form.createEndTime) {
        this.$message({
          type: 'warning',
          message: '不能大于起始时间'
        });
        this.form.createEndTime = null;
      }
    },
    reset() {
      this.$refs['form'].resetFields();
    },
    searchClaimList() {
      this.page = 1;// 页面初始化
      this.getUserClaim();
    },
    getUserClaim() {
      return netAPI
        .getUserClaim({
          limit: this.limit,
          pageNo: this.page,
          createBeginTime: this.form.createBeginTime,
          createEndTime: this.form.createEndTime,
          waybillNo: this.form.waybillNo
        })
        .then(res => {
          this.total = Number(res.total);
          this.items = this.convertStautus(res.items, this);
          console.log(this.items);
        });
    },
    convertStautus(items) {
      if (items.length === 0) {
      } else {
        items.forEach(function (e) {
          switch (e.claimState) {
            case 'WAITFORUPLOAD':
              e.claimState = '待上传';
              e.itemShow = false;
              e.itemEdit = true;
              e.itemRevoke = true;
              e.itemMessage = true;
              break;
            case 'UNDERREVIEW':
              e.claimState = '审核中';
              e.itemShow = true;
              e.itemEdit = false;
              e.itemRevoke = true;
              e.itemMessage = true;
              break;
            case 'UNDERREVIEW1':
              e.claimState = '审核中';
              e.itemShow = true;
              e.itemEdit = false;
              e.itemRevoke = true;
              e.itemMessage = true;
              break;
            case 'UNDERREVIEW2':
              e.claimState = '审核中';
              e.itemShow = true;
              e.itemEdit = false;
              e.itemRevoke = true;
              e.itemMessage = true;
              break;
            case 'AUDITREJECTED':
              e.claimState = '审核已驳回';
              e.itemShow = true;
              e.itemEdit = false;
              e.itemRevoke = true;
              e.itemMessage = true;
              break;
            case 'EXAMINATIONPASSED':
              e.claimState = '审核通过';
              e.itemShow = true;
              e.itemEdit = false;
              e.itemRevoke = false;
              e.itemMessage = true;
              break;
            case 'MATERIALREJECTION':
              e.claimState = '资料驳回';
              e.itemShow = false;
              e.itemEdit = true;
              e.itemRevoke = true;
              e.itemMessage = true;
              break;
            case 'MEMBERCANCEL':
              e.claimState = '撤销';
              e.itemShow = true;
              e.itemEdit = false;
              e.itemRevoke = false;
              e.itemMessage = true;
              break;
            case 'MEMBERCANCEL1':
              e.claimState = '撤销';
              e.itemShow = true;
              e.itemEdit = false;
              e.itemRevoke = false;
              e.itemMessage = true;
              // _this.itemRevoke = true;
              break;
          }
        });
      }
      return items;
    },

    open() {
      this.$alert(
        '尊敬的客户，您好！\n' +
        '\n' +
        '您所提交的理赔工单处理时效为【7天】。如您还有未提交的理赔材料\n' +
        '\n' +
        '请尽快提交，逾期系统将自动关闭。',
        {
          confirmButtonText: '确定',
          cancelButtonText: '',
          type: '',
          center: true,
          closeOnClickModal: true
        }
      );
    },

    commitRevokeClaim() {
      console.log(this.approverContent);
      if (_.isEmpty(this.approverContent)) {
        this.$message({
          type: 'error',
          message: '撤销内容不能为空'
        });
        throw new Error('撤销内容不能为空');
      }
      return netAPI
        .revokeUserClaim({
          id: this.id,
          approverContent: this.approverContent
        })
        .then(res => {
          console.log('res: ', res);
          this.revokeDialogVisible = false;
          this.$message({
            type: 'success',
            message: '撤销成功'
          });
          this.getUserClaim();
        });
    },
    LeaveFeedBackClaim() {
      if (_.isEmpty(this.replyContent)) {
        this.$message({
          type: 'error',
          message: '留言内容不能为空'
        });
        throw new Error('留言内容不能为空');
      }
      return netAPI
        .sendMemberMessage({
          claimId: this.id,
          replyContent: this.replyContent,
          replyUserMobile: null
        })
        .then(res => {
          console.log('res: ', res);
          this.leaveFeedBackDialogVisible = false;
          this.$message({
            type: 'success',
            message: '留言成功'
          });
        });
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.getUserClaim();
    },
    // 换页
    handleCurrentChange(val) {
      this.page = val;
      this.getUserClaim();
    },
    handleShowClick(item) {
      this.$router.push({
        name: 'MyClaims',
        params: { item: item }
      });
    },
    handleEditClick(_item) {
      this.$router.push({
        name: 'EditClaim',
        params: { item: _item }
      });
    },
    toWords(id) {
      this.leaveFeedBackDialogVisible = true;
      this.replyContent = '';
      this.id = id;
    },
    removeWords(id) {
      this.revokeDialogVisible = true;
      this.approverContent = '';
      this.id = id;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.myorder-container {
  margin: 20px 0;
  background-color: #ffffff;
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
}
.lp-box {
  padding: 40px;
  .el-date-editor.el-input {
    width: 146px;
  }
}
</style>
