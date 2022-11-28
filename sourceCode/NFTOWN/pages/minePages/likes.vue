<template>
  <view>
    <!-- 购物车商品列表的标题区域 -->
    <view class="star-title">
      <!-- 左侧的图标 -->
      <uni-icons type="heart" size="18"></uni-icons>
      <!-- 描述文本 -->
      <text class="star-title-text">我的喜欢</text>
    </view>
    
    <view class="itemList" v-if="star.length !== 0">
      <view class="itemList-item" v-for="(nft, i) in star" :key="i">
        <my-nftItem :nft="nft"></my-nftItem>
      </view>
    </view>
    
    <view class="emptyBg" v-else></view>
  </view>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    computed: {
      // 将 m_star 模块中的 star 数组映射到当前页面中使用
      ...mapState('m_star', ['star']),
    },
    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style lang="scss">
  .star-title {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;

    .star-title-text {
      margin-left: 10px;
    }
  }
  
  .itemList {
    margin: 15rpx;
    
    .itemList-item {
      margin: 5rpx;
      display: inline-block;
    }
  }
  
  .emptyBg {
    position: fixed;
    width: 750rpx;
    height: 100vh;
    top: 0;
    left: 0;
    background: url("../../static/default_pic/empty.png") no-repeat fixed center;
    background-size: 50% auto;
  }
</style>
