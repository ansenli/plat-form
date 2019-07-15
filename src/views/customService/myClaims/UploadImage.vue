<template>
  <div class="img_box">
    <slot></slot>
    <div v-if="!billImgUrl1">
      <el-upload
        class="avatar-uploader"
        :action="baseUrl"
        :data="{reportVipId: userId}"
        :show-file-list="false"
        :http-request="fileUpload"
      >
        <img :src="defaultImg" class="avatar">
      </el-upload>
    </div>
    <div v-else>
      <img
        :src="billImgUrl1"
        :id="billId1"
        :type="type"
        @click="showImg('billRealImageUrl1')"
        ref="'billRealImageUrl1'"
      >
      <i class="el-icon-delete" @click="removeImage(billId1)"></i>
    </div>
    <div v-if="billImgUrl1">
      <div v-if="!billImgUrl2">
        <el-upload
          class="avatar-uploader"
          :action="baseUrl"
          :data="{reportVipId: userId}"
          :show-file-list="false"
          :http-request="fileUpload"
        >
          <img :src="defaultImg" class="avatar">
        </el-upload>
      </div>
      <div v-else>
        <img
          :src="billImgUrl2"
          :id="billId2"
          :type="type"
          @click="showImg('billRealImageUrl2')"
          ref="'billRealImageUrl2'"
        >
        <i class="el-icon-delete" @click="removeImage(billId2)"></i>
      </div>
  </div>
  </div>
</template>

<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
export default {
  props: ['type', 'userAttachmentList', 'baseUrl', 'mobile'],
  computed: {
    userId() {
      return this.$store.state.user.userId;
    }
  },
  data() {
    return {
      billImgUrl1: '',
      billImgUrl2: '',
      billId1: '',
      billId2: '',
      defaultImg: '../../../../static/img/userclaim.png'
    };
  },
  created() {
    this.initData();
  },
  updated() {
    this.initData();
  },
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
    },
    initData() {
      let items =
        (this.userAttachmentList &&
          this.userAttachmentList.filter(x => {
            return x.attachmentType === this.type;
          })) ||
        [];
      this.billImgUrl1 = items.length > 0 ? items[0].attachmentUrl : '';
      this.billId1 = items.length > 0 ? items[0].id : '';
      this.billImgUrl2 = items.length > 1 ? items[1].attachmentUrl : '';
      this.billId2 = items.length > 1 ? items[1].id : '';
    },
    removeImage(id) {
      this.$emit('remove-image', id);
    },
    fileUpload(item) {
      this.$emit('file-upload', item, this.type);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
