<template>
  <div class="evaluate-bar">
    <span>满意程度：</span>
    <div class="evaluate-selector">
      <el-rate
          :disabled="disabled"
          @change="change"
          v-model="value"
          :texts="textArray"
          show-text>
      </el-rate>
      <template v-if="disabled">
        <el-tag v-for="(item, index) in tags" :key="index">{{item}}</el-tag>
      </template>
      <el-checkbox-group v-if="hasTag" v-model="checkList" @change="changeCheckbox" :disabled="disabled">
        <el-checkbox v-for="(item, index) in items" :key="index" :label="item"></el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
const TAG_LIST = {
  'send': {
    1: ['未提前预约', '上门取件慢', '服务态度差', '未规范着装', '未标准收费', '未规范包装'],
    2: ['未提前预约', '上门取件慢', '服务态度差', '未规范着装', '未标准收费'],
    3: ['未提前预约', '上门取件慢', '服务态度差', '未规范着装'],
    4: ['提前预约', '取件迅速', '服务态度好', '标准收费', '安全专业'],
    5: ['提前预约', '取件迅速', '服务态度好', '标准收费', '安全专业', '热情友好']
  },
  'receive': {
    1: ['派送不及时', '外包装破损', '不送货上门', '虚假签收', '乱丢包裹'],
    2: ['不送货上门', '送前没预约', '外包装破损', '着装不规范', '态度恶劣'],
    3: ['速递一般', '送前没预约', '外包装完好', '不送货上门', '态度差'],
    4: ['速度快', '外包装完好', '送前预约', '态度好', '着装规范', '小鲜肉'],
    5: ['速度快', '外包装完好', '很专业', '态度好', '非常热情', '小鲜肉', '很帅']
  }
};
export default {
  props: {
    star: null,
    tags: {
      default() {
        return [];
      },
      type: Array
    },
    type: null,
    hasTag: false,
    disabled: false
  },
  watch: {
    star(val) {
      this.value = val;
    },
    tags(val) {
      this.checkList = JSON.parse(JSON.stringify(val));
    }
  },
  data() {
    return {
      items: [],
      checkList: [],
      value: null,
      textArray: ['非常不满意', '不满意', '一般', '满意', '非常满意']
    };
  },
  created() {
  },
  methods: {
    change(val) {
      if (this.type) {
        this.items = TAG_LIST[this.type][val];
      }
      this.checkList = [];
      this.$emit('change-rate', val);
    },
    changeCheckbox(val) {
      this.$emit('change-checkbox', val);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.evaluate-bar {
  &:first-of-type {
    margin-top: 30px;
  }
  margin-left: 130px;
  &>span {
    color: #666666;
    margin-bottom:10px;
    display:inline-block;
    font-size:16px;
  }
  .evaluate-selector {
    vertical-align: top;
    display: inline-block;
    .el-rate {
      margin-bottom: 10px;
    }
  }
}
.evaluate-selector /deep/ {
    .el-checkbox{
      width:100px;
      margin-bottom: 20px;
    }
    .el-rate__text {
      font-size:12px;
      color:#E69B24 !important;
    }
}
</style>
