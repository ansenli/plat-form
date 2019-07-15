<template>
  <div class="yto-box">
    <div class="title" v-if="!showInDialog">模板管理</div>
    <div v-show="!infoShow" class="flex-box">
      <div :class="[showInDialog ? 'templ-box-in-dialog' : 'templ-box']" v-for="(item,index) in items" :key="index">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span class="t_name">{{item.templateName}}</span>
            <el-dropdown
                style="float: right;"
                :hide-on-click="true"
                @command="handleCommand($event, item.id)">
              <span class="el-dropdown-link">修改<i class="el-icon-arrow-down el-icon--right" style="margin-right:-20px;margin-left:20px;"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">修改</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="mess-box">
            <div class="t_content">
              <img style="vertical-align: middle;margin-right:40px;" src="@/assets/images/ji@2x.png">
              <span class="txt">{{item.senderName}}</span>
              <span class="txt">{{item.senderPhone}}</span>
              <span>{{item.senderProvinceName + item.senderCityName + item.senderDistrictName + item.senderAddress}}</span>
            </div>
            <div class="t_content">
              <img style="vertical-align: middle;margin-right:40px;" src="@/assets/images/shou@2x.png">
              <span class="txt">{{item.receiverName}}</span>
              <span class="txt">{{item.receiverPhone}}</span>
              <span>{{item.receiverProvinceName + item.receiverCityName + item.receiverDistrictName + item.receiverAddress}}</span>
            </div>
            <el-button class="use-btn" v-if="showInDialog" type="primary" @click="useIt(item)">一键使用</el-button>
          </div>
        </el-card>
      </div>
      <div class="add-new-btn" :class="[showInDialog ? 'templ-box-in-dialog' : 'templ-box']" v-show="items.length < 10" @click="addOne">
        <div><img src="@/assets/images/ad@2x.png"  style="vertical-align: middle;margin-right:10px;"/>添加新模板</div>
      </div>
    </div>
    <div v-show="infoShow">
      <template-info :edit-id="editId" @cancel="cancel" @success="success"></template-info>
    </div>
  </div>
</template>

<script>
import netAPI from '@/api';
import templateInfo from './templateInfo';
import { trackEvent } from '@/utils/common';
export default {
  name: '',
  props: {
    showInDialog: false
  },
  components: { templateInfo },
  data() {
    return {
      editId: '',
      infoShow: false,
      items: []
    };
  },
  created() {
    console.log('showInDialog1=' + this.showInDialog);
    this.getList();
  },
  methods: {
    // 一键使用
    useIt(item) {
      this.$emit('select', item);
    },
    // 保存成功
    success() {
      this.cancel();
      this.getList();
    },
    // 取消编辑
    cancel() {
      this.infoShow = false;
      this.editId = '';
    },
    // 新增
    addOne() {
      trackEvent(['_trackEvent', '模板管理', '添加新模板', '添加新模板']);
      this.editId = '';
      this.infoShow = true;
    },
    // 点击菜单
    handleCommand(command, id) {
      trackEvent(['_trackEvent', '模板管理', '删除', '删除模板', id]);
      if (command === 'delete') {
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          callback: action => {
            if (action === 'confirm') {
              netAPI.deleteTempl(id).then(res => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getList();
              });
            }
          }
        });
      } else {
        trackEvent(['_trackEvent', '模板管理', '修改', '修改模板', id]);
        this.editId = id;
        this.infoShow = true;
      }
    },
    // 获取列表
    getList() {
      netAPI.getTemplList().then(res => {
        this.items = res.items;
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.title {
  color: #333;
  font-weight: 800;
  padding-bottom: 20px;
  padding-left: 40px;
}
.flex-box {
  display: flex;
  flex-wrap: wrap;
  .templ-box {
    width: 50%;
  }
  .templ-box-in-dialog {
    width: 100%;
    .mess-box {
      position: relative;
      .use-btn {
        position: absolute;
        right: 0;
        bottom: -55px;
      }
    }
  }
  .add-new-btn {
    min-height: 100px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    font-size: 20px;
    color: #333;
    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
  .clearfix {
    font-size: 14px;
  }
  .t_content {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 20px;
    margin-left: 20px;
    .txt {
      margin-right: 20px;
      display: inline-block;
    }
  }
  .el-dropdown-link {
    display: inline-block;
    color: #47086c;
    width: 94px;
    height: 26px;
    border: 1px solid rgba(204, 204, 204, 1);
    text-align: center;
    line-height: 26px;
    border-radius: 2px;
  }
  .t_name {
    display: inline-block;
    height: 26px;
    line-height: 26px;
  }
  .templ-box /deep/ {
    .el-card__header {
      // border-bottom: none;
    }
    .el-card__body {
      padding: 20px 20px 40px;
    }
  }
}
.templ-box-in-dialog /deep/ {
  .el-card__body {
    padding: 20px 20px 60px;
  }
}
</style>
