<template>
  <view>
    <view style="height: calc(var(--status-bar-height) + 44px); width: 100%;">
      <!-- 这里是状态栏 -->
    </view>

   <view class="user-info-box" v-if="hasLogin" @click="jumpToUserHouse()">
      <image class="avatar" v-if="userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url">
      </image>
      <image v-else class="avatar" src="../../static/default_pic/avatar.png" mode="aspectFit"></image>
      <view class="user-info name my-font">
        {{userInfo.nickname||userInfo.username||userInfo.mobile}}
      </view>
      <view class="user-info icon">
        <u-icon name="home-fill" size="20"></u-icon>
      </view>
    </view>

    <view class="user-info-box" @click="switchLogin" v-else>
      <image class="avatar" src="../../static/default_pic/avatar.png" mode="aspectFit"></image>
      <view class="user-info name my-font">
        登录入住NFT小镇
      </view>
      <view class="user-info icon">
        <uni-icons type="arrowright" size="20"></uni-icons>
      </view>
    </view>

    <!-- 面板的列表区域 -->
    <view class="panel-list">
      <!-- 第二个面板 -->
      <view class="panel">
        <!-- 面板的主体 -->
        <view class="panel-body">
          <!-- 面板主体中的 item 项 -->
          <view class="panel-item" @click="jumpTo('likes')">
            <uni-icons type="heart" size="30" color=""></uni-icons>
            <text class="my-font">我的喜欢</text>
          </view>
          <view class="panel-item" @click="jumpTo('collect')">
            <uni-icons type="wallet-filled" size="30" color=""></uni-icons>
            <text class="my-font">我的收藏</text>
          </view>
          <view class="panel-item" @click="jumpTo('onSale')">
            <uni-icons type="shop-filled" size="30" color=""></uni-icons>
            <text class="my-font">我的在售</text>
          </view>
        </view>
      </view>

      <view class="panel">
        <view class="panel-list-item">
          <view class="panel-list-item-left" @click="jumpTo('searchNFT')">
            <uni-icons type="search" size="23"></uni-icons>
            <span class="my-font">区块链信息查询</span>
          </view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="jumpTo('contactUs')">
          <view class="panel-list-item-left">
            <uni-icons type="chatboxes" size="23"></uni-icons>
            <span class="my-font">联系我们</span>
          </view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="jumpTo('aboutUs')">
          <view class="panel-list-item-left">
            <uni-icons type="info" size="23"></uni-icons>
            <span class="my-font">关于NFTOWN</span>
          </view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>

      <view class="panel">
        <view class="panel-list-item" @click="jumpTo('setting')">
          <view class="panel-list-item-left">
            <uni-icons type="gear" size="23"></uni-icons>
            <span class="my-font">设置</span>
          </view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
  import {
    store,
    mutations
  } from '@/uni_modules/uni-id-pages/common/store.js';

  export default {
    data() {
      return {
        autoStatus: true,
      };
    },
    computed: {
      userInfo() {
        return store.userInfo
      },
      hasLogin() {
        return store.hasLogin
      },
    },
    onLoad() {
      console.log(this.userInfo)
    },
    methods: {
      switchLogin() {
        uni.navigateTo({
          url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        })
      },
      jumpTo(pageName) {
        uni.navigateTo({
          url: `/pages/minePages/${pageName}`,
        })
      },
      jumpToUserHouse() {
        uni.navigateTo({
          url: "/pages/userHouse/userHouse?type=0"
        })
      }
    },
  }
</script>

<style lang="scss">
  page {
    background: #f5f5f5 url("../../static/default_pic/accontBg.png") top no-repeat fixed;
    background-size: contain;
  }

  .my-font {
    font-family: 'Alimama ShuHeiTi';
  }

  .user-info-box {
    height: 120rpx;
    background-color: #fff;
    position: relative;
    margin: calc(170rpx - var(--status-bar-height)) 20rpx 20rpx 20rpx;
    border-radius: 10px;

    .avatar {
      position: absolute;
      background-color: #dddddd;
      height: 80rpx;
      width: 80rpx;
      top: 20rpx;
      left: 40rpx;
      border-radius: 40rpx;
      box-shadow: 0 0 3px #4f4f4f;
    }

    .user-info {
      position: absolute;
      top: 20rpx;
      height: 80rpx;
      line-height: 80rpx;
    }

    .name {
      left: 160rpx;
      width: 400rpx;
      font-size: 15px;
      font-weight: bold;
      color: #4f4f4f;
    }

    .icon {
      float: right;
      right: 40rpx;
      display: flex;
      justify-content: center;
    }
  }

  .panel-list {
    padding: 0 20rpx;
    position: relative;

    .panel {
      background-color: white;
      border-radius: 10px;
      margin-bottom: 20rpx;

      .panel-list-item {
        height: 7vh;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 20rpx;
        padding: 0 20rpx;
        border-bottom: #f4f4f4 1px solid;

        .panel-list-item-left {
          height: 7vh;
          position: relative;
          line-height: 7vh;

          span {
            position: absolute;
            left: 28px;
            top: 3.5vh;
            line-height: 40rpx;
            margin-top: -20rpx;
            width: 400rpx;
            font-size: 14px;
          }
        }
      }

      .panel-list-item:last-child {
        border-bottom: none;
      }

      .panel-body {
        display: flex;
        justify-content: space-around;

        .panel-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          font-size: 13px;
          padding: 25rpx 0;

          text {
            margin-top: 10rpx;
          }
        }
      }
    }
  }
</style>
