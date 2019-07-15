export default {
  methods: {
    setText() {
      setTimeout(() => {
        if (this.timeText >= 0) {
          this.timeText--;
          this.setText();
        }
      }, 1000);
    }
  }
};
