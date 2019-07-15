<!--suppress ALL -->
<template>
  <div>
    <el-form :model="form" ref="form" :rules="rules" :inline="true" label-width="150px" class="detail_content">
      <el-row>
        <el-form-item label=" ">
          <el-upload
              name="multipartFile"
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="headerData"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <img v-else-if="getIcon" :src="getIcon" class="avatar">
            <img v-else src="@/assets/images/noLogin.png" class="avatar">
            <div class="avatar-uploader-btn">修改</div>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="昵称" prop="nickName">
          <el-input  v-model="form.nickName"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="手机号码" prop="username">
          <el-input :maxlength="30" v-model="form.username" disabled></el-input>
          <el-button type="text" @click="updateMobileForm" class="update_phone_btn">修改手机号</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="form.sex" label="M">男</el-radio>
          <el-radio v-model="form.sex" label="F">女</el-radio>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
              style="width: 200px;"
              v-model="form.birthday"
              type="date"
              :picker-options="pickerOptions"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="邮箱" prop="email">
          <el-input :maxlength="30" v-model="form.email"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="所在地区" prop="region">
          <el-cascader
              ref="district"
              style="width: 200px;"
              :options="districtOptions"
              v-model="form.region"
              :props="props"
              @change="setDistrictName"
              @active-item-change="handleItemChange">
          </el-cascader>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="详细地址" prop="addressDetail">
          <el-input :maxlength="60" v-model="form.addressDetail"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="绑定账号">
          <!-- <a href="#" v-if="chatBind" class="fm_link">微信已绑定，点击解绑</a>
          <a href="#" v-if="!chatBind" class="fm_link">绑定微信</a> -->
          <a href="#" v-if="alipyBind" class="fm_link" @click="removeAlipy">支付宝已绑定，点击解绑</a>
          <a href="#" v-if="!alipyBind" class="fm_link" @click="openAlipy">绑定支付宝</a>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label=" ">
          <el-button type="primary" style="width: 320px" @click="submit">提交</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-dialog title="修改手机号" :visible.sync="updateMobileVisiable"  :center="true" width="650px" class="phone_box">
        <el-form :model="mobileForm" ref="mobileForm" :rules="mobileFormrules">
          <el-form-item label="手机号" >
            <el-input v-model="mobileForm.oriMobile" autocomplete="off" :disabled="true" style="width:410px;"></el-input>
          </el-form-item>
            <el-form-item label="图形验证码" >
            <el-input :maxlength="4" placeholder="输入图形验证码" v-model="picSmsCode" style="width:290px;"></el-input>
            <img :src="fisrtSrc" ref="fisrtSrc" class="phone_img" @click="refreshAuthenCode"/>
          </el-form-item>
          <el-form-item label="验证码" >
            <el-input  :maxlength="6" placeholder="输入短信验证码" v-model="mobileForm.verifyCode" style="width:290px;"></el-input>
            <el-button class="smscode-btn" @click="getMessageSmsCode" :disabled="timeText >= 0">{{timeText >= 0 ? timeText + 's' : '获取验证码'}}</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="openNextPage">确定</el-button>
          <el-button @click="cancelFirstMobileChange">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="绑定手机号" :visible.sync="bindMobileVisiable" :center="true" width="650px" class="phone_box">
        <el-form :model="bindMobileForm" ref="bindMobileForm" :rules="bindMobileFormRules">
          <el-form-item label="手机号">
            <el-input v-model="bindMobileForm.changeMobile" autocomplete="off" style="width:410px;"></el-input>
          </el-form-item>
          <el-form-item label="图形验证码">
            <el-input style="width: 290px;"  :maxlength="4" placeholder="输入图形验证码" v-model="nextPicSmsCode"></el-input>
            <img :src="nextSrc" ref="nextSrc" class="phone_img"  @click="refreshAuthenCode"/>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input style="width:290px;" :maxlength="6" placeholder="输入短信验证码" v-model="bindMobileForm.bindVerifyCode"></el-input>
            <el-button class="smscode-btn" @click="getBindMessageSmsCode" :disabled="bindTimeText >= 0">{{bindTimeText >= 0 ? bindTimeText + 's' : '获取验证码'}}</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelBindMobileChange">取 消</el-button>
          <el-button type="primary" @click="commitChange">提交</el-button>
        </div>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="isAlipyBox" :center="true" width="500px">
        <div style="text-align:center;">您将解绑此账号，请确认是否继续？</div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAlipy">取 消</el-button>
          <el-button type="primary" @click="commitAlipy">提交</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import district from '@/mixins/district';
