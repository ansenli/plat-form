<template>
  <div class="img_box">
    <slot></slot>
    <div v-if="items.billImgUrl1">
      <img
        :src="items.baseUrl+items.billImgUrl1"
        class="avatar"
        @click="showImg('billImgUrl1')"
        id="billImgUrl1"
        ref="billImgUrl1"
      >
    </div>
    <div v-if="items.billImgUrl2">
      <img
        :src="items.baseUrl+items.billImgUrl2"
        class="avatar"
        @click="showImg('billImgUrl2')"
        id="billImgUrl2"
        ref="billImgUrl2"
      >
    </div>
  </div>
</template>

<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
export default {
  props: ['type', 'userAttachmentList'],
  computed: {
    items: function () {
      let data =
        (this.userAttachmentList &&
          this.userAttachmentList.filter(x => {
            return x.attachmentType === this.type.toString();
          })) ||
        [];
      let basePath = process.env.NODE_ENV !== 'production' ? 'http://10.129.221.229:50100' : 'http://iwdgj.yto56.com.cn:18001/ec-claim';
      return {
        billImgUrl1: (data && data.length > 0) ? data[0].attachmentUrl : '',
        billImgUrl2: (data && data.length > 1) ? data[1].attachmentUrl : '',
        baseUrl: basePath + '/v1/crmComplaintClaimAttachment/getFile?picId='
      };
    }
  },
  data() {
    return {};
  },
  mounted() { },
  methods: {
    showImg(item) {
      if (!item) {
        this.$message({
          type: 'warn',
          message: '文件不存在不能显示'
        });
        return;
      }
      const ref = this.$refs;
      Object.keys(ref).forEach(key => {
        console.log(key, ref[key]);
        const viewer = new Viewer(ref[key]);
        console.log(viewer);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
