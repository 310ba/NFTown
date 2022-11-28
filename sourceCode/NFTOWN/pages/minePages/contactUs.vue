<template>
  <view class="box">
    <view class="way">
      <h1>方式1</h1>
      <text>点击下面按钮进行意见反馈</text>
      <button size="mini" type="primary" plain="true" open-type="feedback">意见反馈</button>
    </view>
    <view class="way">
      <h1>方式2</h1>
      <text @click="copyTel()">拨打客服电话: +86 15307155035</text>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      copyTel() {
        uni.setClipboardData({
          data: '15307155035', //要被复制的内容
          success: () => {
            uni.showToast({
              title: "已将客服电话复制到剪贴板",
              icon: 'none'
            })
          }
        });
      },
    }
  }
</script>

<style lang="scss">
  .box {
    
    .way {
      padding: 20rpx;
      font-family: 'Alimama ShuHeiTi';
    
      h1 {
        font-size: 20px;
        padding: 20upx 0;
      }
    
      text {
        margin-left: 2em;
      }
    
      button {
        display: block;
        margin: 10rpx 250rpx;
      }
    }
  }
</style>
