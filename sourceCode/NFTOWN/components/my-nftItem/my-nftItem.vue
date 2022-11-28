<template>
  <view class="item-box" @click="gotoDetails">
    <view class="item-top">
      <view class="item-span" style="background-color: rgb(57, 127, 231);" v-if="nft.span">
        版
      </view>
      <view class="item-span" style="background-color: rgb(187, 144, 228);" v-else>
        衍
      </view>
      <view class="item-image">
        <image :src="nft.nftPic" mode="aspectFill"></image>
        <view class="item-star">
          <uni-icons type="heart" size="25rpx" color="#fff"></uni-icons>
          <span>{{nft.starNum}}</span>
        </view>
      </view>
      <view class="item-name">
        {{nft.name}}
      </view>
      <view class="item-no">
        <view class="item-no-num">
          #{{nft._id}}
        </view>
        <image src="../../static/icons/NO.png" mode="heightFix" class="item-no-image"></image>
      </view>

    </view>

    <view class="item-bottom">
      <view class="item-upper">
        发布者
        <view class="item-upper-details">
          <span>{{nft.upper}}</span>
        </view>

      </view>
      <view class="item-price">
        价格
        <span>￥{{nft.price}}</span>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-nftItem",
    props: {
      // 商品的信息对象
      nft: {
        type: Object,
        defaul: {},
      },
      jump: {
        type: Boolean,
        default: true,
      }
    },
    data() {
      return {

      };
    },
    methods: {
      gotoDetails() {
        if (this.nft !== {} && this.jump) {
          uni.navigateTo({
            url: '/pages/NFT-details/NFT-details?nft=' + JSON.stringify(this.nft),
            animationType: 'fade-in'
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .item-box {
    width: 300rpx;
    height: 432rpx;
    padding: 25rpx;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10rpx #e6eff6;

    .item-top {
      position: relative;
      width: 290rpx;
      height: 345rpx;
      border: 5rpx solid #fff;
      background-color: rgb(250, 253, 255);
      box-shadow: 0 0 10rpx #e6eff6, inset 0 0 20rpx #e6eff6;

      .item-span {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 35rpx;
        height: 25rpx;
        font-size: 17rpx;
        text-align: center;
        line-height: 25rpx;
        border-radius: 8rpx 0 0 0;
        color: #fff;
      }

      .item-image {
        position: relative;
        margin: 15rpx 15rpx 0 15rpx;
        width: 260rpx;
        height: 260rpx;

        image {
          width: 260rpx;
          height: 260rpx;
        }

        .item-star {
          position: absolute;
          display: flex;
          align-items: center;
          top: 0;
          right: 0;
          background: rgba(0, 0, 0, .8);
          padding: 10rpx;
          border-radius: 0 0 0 8rpx;
          line-height: 20rpx;

          span {
            margin-left: 5rpx;
            font-size: 10rpx;
            color: #fff;
          }
        }
      }

      .item-name {
        font-size: 17rpx;
        color: rgb(75, 75, 76);
        text-align: left;
        margin: 13rpx 15rpx;
        line-height: 17rpx;
      }

      .item-no {
        position: relative;
        height: 22rpx;
        margin: 0 15rpx;

        .item-no-num {
          position: absolute;
          left: 11rpx;
          height: 22rpx;
          padding: 0 10rpx 0 20rpx;
          border-radius: 5rpx;
          background-color: #2d2d2d;
          background-image: linear-gradient(90deg, #2d2d2d 0%, #414141 100%);
          color: rgb(226, 168, 108);
          font-size: 10rpx;
          line-height: 22rpx;
          width: 160rpx;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          /*溢出隐藏*/
        }

        .item-no-image {
          position: absolute;
          left: 0;
          height: 22rpx;
          line-height: 22rpx;
        }
      }
    }

    .item-bottom {
      font-size: 13rpx;
      line-height: 30rpx;
      text-align: left;
      color: rgb(153, 154, 155);

      .item-upper {
        position: relative;
        height: 30rpx;
        margin: 13rpx 0;

        .item-upper-details {
          float: right;
          color: rgb(75, 75, 76);

          .item-avatar {
            width: 30rpx;
            height: 30rpx;
            border-radius: 10rpx;
            margin: 0 15rpx 0 0;
          }
        }
      }

      .item-price {
        span {
          float: right;
          font-weight: bold;
          color: #F4A33A;
        }
      }
    }
  }
</style>
