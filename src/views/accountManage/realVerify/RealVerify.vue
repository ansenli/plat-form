<template>
  <div class="real_box">
    <section>
      <div class="title">尊敬的用户：</div>
      <div class="tip">根据国家邮政局《寄递渠道“三个100%”》的要求，请您寄件前完成实名登记。若不便登记，也可在我司业务员上门揽件时，配合出示身份证，谢谢配合~</div>
      <div class="tip">圆通快递将依法保护您的隐私与信息安全。</div>
    </section>
    <el-form :inline="true" label-width="90px" :model="realForm" ref="realForm" :rules="rules" style="margin-top:30px;">
      <el-row>
        <el-form-item label="姓名" prop="cerName">
          <el-input v-model="realForm.cerName" style="width: 320px"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="证件类型" prop="cerType">
          <el-select v-model="realForm.cerType" placeholder="请选择" style="width: 320px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="证件号码" prop="cerNo">
          <el-input v-model="realForm.cerNo" style="width: 320px"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="图形验证码" >
          <el-input :maxlength="4" placeholder="输入图形验证码" v-model="picSmsCode" style="width:215px;"></el-input>
          <img :src="fisrtSrc" ref="fisrtSrc" class="phone_img" @click="refreshAuthenCode"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="realForm.mobile" style="width: 320px">
            <el-button slot="append" @click="getMobileCode" :disabled="timeText >= 0">{{timeText >= 0 ? timeText + 's' : '获取验证码'}}</el-button>
          </el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="realForm.code" style="width: 320px"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label=" ">
          <el-button type="primary" @click="submitReal()" v-if="realForm.id == '' || realForm.id == null" style="width:320px;font-size:14px;margin-top:20px">提交</el-button>
          <el-button type="primary" style="width:320px;font-size:14px;margin-top:20px" @click="submitReal()" v-else>修改</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import netAPI from '@/api';
