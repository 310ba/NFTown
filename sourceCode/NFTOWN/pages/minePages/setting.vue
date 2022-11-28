<template>
  <view>
    <view class="panel-list">
      <view class="panel">
        <view class="panel-list-item" @click="jumpTo('userinfo/userinfo')">
          <span class="my-font">账号设置</span>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="jumpTo('retrieve/retrieve')">
          <span class="my-font">重置密码</span>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="jumpTo('userinfo/bind-mobile/bind-mobile')">
          <span class="my-font">绑定手机号码</span>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
      <view class="panel" style="color: red;" v-if="hasLogin">
        <view class="panel-list-item" @click="logOut()">
          <span class="my-font">退出登录</span>
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
  } from '@/uni_modules/uni-id-pages/common/store.js'
  export default {
    data() {
      return {
        hasPwd: true
      };
    },
    computed: {
      hasLogin() {
        return store.hasLogin
      },
    },
    async show() {
      const uniIdCo = uniCloud.importObject('uni-id-co')
      this.hasPwd = await uniIdCo.getAccountInfo().isPasswordSet
      console.log(this.hasPwd)
    },
    methods: {
      jumpTo(pageName) {
        if (this.hasLogin) {
          uni.navigateTo({
            url: `/uni_modules/uni-id-pages/pages/${pageName}`,
          });
        }
        else uni.showToast({
          title: "登录入住NFT小镇",
          icon: 'none'
        })
      },
      async logOut() {
        if (this.hasLogin) {
          await mutations.logout()
          uni.navigateBack()
        }
      }
    }
  }
</script>

<style lang="scss">
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
      }

      .panel-list-item:last-child {
        border-bottom: none;
      }
    }
  }
</style>
