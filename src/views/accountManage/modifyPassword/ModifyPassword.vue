<template>
  <div class="password_content">
    <el-form :model="form" ref="form" :rules="rules" :inline="true" label-width="150px">
      <el-row v-if="hasPassword">
        <el-form-item label="当前密码" prop="password">
          <el-input type="password" :maxlength="25" v-model="form.password" placeholder="请输入当前密码"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" :maxlength="25" v-model="form.newPassword" placeholder="只能包含大小写字母，数字，长度8-25位"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="确认新密码" prop="reNewPassword">
          <el-input type="password" :maxlength="25" v-model="form.reNewPassword" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label=" ">
          <el-button @click="submit" type="primary">提交</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import netAPI from '@/api';
import reg from '@/utils/validateRegulars';
let {baseFn} = reg;
export default {
  name: 'ModifyPassword',
  components: {},
  computed: {
  },
  data() {
    let valiPassword = baseFn('password');
    let valiConfirm = (rule, value, callback) => {
      if (this.form.newPassword !== this.form.reNewPassword) {
        return callback(new Error('两次密码输入不一致'));
      }
      callback();
    };
    return {
      hasPassword: false,
      form: {
        password: '',
        newPassword: '',
        reNewPassword: ''
      },
      rules: {
        password: [
          { required: true, message: '密码不能为空', trigger: ['change', 'blur'] }
        ],
        newPassword: [
          { required: true, message: '密码不能为空', trigger: ['change', 'blur'] },
          { min: 8, message: '长度不能小于8', trigger: ['change', 'blur'] },
          { validator: valiPassword, trigger: ['change', 'blur'] }
        ],
        reNewPassword: [
          { required: true, message: '密码不能为空', trigger: ['change', 'blur'] },
          { min: 8, message: '长度不能小于8', trigger: ['change', 'blur'] },
          { validator: valiConfirm, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.hasPw();
  },
  methods: {
    // 判断是否有密码
    hasPw() {
      netAPI.hasPassword().then(res => {
        this.hasPassword = res;
      });
    },
    // 保存
    submit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false;
        }
        netAPI.changePassword(this.form).then(res => {
          if (!res) {
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.$refs['form'].resetFields();
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.password_content /deep/ {
  padding:80px 0;
  font-size:14px;
  .el-input--small .el-input__inner {
    width:320px;
    height:34px;
    line-height:34px;
    border-radius: 2px;
  }
  .el-form-item__label {
    color:#000;
    font-weight: bold;
  }
  .el-button {
    width:320px;
    font-size:14px;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
}
</style>
