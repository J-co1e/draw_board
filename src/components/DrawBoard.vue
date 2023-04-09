<template>
  <div class="main-border">
    <div class="topTools tools" ref="top" @mouseleave="topLeave">
      <div class="toolsCont">
        <button title="撤回" @click="undo">
          <i class="iconfont icon-undo2"></i>
        </button>
        <button title="取消撤回" @click="redo">
          <i class="iconfont icon-redo1"></i>
        </button>
        <button title="橡皮擦" @click="erase">
          <i class="iconfont icon-xiangpica"></i>
        </button>
        <button title="清空画布" @click="clearCanvas">
          <i class="iconfont icon-15qingkong-1"></i>
        </button>
        <button title="保存" @click="save">
          <i class="iconfont icon-baocun"></i>
        </button>
        <button title="下载" @click="download">
          <i class="iconfont icon-xiazai1"></i>
        </button>
      </div>
      <div class="btn" @mouseenter="topEnter">
        <i class="iconfont icon-gongjuxiang"></i>
      </div>
    </div>
    <div class="leftPics tools" ref="left" @mouseleave="leftLeave">
      <div class="picWalls" v-for="(item, index) in pics" :key="index">
        <img :src="item" alt="" @click="picClick(item)" />
      </div>
      <div class="btn" @mouseenter="leftEnter">
        <i class="iconfont icon-tupian1"></i>
      </div>
    </div>
    <div class="btmTools tools" ref="btm">
      <div class="colors">
        <div class="title">
          <span>画笔颜色</span>
        </div>
        <div class="colorCont">
          <div
            :class="index === colorIndex ? 'color active' : 'color'"
            v-for="(item, index) in colors"
            :key="index"
            :style="{ background: item }"
            @click="changeColor(item, index)"
          ></div>
        </div>
      </div>
      <div class="thick">
        <div class="title">画笔粗细</div>
        <div class="thickCont">
          <div
            :class="thickIndex === 1 ? 'active t1' : 't1'"
            @click="changeThick(1)"
          ></div>
          <div
            :class="thickIndex === 4 ? 'active t2' : 't2'"
            @click="changeThick(4)"
          ></div>
          <div
            :class="thickIndex === 8 ? 'active t3' : 't3'"
            @click="changeThick(8)"
          ></div>
        </div>
      </div>
      <div class="shape">
        <div class="title">画笔形状</div>
        <div class="shapeCont"></div>
      </div>
      <div class="btn" @mouseenter="btmEnter">
        <i class="iconfont icon-huabi_huaban1"></i>
      </div>
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
      strokeStyle: '#000',
      ctx: '',
      colors: [
        '#000000',
        '#f04864',
        '#975fe4',
        '#36cbcb',
        '#fad337',
        '#4ecb73',
        '#3a8ee6',
        '#b2a293',
      ],
      points: [],
      pics: [],
      canvasHistory: [],
      initX: '',
      initY: '',
      step: 0,
      colorIndex: 0,
      thickIndex: 99,
      shapeIndex: 99,
      picIndex: 0,
    }
  },
  methods: {
    init() {
      const canvas = this.$refs.canvas
      this.ctx = canvas.getContext('2d')
      canvas.width = this.$refs.area.clientWidth
      canvas.height = this.$refs.area.clientHeight
      this.ctx.strokeStyle = this.strokeStyle
      this.ctx.lineWidth = 1
      this.thickIndex = 1
      this.ctx.lineJoin = 'round'
      this.canvasHistory.push(canvas.toDataURL())
    },
    mousedown(e) {
      this.isDraw = true
      const x = e.offsetX + 3
      const y = e.offsetY + 28
      this.initX = x
      this.initY = y
      this.ctx.beginPath()
      this.ctx.moveTo(this.initX, this.initY)
      this.points.push({ x, y })
    },
    mousemove(e) {
      if (this.isDraw) {
        const x = e.offsetX + 3
        const y = e.offsetY + 28
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
        this.points.push({ x, y })
      }
    },
    mouseup(e) {
      const canvas = this.$refs.canvas
      this.isDraw = false
      this.ctx.closePath()
      this.step++
      if (this.step < this.canvasHistory.length) {
        this.canvasHistory.length = this.step
      }
      this.canvasHistory.push(canvas.toDataURL())
    },
    undo() {
      if (this.step > 0) {
        this.step--
        const canvas = this.$refs.canvas
        this.ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
        const canvasPic = new Image()
        canvasPic.src = this.canvasHistory[this.step]
        canvasPic.onload = () => {
          this.ctx.drawImage(canvasPic, 0, 0)
        }
      } else {
        this.$message.warning('不能再撤销了')
      }
    },
    redo() {
      if (this.step < this.canvasHistory.length - 1) {
        this.step++
        const canvas = this.$refs.canvas
        this.ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
        const canvasPic = new Image()
        canvasPic.src = this.canvasHistory[this.step]
        canvasPic.onload = () => {
          this.ctx.drawImage(canvasPic, 0, 0)
        }
      } else {
        this.$message.warning('不能再前进了')
      }
    },
    changeColor(color, i) {
      // 更换颜色
      this.strokeStyle = color
      this.ctx.strokeStyle = this.strokeStyle
      this.colorIndex = i
    },
    changeThick(i) {
      // 更换粗细
      this.ctx.lineWidth = i
      this.thickIndex = i
    },
    changeShape() {
      // 更换形状
    },
    clearCanvas() {
      const canvas = this.$refs.canvas
      this.ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      this.step++
      this.canvasHistory.push(canvas.toDataURL())
    },
    save() {
      if (!this.isCanvas) return
      if (this.points.length === 0)
        return this.$message.warning('请先绘画再保存')
      const canvas = this.$refs.canvas
      const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) {
          imageData.data[i] = 255
          imageData.data[i + 1] = 255
          imageData.data[i + 2] = 255
          imageData.data[i + 3] = 255
        }
      }
      this.ctx.putImageData(imageData, 0, 0)
      const url = canvas.toDataURL('image/png')
      this.pics.push(url)
      this.ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    },
    erase() {},
    download() {
      if (this.isCanvas) return this.$message.warning('请先选择一张作品')
      const url = this.pics[this.picIndex]
      const arr = url.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      // 通过以下方式将以上变量生成文件对象，三个参数分别为文件内容、文件名、文件类型
      const file = new File([u8arr], '我的作品', { type: mime })
      const aDom = document.createElement('a')
      aDom.download = file.name // 设置文件名
      let href = URL.createObjectURL(file)
      aDom.href = href
      document.body.appendChild(aDom)
      aDom.click()
      document.body.removeChild(aDom)
      URL.revokeObjectURL(href)
    },
    picClick(item) {
      this.isCanvas = false
      this.imgUrl = item
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style lang="less" scoped>
canvas {
  cursor: url('../assets/pen5.ico'), default;
  background-color: #fff;
}
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
  transition: 0.4s ease;
  .toolsCont {
    width: 75%;
    height: 100%;
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: space-around;
    button {
      width: 3rem;
      height: 3rem;
      cursor: pointer;
      border: 1px solid;
      border-radius: 50%;
      border: none;
      i {
        font-size: 25px;
        color: #666;
      }
      &:hover i {
        color: rgb(86, 199, 156);
      }
      &:hover {
        border: 2px dashed rgb(86, 199, 156);
      }
    }
  }
  .btn {
    position: absolute;
    bottom: -30%;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: red;
    width: 10%;
    height: 30%;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      color: #fff;
      font-size: 23px;
    }
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
  transition: 0.4s ease;
  display: flex;
  flex-direction: column;
  .picWalls {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 5px;
    img {
      cursor: pointer;
      object-fit: scale-down;
      display: block;
      width: 100%;
      height: 20%;
      border: 2px dashed #666;
      margin: 10px 0;
      &:hover {
        border-color: rgb(14, 156, 102);
      }
    }
  }
  .btn {
    position: absolute;
    width: 15%;
    height: 8%;
    background-color: red;
    right: -15%;
    top: 50%;
    transform: translate(0, -50%);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      color: #fff;
      font-size: 28px;
    }
  }
}
.btmTools {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: #fafafa;
  height: 15%;
  width: 40%;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  transition: 0.4s ease;
  display: flex;
  padding: 8px;
  .colors {
    flex: 1;
    border: 1px;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      width: 2px;
      height: 80%;
      background-color: red;
      right: 0;
      top: 60%;
      transform: translate(0, -50%);
    }
    .title {
      text-align: center;
      width: 100%;
      height: 30px;
      font-size: 16px;
      font-weight: 500;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        height: 1px;
        width: 18%;
        background-color: red;
      }
    }
    .colorCont {
      width: 90%;
      height: 80%;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      margin: 0 auto;
      align-content: center;
      justify-content: center;
      .color {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 5px;
        cursor: pointer;
        &:hover {
          transform: scale(1.15);
        }
        &.active {
          outline: 2px dashed rgb(114, 114, 114);
        }
      }
    }
  }
  .thick {
    flex: 1;
    border: 1px;
    height: 100%;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      width: 2px;
      height: 80%;
      background-color: red;
      right: 0;
      top: 60%;
      transform: translate(0, -50%);
    }
    .title {
      text-align: center;
      width: 100%;
      height: 30px;
      font-size: 16px;
      font-weight: 500;
      position: relative;
      margin-bottom: 5px;
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        height: 1px;
        width: 18%;
        background-color: red;
      }
    }
    .thickCont {
      width: 100%;
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: space-around;
      .t1 {
        flex: 1;
        border: 2px dashed #999;
        position: relative;
        width: 70%;
        margin: 5px auto;
        border-radius: 15px;
        cursor: pointer;
        &::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          margin: 0 auto;
          height: 2px;
          background-color: #666;
        }
        &:hover {
          border-color: rgb(144, 212, 186);
        }
        &.active {
          border-color: rgb(14, 156, 102);
        }
      }
      .t2 {
        flex: 1;
        border: 2px dashed #999;
        position: relative;
        width: 70%;
        margin: 5px auto;
        border-radius: 15px;
        cursor: pointer;
        &::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          margin: 0 auto;
          height: 5px;
          background-color: #666;
        }
        &:hover {
          border-color: rgb(144, 212, 186);
        }
        &.active {
          border-color: rgb(14, 156, 102);
        }
      }
      .t3 {
        flex: 1;
        border: 2px dashed #999;
        position: relative;
        width: 70%;
        margin: 5px auto;
        border-radius: 15px;
        cursor: pointer;
        &::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          margin: 0 auto;
          height: 10px;
          background-color: #666;
        }
        &:hover {
          border-color: rgb(144, 212, 186);
        }
        &.active {
          border-color: rgb(14, 156, 102);
        }
      }
    }
  }
  .shape {
    flex: 1;
    border: 1px;
    height: 100%;
    background-color: #9cb0e7;
    .title {
      text-align: center;
      width: 100%;
      height: 30px;
      font-size: 16px;
      font-weight: 500;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        bottom: -1%;
        left: 50%;
        transform: translate(-50%, 0);
        height: 1px;
        width: 18%;
        background-color: red;
      }
    }
  }
  .btn {
    position: absolute;
    background-color: red;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    width: 10%;
    height: 18%;
    top: -18%;
    left: 50%;
    transform: translate(-50%, 0);
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      color: #fff;
      font-size: 28px;
    }
  }
}
</style>
