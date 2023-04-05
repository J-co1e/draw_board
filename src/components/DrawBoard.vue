<template>
  <div class="main-border">
    <div class="topTools tools" ref="top" @mouseleave="topLeave">
      <div class="btn" @mouseenter="topEnter"></div>
    </div>
    <div class="leftPics tools" ref="left" @mouseleave="leftLeave">
      <div class="btn" @mouseenter="leftEnter"></div>
    </div>
    <div class="btmTools tools" ref="btm" @mouseleave="btmLeave">
      <div class="btn" @mouseenter="btmEnter"></div>
    </div>
    <div class="drawArea" v-show="isCanvas" ref="area">
      <canvas
        ref="canvas"
        @mousedown="mousedown($event)"
        @mousemove="mousemove($event)"
        @mouseup="mouseup($event)"
      ></canvas>
    </div>
    <div class="picArea" v-show="!isCanvas">
      <img :src="imgUrl" alt="" />
    </div>
  </div>
</template>

<script>
import myMixin from '@/mixins/mixin.js'
export default {
  mixins: [myMixin],
  data() {
    return {
      isDraw: false,
      isLine: false,
      isCanvas: true,
      imgUrl: '',
      ctx: '',
      points: [],
      initX: '',
      initY: '',
      times: 0,
    }
  },
  methods: {
    init() {
      const canvas = this.$refs.canvas
      this.ctx = canvas.getContext('2d')
      canvas.width = this.$refs.area.offsetWidth
      canvas.height = this.$refs.area.offsetHeight
    },
    mousedown(e) {
      this.isDraw = true
      const x = e.clientX - 20
      const y = e.clientY - 20
      this.initX = x
      this.initY = y
    },
    mousemove(e) {
      if (this.isDraw) {
        const x = e.clientX - 20
        const y = e.clientY - 20
      }
      if (this.isLine) {
        const x = e.clientX - 20
        const y = e.clientY - 20
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
        this.ctx.closePath()
      }
      // const x = e.clientX
      // const y = e.clientY
      // this.ctx.lineTo(x, y)
      // this.ctx.stroke()
    },
    mouseup(e) {
      this.times++
      this.isDraw = false
      this.isLine = true
      this.ctx.beginPath()
      this.ctx.moveTo(this.initX, this.initY)
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style lang="less" scoped>
.main-border {
  width: 100%;
  height: 100%;
  background-color: antiquewhite;
  position: relative;
  overflow: hidden;
}
.tools {
  box-shadow: 0 0 10px #d1d1d1;
  z-index: 999;
}
.drawArea {
  width: 98%;
  height: 97%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px 3px #d1d1d1;
}
.picArea {
  width: 98%;
  height: 97%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 0 0 10px 3px #d1d1d1;
  border-radius: 5px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.topTools {
  position: absolute;
  top: 0;
  width: 30%;
  height: 10%;
  left: 50%;
  transform: translate(-50%, -100%);
  background-color: #fff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  transition: 0.3s ease;
  .btn {
    position: absolute;
    bottom: -15%;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: red;
    width: 10%;
    height: 15%;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}
.leftPics {
  position: absolute;
  left: 0;
  height: 75%;
  width: 10%;
  top: 50%;
  transform: translate(-100%, -50%);
  background-color: #fff;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  transition: 0.3s ease;
  .btn {
    position: absolute;
    width: 10%;
    height: 7%;
    background-color: red;
    right: -10%;
    top: 50%;
    transform: translate(0, -50%);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}
.btmTools {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 100%);
  background-color: #fff;
  height: 13%;
  width: 40%;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  transition: 0.3s ease;
  .btn {
    position: absolute;
    background-color: red;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    width: 10%;
    height: 12%;
    top: -12%;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>
