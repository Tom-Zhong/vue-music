<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}" :key="item"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// 2017年1月5日完成轮播图的代码书写，使用的是BScroll版本号为^1.7.2
// 其中还是用到了一些常用的dom操作，例如查找和删除class的正则判断
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'
export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    },
    autoPlay: {
      type: Boolean,
      default: true
    }
  },
  // 装载完成
  mounted () {
    // 延迟加载
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      // 需要激活自动播放
      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    // 对视窗变化进行响应
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    // 设置轮播图宽度
    _setSliderWidth (isResize) {
      // 获取轮播图组的dom的children
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      // 视窗变化不用再计算宽度
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化轮播图
    _initSlider () {
      // 生成轮播图
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        bounce: false,
        click: false
      })
      // 控制小白点的active
      this.slider.on('scrollEnd', () => {
        // 返回滚动到第几张图片，位置是按照数组的位置来的
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    // 生成图标点
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    // 播放
    _play () {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  // 被激活以后
  activated () {
    if (!this.slider) {
      return
    }
    this.slider.enable()
    let pageIndex = this.slider.getCurrentPage().pageX
    this.slider.goToPage(pageIndex, 0, 0)
    this.currentPageIndex = pageIndex
    if (this.autoPlay) {
      this._play()
    }
  },
  // 被闲置以后
  deactivated () {
    this.slider.disable()
    clearTimeout(this.timer)
  },
  // 被销毁前
  beforeDestroy () {
    this.slider.disable()
    clearTimeout(this.timer)
  },
  // 组件被销毁
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>