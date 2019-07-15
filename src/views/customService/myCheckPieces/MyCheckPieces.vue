<template>
  <div class="mybill-container">
    <el-input
        v-model="mailNo"
        style="width: 900px;"
        placeholder="请输入运单号点击查询并以,分割"
        :clearable="true"
        @keyup.enter.native="search">
      <el-button slot="append" @click="mailNo = ''" icon="el-icon-delete"></el-button>
    </el-input>
    <div class="btn16" style="display:inline-block;margin-left:10px;">
      <el-button type="primary" @click="search" :disabled="loading">查询</el-button>
    </div>
    <div style="margin-top: 20px; margin-bottom: 20px;color:#666;">
      最近查找：
      <el-tag style="cursor: pointer;" @click.native="fillSearch(tag)" v-for="(tag, index) in searchList" :key="index" @close="handleClose(index)" closable>{{tag}}</el-tag>
    </div>
    <el-collapse v-model="activeNames" v-if="items.length > 0">
      <el-collapse-item v-for="(item,index) in items" :name="index" :key="index">
        <template slot="title">
          运单号：{{item.waybillNo}}
        </template>
        <el-scrollbar wrapClass="yto-x-hidden" style="height: 350px;">
          <ul>
            <li v-for="(info, index2) in item.waybillProcessInfo" :key="index2"><p>{{info.waybillProcessInfo.processInfo}}</p><p>{{info.waybillProcessInfo.upload_Time | dateFull}}</p></li>
          </ul>
        </el-scrollbar>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { setStore, getStore } from '@/utils/localStorage';
import netAPI from '@/api';
export default {
  components: {},
  name: 'MyCheckPieces',
  data() {
    return {
      searchList: [],
      loading: false,
      mailNo: '',
      items: [],
      activeNames: 0
    };
  },
  watch: {
  },
  created() {
    let items = JSON.parse(getStore('searchPiece'));
    this.searchList = items || [];
    const queryList = Object.keys(this.$route.query);
    if (queryList.length > 0) {
      this.mailNo = this.$route.query['mailNo'];
      this.search();
    }
  },
  methods: {
    // 点击tag查件
    fillSearch(tag) {
      if (!this.loading) {
        this.mailNo = tag;
        this.search(true);
      }
    },
    // 关闭tag
    handleClose(index) {
      this.searchList.splice(index, 1);
      setStore('searchPiece', this.searchList);
    },
    // 校验查询字段
    check() {
      if (this.mailNo.length === 0) {
        this.$message({
          type: 'warning',
          message: '请输入运单号'
        });
        return false;
      }
      let arrNo = this.mailNo.split(',');
      if (arrNo && arrNo.length > 5) {
        this.$message({
          type: 'warning',
          message: '一次最多只能查询5个'
        });
        return false;
      }
      for (let itemNo of arrNo) {
        // itemNo = itemNo.toUpperCase();
        if (!/^[A-Za-z\d]+$/.test(itemNo)) {
          this.$message({
            type: 'warning',
            message: '不能包含特殊字符'
          });
          return false;
        }
        if (!/^([8][0]|[9][9]|[D][D]|[G][8]|[6][0-9]|[7][0]|[7][9]|[7][8])[0-9]{16}$|^([8][A-Za-z0-9]|[G][0-9]|[D][D]|[M][0-9]|[B][9]|[D][B]|[1-7][0-9]|[H][1]|[Z][0-9]|[D][0-9]|[V][0-9]|[C][0-9]|[G][9])[0-9]{10}$|^([8][1][5][7]|[G][0][0][1])[0-9]{8}$|^([YTM])[0-9]{14}$|^YT[0-9]{13}$/.test(itemNo)) {
          this.$message({
            type: 'warning',
            message: '请输入正确的运单号'
          });
          return false;
        }
      }
      return true;
    },
    // 查询
    search(notFill) {
      if (!this.check()) {
        return false;
      }
      let arr = this.mailNo.split(',');
      this.loading = true;
      netAPI.getOrderWalkingPieceMess(arr).then(res => {
        this.items = res;
        if (res && res.length > 0) {
          for (let i of arr) {
            if (this.searchList.indexOf(i) === -1) {
              if (this.searchList.length === 5) {
                this.searchList.pop();
              }
              this.searchList.unshift(i);
              setStore('searchPiece', this.searchList);
              this.activeNames = 0;
            }
          }
        }
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.mybill-container /deep/ {
  margin: 20px 0;
  padding: 40px;
  background-color: #ffffff;
  .el-tag {
    margin-right: 20px;
    height: 28px;
    line-height: 28px;
    color: #999;
    background: #fff;
  }
  .el-tag .el-icon-close {
    color: #999;
  }
  .el-collapse-item__header {
    border-bottom: 1px dashed #ebeef5;
    height: 56px;
    line-height: 56px;
    padding: 0 20px;
    font-size: 16px;
    color: #333;
  }
  .el-collapse-item__content {
    padding: 10px 45px;
  }
  .no_box {
    p {
      border-bottom: 1px dashed #ebeef5;
      height: 56px;
      line-height: 56px;
      padding: 0 20px;
      font-size: 16px;
      color: #333;
    }
  }
}
</style>
