<template>
  <div class="login-wrap">
    <div class="login-container">
      <register-info></register-info>
    </div>
  </div>
</template>

<script>
import RegisterInfo from './components/RegisterInfo';

export default {
  name: 'Register',
  components: {
    RegisterInfo
    // Information
  },
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
