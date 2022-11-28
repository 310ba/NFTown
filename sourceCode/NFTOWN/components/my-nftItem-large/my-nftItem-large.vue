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
        <image class="full-screen" src="../../static/icons/fullScreen.png" mode="aspectFill" @tap.stop="fullScreen($event)">
        </image>
        <view class="item-star">
          <uni-icons type="heart" size="40rpx" color="#fff"></uni-icons>
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
    },
    data() {
      return {

      };
    },
	// onShow() {
	// 	console.log("nftItem :" , this.nft);
	// },
    methods: {
      gotoDetails() {
        if (this.nft !== {}) {
          uni.navigateTo({
            url: '/pages/NFT-details/NFT-details?nft=' + JSON.stringify(this.nft),
            animationType: 'fade-in'
          })
        }
      },
      fullScreen(e) {
        e.preventDefault();
        uni.previewImage({
          // 预览时，默认显示图片的索引
          current: 0,
          // 所有图片 url 地址的数组
          urls: [this.nft.nftPic]
        })
      }
    }
  }
</script>

<style lang="scss">
  .item-box {
    width: 600rpx;
    height: 864rpx;
    padding: 50rpx;
    background-color: #fff;
    border-radius: 10px;

    .item-top {
      position: relative;
      width: 580rpx;
      height: 690rpx;
      border: 10rpx solid #fff;
      background-color: rgb(250, 253, 255);
      box-shadow: 0 0 20rpx #e6eff6, inset 0 0 40rpx #e6eff6;

      .item-span {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 70rpx;
        height: 50rpx;
        font-size: 34rpx;
        text-align: center;
        line-height: 50rpx;
        border-radius: 16rpx 0 0 0;
        color: #fff;
      }

      .item-image {
        position: relative;
        margin: 30rpx 30rpx 0 30rpx;
        width: 520rpx;
        height: 520rpx;

        image {
          width: 520rpx;
          height: 520rpx;
        }

        .full-screen {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 50rpx;
          height: 50rpx;
        }

        .item-star {
          position: absolute;
          display: flex;
          align-items: center;
          top: 0;
          right: 0;
          background: rgba(0, 0, 0, .8);
          padding: 15rpx 20rpx;
          border-radius: 0 0 0 16rpx;
          line-height: 40rpx;

          span {
            margin-left: 10rpx;
            font-size: 30rpx;
            color: #fff;
          }
        }
      }

      .item-name {
        font-size: 34rpx;
        color: rgb(75, 75, 76);
        text-align: left;
        margin: 20rpx 30rpx;
      }

      .item-no {
        position: relative;
        height: 44rpx;
        margin: 0 30rpx;

        .item-no-num {
          position: absolute;
          left: 22rpx;
          height: 44rpx;
          padding: 0 20rpx 0 40rpx;
          border-radius: 10rpx;
          background-color: #2d2d2d;
          background-image: linear-gradient(90deg, #2d2d2d 0%, #414141 100%);
          color: rgb(226, 168, 108);
          font-size: 20rpx;
          line-height: 44rpx;
        }

        .item-no-image {
          position: absolute;
          left: 0;
          height: 44rpx;
          line-height: 44rpx;
        }
      }
    }

    .item-bottom {
      font-size: 26rpx;
      line-height: 60rpx;
      text-align: left;
      color: rgb(153, 154, 155);

      .item-upper {
        position: relative;
        height: 60rpx;
        margin: 26rpx 0;

        .item-upper-details {
          float: right;
          color: rgb(75, 75, 76);

          .item-avatar {
            width: 60rpx;
            height: 60rpx;
            border-radius: 20rpx;
            margin: 0 30rpx 0 0;
          }
        }
      }

      .item-price {
        span {
          float: right;
          font-weight: bold;
          color: rgb(244, 163, 58);
        }
      }
    }
  }
</style>
