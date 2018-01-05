<template>
  <div class="recommend">
      <!-- 滚动的scroll组件 -->
      <scroll ref="scroll" class="recommend-content" :data="discList">
        <div>
          <div v-if="recommends.length" class="slider-wrapper">
          <!-- 这里一定要注意，轮播图取图是异步的，所以要用if判断拿到补数据以后才开始渲染 -->
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <!-- 添加needsclick不让fastclick拦截点击 -->
                <img class="needsclick" :src="item.picUrl" @load="loadImage" >
              </a>
            </div>
          </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li v-for="(item, index) in discList" :key="index" class="item">
                <div class="icon">
                  <!-- 使用vue-lazyload实现懒加载 -->
                  <img v-lazy="item.cover" width="60" height="60">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.rcmdcontent"></h2>
                  <p class="desc" v-html="item.username"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="laoding-contanier" v-show="!discList.length">
          <loading></loading>
        </div>
      </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
export default {
  data () {
    return {
      recommends: [], // 轮播图数据
      discList: [] // 推荐歌单数据
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    // 获取首页推荐数据
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        } else {
          console.error('can not get the message of the sliders!')
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.recomPlaylist.data)
          this.discList = res.recomPlaylist.data.v_hot
        }
      })
    },
    loadImage () {
      // 只要有一张图片就能撑开了，就不用重复计算了
      if (!this.checkLoaded) {
        console.log('loading more img')
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
  // 注册组件
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 33.3%;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            // margin-bottom: 10px;
            font-size: 18px;
            line-height: 26px;
            color: $color-text;
          }

          .desc {
            // color: $color-text-d;
            color: #999;
            font-size: 13px;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>