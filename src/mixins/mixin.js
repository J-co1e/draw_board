const myMixin = {
  methods: {
    topEnter () {
      this.$refs.top.style.transform = 'translate(-50%, 0)'
    },
    topLeave () {
      this.$refs.top.style.transform = 'translate(-50%, -100%)'
    },
    leftEnter () {
      this.$refs.left.style.transform = 'translate(0,-50%)'
    },
    leftLeave () {
      this.$refs.left.style.transform = 'translate(-100%,-50%)'
    },
    btmEnter () {
      this.$refs.btm.style.transform = 'translate(-50%, 0)'
    },
    btmLeave () {
      this.$refs.btm.style.transform = 'translate(-50%, 100%)'
    }
  }
}
export default myMixin