import timeText from '@/mixins/timeText';
import Cookies from 'js-cookie';
import reg from '@/utils/validateRegulars';
let { baseFn } = reg;
export default {
  name: 'RealVerify',
  mixins: [timeText],
  components: {},
  computed: {
  },
  data() {
    let valiName = baseFn('cn_letter_number');
    let valiMobile = (rule, value, callback) => {
      if (!/(^1[3|4|5|7|8]\d{9}$)/.test(value)) {
        return callback(new Error('手机号格式不正确'));
      }
      callback();
    };
    let validCard = (rule, value, callback) => {
      if (this.realForm.cerType === 'IDENTITY_CARD' || this.realForm.cerType === 'INTERIM_IDCARD') {
        // if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
        //   return callback(new Error('请输入18位身份证号'));
        // }
        if (value && value.length > 18) {
          return callback(new Error('请输入18位身份证号'));
        }
      }
      callback();
    };
    return {
      realForm: {
        cerName: '',
        cerNo: '',
        code: '',
        cerType: '',
        mobile: '',
        id: ''
      },
      picSmsCode: '',
      randValue: '',
      fisrtSrc: '',
      options: [{
        value: 'IDENTITY_CARD',
        label: '居民身份证'
      }, {
        value: 'INTERIM_IDCARD',
        label: '临时居民身份证'
      }, {
        value: 'ACCOUNT_BOOK',
        label: '户口簿'
      }, {
        value: 'MILITARY_IDCARD',
        label: '中国人民解放军军人身份证件'
      }, {
        value: 'POLICE_IDCARD',
        label: '中国人民武装警察身份证件'
      }, {
        value: 'PASS_CARD',
        label: '港澳居民来往内地通行证'
      }, {
        value: 'TAIWAN_CARD',
        label: '台湾居民通往大陆通行证'
      }, {
        value: 'FOREIGN_PASSPORT',
        label: '外国公民护照'
      }, {
        value: 'CHINA_PASSPORT',
        label: '中国公民护照'
      }, {
        value: 'HKMACAO_CARD',
        label: '港澳台居民居住证'
      }],
      rules: {
        mobile: [{ required: true, validator: valiMobile, trigger: 'blur' }],
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
        cerName: [{ required: true, message: '请输入昵称', trigger: 'blur' },
          { validator: valiName, trigger: 'blur' },
          { max: 20, message: '不能超过20字', trigger: 'blur' }],
        cerType: [{ required: true, message: '证件类型不能为空', trigger: 'blur' }],
        cerNo: [
          { required: true, message: '证件号码不能为空', trigger: 'blur' },
          { validator: validCard, trigger: ['change', 'blur'] }
        ]
      },
      timeText: '获取验证码'
    };
  },
  created() {
    this.getRealNameInfo();
    this.refreshAuthenCode();
    let time = Cookies.get('smsCode2');
    if (time) {
      let showTime = 60 - parseInt((new Date().getTime() - new Date(time).getTime()) / 1000);
      this.timeText = showTime;
      this.setText();
    }
  },
  methods: {
    getRealNameInfo() {
      netAPI.getRealNameInfo().then(res => {
        if (res) {
          this.realForm = res;
        }
      }).then(res => {
      });
    },
    getMobileCode() {
      console.log(this.realForm.mobile);
      const param = {
        phone: this.realForm.mobile,
        randValue: this.randValue,
        picCode: this.picSmsCode
      };
      netAPI.sendrealnamesms(param).then(res => {
        console.log(res);
        if (res) {
          let time = 60;
          Cookies.set('smsCode2', new Date(), { expires: (1 / (24 * 60)) });
          this.timeText = time;
          this.setText();
        }
      }).then(res => {
      }, err => {
        console.log(err);
        this.picSmsCode = '';
        this.refreshAuthenCode();
        this.timeText = -1;
        this.$message({
          type: 'warning',
          message: err.response.data.message
        });
      });
    },
    submitReal() {
      console.log(JSON.stringify(this.realForm));
      if (!this.realForm.cerName) {
        this.$message({
          type: 'warning',
          message: '请填写姓名！'
        });
        return false;
      }
      if (!this.realForm.cerType) {
        this.$message({
          type: 'warning',
          message: '请填写证件类型！'
        });
        return false;
      }
      if (!this.realForm.cerNo) {
        this.$message({
          type: 'warning',
          message: '请填写证件号码！'
        });
        return false;
      }
      if (!this.realForm.mobile) {
        this.$message({
          type: 'warning',
          message: '请填写手机号！'
        });
        return false;
      }
      if (!this.realForm.code) {
        this.$message({
          type: 'warning',
          message: '请填写验证码！'
        });
        return false;
      }
      netAPI.excuteRealName(this.realForm).then(res => {
        console.log(res);
        if (res) {
          this.$message({
            type: 'success',
            message: '认证成功！'
          });
          this.realForm = res;
          this.timeText = -1;
          Cookies.remove('smsCode2');
        }
      }, res => {
        this.picSmsCode = '';
        this.refreshAuthenCode();
        this.timeText = -1;
        this.realForm.code = '';
        this.$message({
          type: 'warning',
          message: res.response.data.message
        });
      });
    },
    refreshAuthenCode() {
      netAPI.getPicSmsCode().then(response => {
        if (response.base64Img && response.randValue) {
          const ref = this.$refs;
          Object.keys(ref).forEach(key => {
            console.log(key, ref[key]);
            if (key === 'fisrtSrc') {
              ref[key].src = response.base64Img;
            }
          });
          this.randValue = response.randValue;
        } else {
          this.$message({
            type: 'warning',
            message: '服务器返回内容有误！'
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.real_box /deep/ {
  padding: 40px;
  font-size: 14px;
  .title {
    color: #47086c;
    font-size: 14px;
  }
  .tip {
    line-height: 1.5;
    color: #333;
    margin-top: 20px;
  }
  .el-input--small .el-input__inner {
    height: 34px;
    line-height: 34px;
    border-radius: 2px;
  }
  .el-form-item__label {
    color: #000;
    font-weight: bold;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
  .phone_img {
    vertical-align: middle;
    height: 34px;
    line-height: 34px;
  }
}
</style>
