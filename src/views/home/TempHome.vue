<template>
  <iframe  :src="homeUrl" height="500" width="100%"></iframe>
</template>

<script>
import netAPI from '@/api';
export default {
  name: 'TempHome',
  data() {
    return {
      homeUrl: ''
    };
  },
  created() {
    this.getAlipayUrl();
  },
  methods: {
    getAlipayUrl() {
      netAPI.openAlipayUrl().then(res => {
        console.log(res);
        this.homeUrl = res;
      });
    }
  }
};
</script>

<style scoped>

</style>
