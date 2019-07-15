<template>
  <custom-dialog :title="title" :visible.sync="dialogVisible">
    <div class="body" slot="body">
      <div class="custom-flex-box section">
        <div style="flex-grow: 1;">
          <img class="label-icon" src="@/assets/images/yundan@2x.png">
          <label>运单号</label>
          <span class="blue">{{mailNo}}</span>
        </div>
        <div style="flex-grow: 1;">
          <img class="label-icon" src="@/assets/images/dingdan@2x.png">
          <label>下单时间</label>
          <span class="blue">{{createTime | dateFull}}</span>
        </div>
      </div>
      <div class="section">
        <img class="label-icon" src="@/assets/images/ji@2x.png">
        <div class="inline-box">
          <span>{{senderName}}</span><span>{{senderPhone}}</span><span>{{senderProvinceName + senderCityName + senderDistrictName + senderAddress}}</span>
        </div>
      </div>
      <div class="section">
        <img class="label-icon" src="@/assets/images/shou@2x.png">
        <div class="inline-box">
          <span>{{receiverName}}</span><span>{{receiverPhone}}</span><span>{{receiverProvinceName + receiverCityName + receiverDistrictName + receiverAddress}}</span>
        </div>
      </div>
      <div class="section">
        <!--<el-steps :active="1">-->
          <!--<el-step title="投诉信息填写" description=""></el-step>-->
          <!--<el-step title="已受理" description=""></el-step>-->
          <!--<el-step title="处理中" description=""></el-step>-->
          <!--<el-step title="受理完成" description=""></el-step>-->
        <!--</el-steps>-->
        <el-form ref="form" :model="form" :rules="rules" :inline="false" label-width="82px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="您的手机" prop="customerTel">
                <el-input  v-model="form.customerTel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="您的姓名" prop="customerName">
                <el-input :maxlength="10" v-model="form.customerName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="货物价值" prop="goodsValue">
                <el-input :maxlength="5" v-model="form.goodsValue"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="物品类型" prop="goodsType">
                <el-select ref="goodsType" v-model="form.goodsType" @change="changeGoodsType">
                  <el-option
                    v-for="(item, index) in goodsTypeOpts"
                    :key="index"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="您的性别" prop="customerSex">
                <el-radio v-model="form.customerSex" :label="1">男</el-radio>
                <el-radio v-model="form.customerSex" :label="2">女</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否保价" prop="insuredflag">
                <el-radio v-model="form.insuredflag" :label="1">是</el-radio>
                <el-radio v-model="form.insuredflag" :label="0">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="问题大类" prop="bigProblemId">
                <el-select ref="bigType" v-model="form.bigProblemId" @change="getSmallType">
                  <el-option
                      v-for="item in bigOptions"
                      :key="item.id"
                      :label="item.problemName"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="问题小类" prop="smallProblemId">
                <el-select ref="smallType" v-model="form.smallProblemId" @change="smallTypeChange">
                  <el-option
                      v-for="item in smallOptions"
                      :key="item.id"
                      :label="item.problemName"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="投诉原因" style="display: block;" prop="complaintContent">
            <el-input type="textarea" :maxlength="500" v-model="form.complaintContent"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center;">
          <el-button @click="submit" type="primary">{{orderData ? '确定' : '再次投诉'}}</el-button>
          <el-button @click="close" type="info">取消</el-button>
        </div>
      </div>
    </div>
  </custom-dialog>
</template>

