<template>
  <div class="urge_box">
    <el-dialog
        :modal="false"
        title="催件"
        :visible.sync="dialogVisible"
        width="500px"
        center>
      <el-form :model="form" :rules="rules" label-width="78px" ref="form">
        <el-form-item label="催件原因" prop="content">
          <el-input :maxlength="100" type="textarea" v-model="form.content" :rows="6"></el-input>
          <span class="t-tip">{{count}}/100</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit('form')">确认</el-button>
        <el-button type="info" plain @click="cancel('form')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import netAPI from '@/api';
export default {
  props: ['visible', 'urgeId', 'urgeContent'],
  computed: {
    count: function () {
      return (this.form.content && this.form.content.length) || 0;
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
      if (newVal) {
        this.setLast();
      }
    },
    dialogVisible(newVal) {
      this.$emit('update:visible', newVal);
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      form: {
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请输入催件原因', trigger: ['change', 'blur'] }
        ]
      }
    };
  },
  created() {
    this.setLast();
  },
  methods: {
    setLast() {
      this.form.content = this['urgeContent'] || '';
    },
    // 提交
    submit(formName) {
      let data = {
        content: this.form.content,
        orderId: this.urgeId
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          netAPI.urgeSave(data).then(res => {
            this.$message({
              type: 'success',
              message: '催件成功！'
            });
            this.cancel();
          });
        } else {
          return false;
        }
      });
    },
    // 取消
    cancel(formName) {
      this.dialogVisible = false;
      this.form.content = '';
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.urge_box /deep/ {
  .el-dialog__title {
    font-size: 16px;
    color: #000;
  }
  .el-dialog__header {
    border-bottom: 0;
  }
  .el-form-item__label {
    color: #333;
  }
}
.dialog-footer {
  margin-top: -10px;
  .el-button {
    width: 120px;
    height: 40px;
    font-size: 16px;
    box-sizing: border-box;
  }
}
.t-tip {
  position: absolute;
  right: 6px;
  bottom: 0;
  color: #999;
}
</style>