import netAPI from '@/api';
import Cookies from 'js-cookie';
import reg from '@/utils/validateRegulars';
import remoteJs from '@/components/remoteJs';
import timeText from '@/mixins/timeText';
import nc from '@/mixins/nc';
let { baseFn } = reg;
export default {
  name: 'BasicMess',
  mixins: [district, timeText, nc],
  components: { remoteJs },
  watch: {
    timeText(newVal) {
      if (newVal === '0') {
        this.isBlockSlided = false;
        this.nc.reset();
      }
    }
  },
  computed: {
    // getIcon() {
    //   return window.location.origin + '/api/fileshow';
    // },
    uploadUrl() {
      return window.location.origin + '/api/user/uploadheadicon';
    }
  },
  data() {
    let valiName = baseFn('cn_letter_number');
    let valiMobile = (rule, value, callback) => {
      if (!/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(value)) {
        return callback(new Error('手机号格式不正确'));
      }
      callback();
    };
    let valiPhone = baseFn('number_line');
    // let valiEmail = baseFn('some_email');
    return {
      getIcon: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      headerData: { source: 'YTO-MEMBER', 'jwt-token': Cookies.get('jwt-token') },
      imageUrl: '',
      props: {
        label: 'name',
        value: 'code',
        children: 'leafRegions'
      },
      districtOptions: [],
      form: {
        headIcon: '',
        nickName: '',
        sex: '',
        birthday: '',
        email: '',
        region: [],
        regionName: [],
        addressDetail: '',
        username: ''
      },
      rules: {
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' },
          { validator: valiName, trigger: 'blur' },
          { max: 20, message: '不能超过20字', trigger: 'blur' }],
        username: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] },
          { validator: valiPhone, trigger: ['change', 'blur'] }
        ],
        sex: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        birthday: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        email: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] },
          // { validator: valiEmail, trigger: ['change', 'blur'] }
          { max: 50, message: '邮箱长度过长', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '不能为空', trigger: ['change'] }
        ],
        addressDetail: [{ required: true, message: '请输入详细地址', trigger: 'blur' },
          { max: 128, message: '不能超过128字', trigger: 'blur' },
          { min: 5, message: '不少于5字符', trigger: 'blur' },
          { validator: valiName, trigger: ['change', 'blur'] }]
      },
      mobileForm: {
        oriMobile: '',
        verifyCode: ''
      },
      mobileFormrules: {
        /* oriMobile: {required: true, validator: valiMobile, trigger: 'blur' }, */
        oriMobile: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] },
          { validator: valiMobile, trigger: ['change', 'blur'] }
        ],
        verifyCode: { required: true, message: '验证码不能为空', trigger: ['change', 'blur'] }
      },
      bindMobileFormRules: {
        /* oriMobile: {required: true, validator: valiMobile, trigger: 'blur' }, */
        changeMobile: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] },
          { validator: valiMobile, trigger: ['change', 'blur'] }
        ],
        bindVerifyCode: { required: true, message: '验证码不能为空', trigger: ['change', 'blur'] }
      },
      formLabelWidth: '60px',
      updateMobileVisiable: false,
      timeText: -1,
      bindTimeText: -1,
      bindMobileVisiable: false,
      bindMobileForm: {
        changeMobile: '',
        bindVerifyCode: ''
      },
      isLast: false,
      fisrtSrc: '',
      picSmsCode: '',
      randValue: '',
      nextPicSmsCode: '',
      nextSrc: '',
      bindItems: [],
      chatBind: null,
      alipyBind: null,
      isAlipyBox: false
    };
  },
  created() {
    // this.getAuthenticationCode(this.fisrtSrc);
    this.getHeadIcon();
    this.getDistrict('086', this.districtOptions, () => {
      netAPI.getUserInfo().then(res => {
        this.form.username = res.username || '';
        if (Object.keys(res).length > 1) {
          this.form.nickName = res.nickName || '';
          this.form.headIcon = res.headIcon || '';
          this.form.sex = res.sex || '';
          this.form.birthday = res.birthday || '';
          this.form.email = res.email || '';
          if (res.provinceCode && res.cityCode && res.districtCode) {
            this.form.region = [res.provinceCode, res.cityCode, res.districtCode];
            this.setDistrict(this.districtOptions, this.form.region, 0);
          }
          this.form.regionName = [res.provinceName, res.cityName, res.districtName];
          this.form.addressDetail = res.address || '';
          this.$nextTick(() => {
            this.$refs['form'].clearValidate();
            this.$store.commit('SET_USERINFO', { username: res.username, nickName: res.nickName, headIcon: res.headIcon, userId: res.userId });
          });
        }
      });
    });
    this.getAllBind();// 绑定信息
  },
  methods: {
    // 获取头像
    getHeadIcon() {
      function blobToDataURL(blob, callback) {
        let a = new FileReader();
        a.onload = function (e) { callback(e.target.result); };
        a.readAsDataURL(blob);
      }
      netAPI.getHeadIcon().then(res => {
        if (res.size > 0) {
          blobToDataURL(res, (data) => {
            this.getIcon = data;
            this.$store.commit('SET_HEADICON', data);
          });
        }
      });
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false;
        }
        let data = {
          address: this.form.addressDetail,
          birthday: this.form.birthday,
          email: this.form.email,
          // headIcon: this.form.headIcon,
          nickName: this.form.nickName,
          sex: this.form.sex,
          provinceCode: this.form.region[0],
          provinceName: this.form.regionName[0],
          cityCode: this.form.region[1],
          cityName: this.form.regionName[1],
          districtCode: this.form.region[2],
          districtName: this.form.regionName[2]
        };
        netAPI.changeMess(data).then(res => {
          if (res === 1) {
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            let info = {
              username: this.form.username,
              nickName: data.nickName,
              headIcon: data.headIcon,
              userId: data.userId
            };
            this.$store.commit('SET_USERINFO', info);
            this.$store.dispatch('GetUserInfo', info);
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            });
          }
        });
      });
    },
    // 改变区域
    handleItemChange(val) {
      let limit = 3;
      if (val[0] === '00853') {
        limit = 1;
      } else if (val[0] === '886001') {
        limit = 2;
      }
      this.selectDistrict(this.districtOptions, val, limit);
    },
    setDistrictName() {
      this.form.regionName = this.$refs['district'].currentLabels;
    },
    // 上传头像
    handleAvatarSuccess(res, file) {
      if (res) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.headIcon = false;
        this.form.headIcon = res;
        this.$store.commit('SET_HEADICON', this.imageUrl);
      } else {
        this.$message({
          type: 'warning',
          message: res.message || '上传失败！'
        });
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是JPG/PNG格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      return isLt1M;
    },
    updateMobileForm() {
      this.ncInit();
      this.getAuthenticationCode();
      // this.loadRongJs();
      this.mobileForm.oriMobile = this.form.username;
      this.updateMobileVisiable = true;
      // this.$router.forward();
    },
    // 获取短信验证码
    getMessageSmsCode() {
      if (!this.mobileForm.oriMobile) {
        this.$message({
          type: 'warning',
          message: '请填写手机号！'
        });
        return false;
      }
      if (!/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.mobileForm.oriMobile)) {
        this.$message({
          type: 'warning',
          message: '手机号格式不正确'
        });
        return false;
      }
      if (!this.picSmsCode) {
        this.$message({
          type: 'warning',
          message: '请输入图形验证码！'
        });
        return false;
      }

      let query = {
        mobile: this.mobileForm.oriMobile,
        randValue: this.randValue,
        picCode: this.picSmsCode
      };
      netAPI.sendMobileSms(query).then(() => {
        let time = 60;
        Cookies.set('updateMobile', new Date(), { expires: (1 / (24 * 60)) });
        this.timeText = time;
        this.setText();
      }).catch((err) => {
        console.log(err);
        this.refreshAuthenCode();
        this.picSmsCode = '';
        this.timeText = -1;
      });
    },
    cancelFirstMobileChange() {
      this.updateMobileVisiable = false;
      this.picSmsCode = '';
      this.timeText = -1;
      this.mobileForm.verifyCode = '';
    },
    openNextPage() {
      const code = this.mobileForm.verifyCode;
      netAPI.vefityMobileSms({
        mobile: this.mobileForm.oriMobile,
        code: code
      }).then(() => {
        this.getAuthenticationCode();
        this.updateMobileVisiable = false;
        this.bindMobileVisiable = true;
      }, err => {
        if (err) {
          console.log(err.stack);
        }
        this.refreshAuthenCode();
        this.mobileForm.verifyCode = '';
        this.picSmsCode = '';
        this.timeText = -1;
      });
    },
    // 获取短信验证码
    getBindMessageSmsCode() {
      if (!this.bindMobileForm.changeMobile) {
        this.$message({
          type: 'warning',
          message: '请填写手机号！'
        });
        return false;
      }
      if (!/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.bindMobileForm.changeMobile)) {
        this.$message({
          type: 'warning',
          message: '手机号格式不正确！'
        });
        this.refreshAuthenCode();
        this.bindTimeText = -1;
        return false;
      }
      if (!this.nextPicSmsCode) {
        this.$message({
          type: 'warning',
          message: '请输入图形验证码！'
        });
        return false;
      }
      let query = {
        mobile: this.bindMobileForm.changeMobile,
        randValue: this.randValue,
        picCode: this.nextPicSmsCode
      };
      netAPI.sendMobileSms(query).then(() => {
        let time = 60;
        Cookies.set('updateMobile', new Date(), { expires: (1 / (24 * 60)) });
        this.bindTimeText = time;
        this.setBindText();
      }).catch((err) => {
        console.log(err);
        this.refreshAuthenCode();
        this.bindTimeText = -1;
        this.nextPicSmsCode = '';
      });
    },
    cancelBindMobileChange() {
      this.cancelFirstMobileChange();
      this.bindMobileVisiable = false;
      this.bindTimeText = -1;
      this.nextPicSmsCode = '';
      this.bindMobileForm.bindVerifyCode = '';
    },
    commitChange() {
      const param = {
        code: this.bindMobileForm.bindVerifyCode,
        userName: this.bindMobileForm.changeMobile
      };
      netAPI.commitChangeMobile(param).then(res => {
        this.bindMobileVisiable = false;
        this.$message({
          message: '修改成功,下次可以通过' + this.bindMobileForm.changeMobile + '进行登录',
          type: 'success'
        });
        this.refreshAuthenCode();
        this.mobileForm.verifyCode = '';
        this.picSmsCode = '';
        this.timeText = -1;
        this.bindTimeText = -1;
        this.nextPicSmsCode = '';
        this.bindMobileForm.bindVerifyCode = '';
        this.form.username = this.bindMobileForm.changeMobile;
        // this.$router.go(0);
        // this.
      }, err => {
        if (err) {
          console.log(err.stack);
        }
        this.bindTimeText = -1;
        this.refreshAuthenCode();
        this.nextPicSmsCode = '';
        this.bindMobileForm.bindVerifyCode = '';
      });
    },
    onSuccess() {
      this.isLast = true;
    },
    getAuthenticationCode() {
      netAPI.getPicSmsCode().then(response => {
        if (response.base64Img && response.randValue) {
          const ref = this.$refs;
          Object.keys(ref).forEach(key => {
            console.log(key, ref[key]);
            if (key === 'fisrtSrc' || key === 'nextSrc') {
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
    },
    refreshAuthenCode() {
      this.getAuthenticationCode();
    },
    setBindText() {
      setTimeout(() => {
        if (this.bindTimeText >= 0) {
          this.bindTimeText--;
          this.setBindText();
        }
      }, 1000);
    },
    getAllBind() {
      var query = {
        orSource: ['ALIPAY_PC', 'WEIXIN_PC']
      };
      netAPI.getBindInfo(query).then(res => {
        if (res && res.length > 0) {
          this.bindItems = res;
          this.chatBind = res.find((x) => {
            return x.source === 'WEIXIN_PC';
          });
          this.alipyBind = res.find((x) => {
            return x.source === 'ALIPAY_PC';
          });
        }
      });
    },
    openAlipy() {
      console.log('come in...');
      netAPI.openAlipayUrl({ type: 3 }).then(res => {
        window.open(res);
      });
    },
    // 解除支付宝绑定
    removeAlipy() {
      this.isAlipyBox = true;
    },
    cancelAlipy() {
      this.isAlipyBox = false;
    },

    commitAlipy() {
      this.isAlipyBox = false;
      var query = {
        requestId: this.alipyBind.openId,
        orSource: this.alipyBind.source
      };
      netAPI.releaseBind(query).then(res => {
        this.$message({
          type: 'info',
          message: '解绑成功！'
        });
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.detail_content /deep/ {
  .el-input--small .el-input__inner {
    width: 320px;
    height: 34px;
    line-height: 34px;
  }
  .el-form-item__label {
    color: #000;
    font-weight: bold;
  }
  .el-input__inner {
    color: #333;
  }
  .el-button--small {
    font-size: 14px;
    font-weight: bold;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
  .update_phone_btn {
    position: absolute;
    top: 0;
    right: -80px;
  }
  a {
    text-decoration: none;
  }
  .fm_link {
    display: block;
  }
}
.avatar-uploader /deep/ {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin-top: 50px;
    margin-left: 68px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
      .avatar-uploader-btn {
        bottom: 0;
      }
    }
    .avatar-uploader-btn {
      background-color: rgba(0, 0, 0, 0.5);
      font-size: 16px;
      color: white;
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      transition: all 0.3s;
      position: absolute;
      bottom: -30px;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
}

.phone_box /deep/ {
  .el-dialog__title {
    color: #000;
    font-size: 16px;
  }
  .el-dialog--center .el-dialog__body {
    font-size: 14px;
    color: #333;
    padding: 25px 50px 10px;
  }
  .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .el-form-item__label {
    width: 90px;
  }
  .el-button--small {
    font-size: 14px;
  }
  .phone_img {
    display: inline-block;
    width: 120px;
    vertical-align: bottom;
    height: 40px;
  }
  .smscode-btn {
    width: 120px;
    height: 40px;
    background: rgba(71, 8, 108, 1);
    border-radius: 2px;
    color: #fff;
  }
}
</style>
