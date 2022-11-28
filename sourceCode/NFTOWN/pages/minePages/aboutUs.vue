<template>
  <view>
    <view class="top-box">
      <image src="../../static/icons/appIcon.jpg" mode="aspectFill"></image>
      <text class="appName my-font">NFTOWN</text>
      <text class="appVer my-font">V 1.0.0</text>
    </view>
    <view class="bottom-box">
      <view class="panel-list-item" @click="jumpToGit()">
        <span class="my-font">前往github仓库</span>
        <uni-icons type="arrowright" size="15"></uni-icons>
      </view>

      <view class="panel-list-item" @click="jumpToOfficial()">
        <span class="my-font">前往NFTOWN官网</span>
        <uni-icons type="arrowright" size="15"></uni-icons>
      </view>
    </view>
    <span class="copyRight">Copyright &copy; 2022 HUST CS2007 310. All Rights Reversed</span>
  </view>
</template>

<script>
  export default {
    data() {
      return {

      };
    },
    methods: {
      jumpToGit() {
        let url = 'https://github.com/310ba/NFTown'
        uni.navigateTo({
          url: '/pages/webView/webView?url=' + url,
          success(res) {
            console.log(res)
          },
          fail(res) {
            console.log(res)
          }
        })
      },
      jumpToOfficial() {
        uni.navigateTo({
          url: '/pages/webView/webview?url=' + 'https://github.com/310ba/NFTown'
          // page.json定义的路径 传url 到webview界面去接收 实现跳转
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-font {
    font-family: 'Alimama ShuHeiTi';
  }

  .top-box {
    position: relative;
    width: 750rpx;
    height: 45vh;

    image {
      position: absolute;
      top: 150rpx;
      left: 275rpx;
      width: 200rpx;
      height: 200rpx;
      border-radius: 10px;
    }

    .appName {
      position: absolute;
      top: 375rpx;
      left: 275rpx;
      width: 200rpx;
      text-align: center;
    }

    .appVer {
      position: absolute;
      top: 425rpx;
      left: 275rpx;
      width: 200rpx;
      text-align: center;
      font-size: 10px;
      color: #b4b4b4;
    }
  }

  .bottom-box {
    // position: ;
    width: 750rpx;
    height: 50vh;

    .panel-list-item {
      background-color: white;
      border-radius: 10px;
      margin: 20rpx 10rpx;
      height: 8vh;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40rpx;
      font-size: 13px;
    }
  }

  .copyRight {
    position: absolute;
    color: #b4b4b4;
    bottom: 2vh;
    width: 750upx;
    text-align: center;
    font-size: 8px;
  }
</style>
