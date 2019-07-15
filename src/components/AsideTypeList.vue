<template>
  <div>
    <div v-if="pageType==2">
      <!-- <div class="avatar">
        <img v-if="getIcon" :src="getIcon" />
        <img v-else src="@/assets/images/noLogin.png" />
      </div>-->
      <div class="title">{{name}}</div>
    </div>
    <div
      @click="changeActive(item)"
      class="search-item"
      v-for="(item, index) in menuList"
      :key="index"
      :class="{active: item.value === activeType}"
    >
      <i class="num" :class="{activeIcon: item.value === activeType}"></i>
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import { getStore } from '@/utils/localStorage';
export default {
  props: ['menuList', 'originType', 'pageType'],
  data() {
    return {
      activeType: 'all'
    };
  },
  watch: {
    originType(val) {
      this.activeType = val;
    }
  },
  computed: {
    name() {
      return this.$store.state.user.nickName || this.$store.state.user.userName;
    },
    getIcon() {
      return this.$store.state.user.headIcon || getStore('userInfo_img');
    }
  },
  created() {
    this.activeType = this.originType || 'all';
  },
  methods: {
    changeActive(item) {
      this.activeType = item.value;
      this.$emit('click-item', item);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.search-item {
  display: flex;
  margin-top: 2px;
  text-align: left;
  font-size: 14px;
  line-height: 40px;
  cursor: pointer;
  color: #333;
  .num {
    margin: 0px 12px;
    display: inline-block;
    height: 6px;
    width: 6px;
    margin-top: 17px;
    border-radius: 3px;
  }
  &.active {
    color: #47086c;
    font-weight: bold;
    background: rgba(43, 1, 68, 0.05);
    border-radius: 6px;
  }
  .activeIcon {
    background: #47086c;
  }
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 30px;
  img {
    width: 100%;
    height: 100%;
  }
}
.title {
  color: #000;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}
</style>