<script>
import netAPI from '@/api';
import customDialog from './customDialog';
import regJs from '@/utils/validateRegulars';
let { baseFn, reg } = regJs;
export default {
  components: { customDialog },
  props: ['visible', 'title', 'complainData', 'orderData'],
  data() {
    let valiName = baseFn('cn_letter_number');
    let valiPhone = baseFn('cn_phone');
    let valiCV = (rule, value, callback) => {
      let rObj = reg['int'];
      if (value && !rObj.reg.test(value)) {
        callback(new Error(rObj.message));
        return false;
      }
      if (value && value > 30000) {
        callback(new Error('请输入100-30000之间整数'));
        return false;
      }
      callback();
    };
    return {
      mailNo: '',
      createTime: '',
      receiverName: '',
      receiverPhone: '',
      receiverProvinceName: '',
      receiverCityName: '',
      receiverDistrictName: '',
      receiverAddress: '',
      senderName: '',
      senderPhone: '',
      senderProvinceName: '',
      senderCityName: '',
      senderDistrictName: '',
      senderAddress: '',
      goodsTypeOpts: [{ name: '电子产品', code: 1 }, { name: '服饰鞋帽', code: 2 }, { name: '食品', code: 3 }, { name: '文件', code: 4 }, { name: '其它', code: 5 }],
      form: {
        orderId: '',
        customerTel: '',
        customerName: '',
        goodsValue: '',
        goodsType: '',
        goodsTypeName: '',
        customerSex: '',
        insuredflag: '',
        bigProblemId: '',
        bigProblemName: '',
        smallProblemId: '',
        smallProblemName: '',
        complaintContent: ''
      },
      rules: {
        customerName: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] },
          { validator: valiName, trigger: ['change', 'blur'] }
        ],
        customerTel: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] },
          { validator: valiPhone, trigger: ['change', 'blur'] },
          { max: 20, message: '不能超过20字', trigger: ['change', 'blur'] }
        ],
        goodsValue: [
          // { required: true, message: '不能为空', trigger: ['change', 'blur'] },
          { validator: valiCV, trigger: ['change', 'blur'] }
        ],
        bigProblemId: [
          { required: true, message: '不能为空', trigger: ['change'] }
        ],
        smallProblemId: [
          { required: true, message: '不能为空', trigger: ['change'] }
        ],
        complaintContent: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ]
      },
      bigOptions: [],
      smallOptions: [],
      radio1: '',
      radio2: '',
      radio3: '',
      dialogVisible: this.visible
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) {
        this.getBigType();
        this.initData();
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    },
    complainData(val) {
      this.$refs['form'].resetFields();
    },
    orderData(val) {
      this.$refs['form'].resetFields();
    }
  },
  created() {
    let waybillNo = this.orderData && this.orderData.mailNo;
    if (waybillNo) {
      this.getBigType();
    }

    this.initData();
  },
  updated() {
  },
  methods: {
    // 改变物品类型
    changeGoodsType() {
    },
    // 改变小类
    smallTypeChange() {
    },
    // 提交
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.bigProblemName = this.$refs['bigType'].selectedLabel;
          this.form.smallProblemName = this.$refs['smallType'].selectedLabel;
          this.form.goodsTypeName = this.$refs['goodsType'].selectedLabel;
          this.form.waybillNo = this.mailNo;// 运单号
          // this.form.complainType = 'ORDER';
          netAPI.complainSave(this.form).then(res => {
            if (res && res.status === 0) {
              this.$message({
                type: 'success',
                message: '投诉成功'
              });
            }
            this.dialogVisible = false;
          });
          // {
          //   "bigProblemId": 0,
          //   "bigProblemName": "string",
          //   "goodsType": 0,
          //   "goodsTypeName": "string",
          //   "goodsValue": 0,
          //   "content": "string",
          //   "insuredflag": 0,
          //   "customerTel": "string",
          //   "orderId": 0,
          //   "customerName": "string",
          //   "sex": 0,
          //   "smallProblemId": 0,
          //   "smallProblemName": "string",
          // }
        }
      });
    },
    // 获取问题大类
    getBigType() {
      let waybillNo = (this.orderData && this.orderData.mailNo) || this.mailNo;
      netAPI.getBigProblem(waybillNo).then(res => {
        if (res.items) {
          this.bigOptions = res.items;
        }
      });
    },
    // 获取问题小类
    getSmallType(bigId) {
      this.form.smallProblemName = '';
      this.form.smallProblemId = '';
      netAPI.getSmallProblem(bigId).then(res => {
        if (res.items) {
          this.smallOptions = res.items;
        }
      });
    },
    // 初始化页面数据
    initData() {
      if (!this.complainData && this.orderData) {
        // 发起投诉
        this.mailNo = this.orderData.mailNo;
        this.createTime = this.orderData.createTime;
        this.receiverName = this.orderData.receiverName;
        this.receiverPhone = this.orderData.receiverPhone;
        this.receiverProvinceName = this.orderData.receiverProvinceName;
        this.receiverCityName = this.orderData.receiverCityName;
        this.receiverDistrictName = this.orderData.receiverDistrictName;
        this.receiverAddress = this.orderData.receiverAddress;
        this.senderName = this.orderData.senderName;
        this.senderPhone = this.orderData.senderPhone;
        this.senderProvinceName = this.orderData.senderProvinceName;
        this.senderCityName = this.orderData.senderCityName;
        this.senderDistrictName = this.orderData.senderDistrictName;
        this.senderAddress = this.orderData.senderAddress;
        this.form.orderId = this.orderData.id;
        // netAPI.complainMessById(this.orderData.id, this.orderData.mailNo).then(res => {
        //   if (res) {
        //     this.form.customerTel = res.customerTel || '';
        //     this.form.customerName = res.customerName || '';
        //     this.form.goodsValue = res.goodsValue || '';
        //     this.form.goodsType = 1 || '';
        //     this.form.goodsTypeName = '文件' || '';
        //     this.$set(this.form, 'sex', res.sex);
        //     // this.form.insuredflag = res.insuredflag || '';
        //     this.$set(this.form, 'insuredflag', res.insuredflag);
        //     this.form.bigProblemId = res.bigProblemId || '';
        //     // this.$set(this.form, 'bigProblemId', res.bigProblemId);
        //     this.getSmallType(res.bigProblemId);
        //     this.form.bigProblemName = res.bigProblemName || '';
        //     this.form.smallProblemId = res.smallProblemId || '';
        //     this.form.smallProblemName = res.smallProblemName || '';
        //     this.form.content = res.complaintContent || '';
        //   }
        // });
      } else if (this.complainData) {
        // console.log('投诉内容：', this.complainData);
        // 查看投诉详情
        netAPI.complainMessByComId({ id: this.complainData.id }).then(res => {
          res = res.data || {};
          // 订单信息
          this.mailNo = res.waybillNo; // 运单号
          this.createTime = res.complaintTime;// 投诉时间
          this.receiverName = res.receiverName;
          this.receiverPhone = res.receiverPhone;
          this.receiverProvinceName = res.receiverProvinceName;
          this.receiverCityName = res.receiverCityName;
          this.receiverDistrictName = res.receiverDistrictName;
          this.receiverAddress = res.receiverAddress;
          this.senderName = res.senderName;
          this.senderPhone = res.senderPhone;
          this.senderProvinceName = res.senderProvinceName;
          this.senderCityName = res.senderCityName;
          this.senderDistrictName = res.senderDistrictName;
          this.senderAddress = res.senderAddress;
          // 表单信息
          // this.form.orderId = res.orderId;
          this.form.customerTel = res.customerTel || '';
          this.form.customerName = res.customerName || '';
          this.form.goodsValue = res.goodsValue || '';
          this.form.goodsType = res.goodsType || 1;
          // this.form.goodsTypeName = '文件' || '';
          this.$set(this.form, 'customerSex', res.customerSex);
          this.$set(this.form, 'insuredflag', res.insuredflag);
          this.form.bigProblemId = res.bigProblemId || '';
          this.getSmallType(res.bigProblemId);
          this.form.bigProblemName = res.bigProblemName || '';
          this.form.smallProblemId = res.smallProblemId || '';
          this.form.smallProblemName = res.smallProblemName || '';
          this.form.complaintContent = res.complaintContent || '';
          // 加载大类
          this.getBigType();
        });
      }
    },
    close() {
      this.dialogVisible = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.body {
  .section {
    padding: 20px;
    .blue {
      color: #3482db;
    }
    .inline-box {
      display: inline-block;
      span {
        &:not(:last-child) {
          margin-right: 20px;
        }
      }
    }
    .mess-box {
      div:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }
  & > div {
    &:not(:last-child) {
      border-bottom: 2px dashed #cccccc;
    }
    .label-icon {
      vertical-align: middle;
    }
    label {
      font-size: 14px;
      font-weight: normal;
      color: #999999;
    }
    p {
      font-size: 14px;
      color: #333333;
      margin: 0;
      padding: 0;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }
    span {
      font-size: 14px;
      color: #333333;
    }
  }
}
.custom-flex-box {
  display: flex;
  &.wrap {
    flex-wrap: wrap;
    .half-box {
      width: 50%;
    }
  }
}
</style>
