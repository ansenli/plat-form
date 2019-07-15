<template>
  <div class="myorder-container">
    <el-row>
      <el-container>
        <el-aside width="200px">
          <aside-type-list
            @click-item="changeType"
            :originType="originType"
            :menu-list="menuList"
            pageType="1"
          ></aside-type-list>
        </el-aside>
        <el-main>
          <el-tabs v-model="activeName" tab-position="top" @tab-click="() => getList()">
            <el-tab-pane label="我寄的" name="0">
              <my-send
                :isLoad="isLoad"
                :data="items"
                :total="total"
                @search="getList"
                @detail="showDetail"
                @complain="complainOrder"
                @urge="urgeOrder"
                @cancel="showCancel"
                @exportTable="exportTable"
                ref="send"
              ></my-send>
            </el-tab-pane>
            <el-tab-pane label="我收的" name="1">
              <my-receive
                :isLoad="isLoad"
                :data="items"
                :total="total"
                @search="getList"
                @detail="showDetail"
                @complain="complainOrder"
              ></my-receive>
            </el-tab-pane>
          </el-tabs>
          <order-detail v-if="isDetailCreate" :orderData="detailData" :visible.sync="detailVisible"></order-detail>
          <urge-order v-if="isCreateUrge" :urgeId="urgeId" :visible.sync="urgeVisible"></urge-order>
          <order-complain
            v-if="isCreateComplain"
            :orderData="complainData"
            title="投诉"
            :visible.sync="complainVisible"
          ></order-complain>
          <order-cancel
            v-if="isCancel"
            :orderId="orderId"
            :couponsMoney="couponsMoney"
            :visible.sync="cancelVisible"
          ></order-cancel>
        </el-main>
      </el-container>
    </el-row>
  </div>
</template>

<script>
import netAPI from '@/api';
import asideTypeList from './components/asideTypeList';
import mySend from './mySend/mySend';
import myReceive from './myReceive/myReceive';
import orderDetail from './components/orderDetail';
import orderComplain from './components/orderComplain';
import urgeOrder from './components/urgeOrder';
import orderCancel from './components/orderCancel';
export default {
  components: { mySend, myReceive, asideTypeList, orderDetail, orderComplain, urgeOrder, orderCancel },
  name: 'MyOrderSystem',
  data() {
    return {
      isCreateComplain: false,
      complainData: null,
      urgeId: '',
      isCreateUrge: false,
      urgeVisible: false,
      isDetailCreate: false,
      detailData: null,
      sendPagination: {
        pageNo: 1,
        limit: 10,
        total: 0
      },
      receivePagination: {
        pageNo: 1,
        limit: 10,
        total: 0
      },
      detailVisible: false,
      complainVisible: false,
      isLoad: false,
      activeName: '0',
      items: [],
      select: 'TO_TAKE',
      originType: '',
      typeCode: { all: '', unanswered: 'TO_TAKE', transport: 'SENDING', haveSignedIn: 'SIGNED', others: 'OTHER' },
      menuList: [
        { name: '开发者信息', value: 'all', code: '', count: 0 },
        { name: '接口管理', value: 'unanswered', code: 'TO_TAKE', count: 0 },
        { name: '我的电子面单', value: 'transport', code: 'SENDING', count: 0 },
        { name: '在线API测试', value: 'haveSignedIn', code: 'SIGNED', count: 0 },
        { name: 'API测试进度', value: 'others', code: 'OTHER', count: 0 }
      ],
      pageNo: 1,
      limit: 10,
      total: 0,
      searchData: null,
      isCancel: false,
      cancelVisible: false,
      orderId: '',
      couponsMoney: 0
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.originType = val.name;
        this.getList();
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    this.originType = this.$route.name;
    this.getList();
  },
  methods: {
    // 投诉
    complainOrder(data) {
      this.isCreateComplain = true;
      this.complainVisible = true;
      this.complainData = data;
    },
    // 催件
    urgeOrder(id) {
      this.urgeId = id;
      this.isCreateUrge = true;
      this.urgeVisible = true;
    },
    // 查看详情
    showDetail(id) {
      netAPI.getOrderDetail({
        id,
        flag: this.activeName
      }).then(res => {
        if (res) {
          this.isDetailCreate = true;
          this.detailVisible = true;
          this.$nextTick(() => {
            this.detailData = res;
          });
        }
      });
    },
    // 切换类型
    changeType(item) {
      this.$router.push(item.value);
    },
    // 取消订单
    showCancel(id, money) {
      this.orderId = id;
      this.couponsMoney = money;
      this.isCancel = true;
      this.cancelVisible = true;
    },
    // 获取订单列表
    getList(searchData) {
      this.isLoad = true;
      let query = {
        flag: this.activeName,
        limit: this.limit,
        pageNo: this.pageNo,
        statusGroup: this.typeCode[this.originType]
      };
      if (searchData) {
        this.searchData = searchData;
        for (let k in searchData) {
          query[k] = searchData[k];
        }
      } else if (this.searchData) {
        for (let k in this.searchData) {
          query[k] = this.searchData[k];
        }
      }
      Promise.all([
        netAPI.getOrderList(query).then(res => {
          this.total = Number(res.total);
          this.items = res.items;
        }),
        netAPI.getOrderCount({ flag: this.activeName }).then(res => {
          if (Object.prototype.toString.call(res) === '[object Array]') {
            let list = [
              { name: '开发者信息', value: 'all', code: '', count: 0 },
              { name: '接口管理', value: 'unanswered', code: 'TO_TAKE', count: 0 },
              { name: '我的电子面单', value: 'transport', code: 'SENDING', count: 0 },
              { name: '在线API测试', value: 'haveSignedIn', code: 'SIGNED', count: 0 },
              { name: 'API测试进度', value: 'others', code: 'OTHER', count: 0 }
            ];
            for (let i = 0, l = res.length; i < l; i++) {
              list[0].count += Number(res[i]['recordCount']);
              switch (res[i].status) {
                case 'WAIT':
                case 'ACCEPT':
                  list[1].count += Number(res[i]['recordCount']);
                  break;
                case 'GOT':
                case 'SENT_SCAN':
                  list[2].count += Number(res[i]['recordCount']);
                  break;
                case 'SIGNED':
                  list[3].count += Number(res[i]['recordCount']);
                  break;
                case 'CANCEL':
                  list[4].count += Number(res[i]['recordCount']);
                  break;
              }
            }
            this.menuList = list;
          }
        })
      ]).finally(() => {
        this.isLoad = false;
      });
    },
    // 导出 type=1代表寄件  type=2代表收件
    exportTable(type) {
      let _refs = this.$refs['send'];
      var html = "<html><head><meta charset='utf-8' /></head><body>" + _refs.$refs['sendTable'].innerHTML + '</body></html>';
      // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
      var blob = new Blob([html], { type: 'application/vnd.ms-excel' });
      var a = document.getElementsByTagName('a')[0];
      // 利用URL.createObjectURL()方法为a元素生成blob URL
      a.href = URL.createObjectURL(blob);
      // 设置文件名
      a.download = '我的寄件.xls';
      a.click();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.myorder-container /deep/ {
  margin: 22px 0;
  background-color: #ffffff;
  .el-tabs__header {
    margin: 0 0 20px;
    height: 60px;
    line-height: 60px;
  }
  .el-tabs__item.is-active {
    font-weight: bold;
  }
}
</style>
