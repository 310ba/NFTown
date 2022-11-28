<template>
  <view>
    <view style="height: calc(var(--status-bar-height) + 44px); width: 100%;">
      <!-- 这里是状态栏 -->
    </view>
    <image src="../../static/icons/logo.png" mode="heightFix" class="nav-logo"></image>
    <view class="search-box" @click="goToSearch()">
      <uni-search-bar @confirm="" @input="" :radius="17" bgColor="#ebebeb" cancelButton="none" placeholder="搜索"
        :readonly="true" />
    </view>

    <swiper :autoplay="true" :circular="true" autoplay="true" class="swiper-box">
      <swiper-item v-for="(item, i) in boardList" :key="i" @click="checkTop(i+1)">
        <view class="swiper-item">
          <image :src="item.nftPic" mode="aspectFit"></image>
        </view>
      </swiper-item>
    </swiper>

    <view class="board-box">
      <h1 class="my-font">热门NFT</h1>
      <view class="list">
        <view v-for="item in 5" class="top-item" :key="item" @click="checkTop(item)">
          <span class="no my-font" :class="'rank-' + item">{{ item }}</span>
          <span class="name my-font" v-if="boardList.length >= item">{{boardList[item-1].name}}</span>
          <span class="name my-font" v-else>-</span>
        </view>
      </view>
      <view class="list">
        <view v-for="item in 5" class="top-item" :key="item" @click="checkTop(item+5)">
          <span class="no my-font" :class="'rank-' + (item + 5)">{{ item + 5 }}</span>
          <span class="name my-font" v-if="boardList.length >= (item + 5)">{{boardList[item+4].name}}</span>
          <span class="name my-font" v-else>-</span>
        </view>
      </view>
    </view>

    <view class="button-box">
      <view class="button my-font" @click="jmp('upload')">
        上传NFT
      </view>
      <view class="button my-font" @click="jmp('sale')">
        出售NFT
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        boardList: []
      };
    },
    async onLoad() {
      //获取喜欢数前十的nft
      /*this.boardList = [{
        _id: 'ae6587',
        nftPic: '../../static/test/bbb.jpg',
        name: '天马御火',
        span: true,
        price: 900.00,
        upper: '.红猫熊.',
        starNum: 4,
      }, {
        _id: 'a34211111',
        nftPic: '../../static/test/ccc.jpg',
        name: '兽曰穷奇',
        span: true,
        price: 1312,
        upper: '灵异传导体',
        starNum: 3734,
      }, {
        _id: 'asdfz234',
        nftPic: '../../static/test/ddd.jpg',
        name: '大漠孤烟',
        span: true,
        price: 1.87,
        upper: '.红猫熊. ',
        starNum: 3,
      }, {
        _id: 'kk12314',
        nftPic: '../../static/test/aaa.gif',
        name: '双峰插云',
        span: false,
        price: 21.77,
        upper: '西湖十景',
        starNum: 124,
      }]*/
	  
	  const db = uniCloud.database();
	  const dbCmd = db.command;
	  await db.collection("nftItem").where({
      isSaling:true
    }).orderBy("starNum desc, price desc").limit(10).get()
	  .then(res=>{
	  	console.log("len:",res.result.data.length);
	  	for(let i=0;i<res.result.data.length;i++) 
	  	{
	  		this.boardList.push(res.result.data[i]);
	  	}
	  }).then(res => {
	  	console.log("数据库操作成功", res)
	  }).catch((err) => {
	  	console.log(err.message)
	  });
	  
	  
    },
    methods: {
      jmp(page) {
        uni.navigateTo({
          url: `/pages/tradePages/${page}`,
          animationType: "fade-in"
        })
      },
      goToSearch() {
        uni.navigateTo({
          url: '/pages/search/search',
          animationType: 'fade-in'
        })
      },
      checkTop(item) {
        if (this.boardList.length >= item) {
          uni.navigateTo({
            url: '/pages/NFT-details/NFT-details?nft=' + JSON.stringify(this.boardList[item - 1]),
            animationType: 'fade-in'
          })
        }
      }
	  
    }
  }
</script>

<style lang="scss">
  .my-font {
    font-family: 'Alimama ShuHeiTi';
  }

  .nav-logo {
    position: fixed;
    top: calc(var(--status-bar-height) + 5px);
    left: 20rpx;
    height: 34px;
    z-index: 999;
  }

  .search-box {
    position: fixed;
    top: calc(var(--status-bar-height) + 5px);
    right: 20rpx;
    width: 80px;
    height: 34px;
    line-height: 34px;
    z-index: 999;
  }

  .swiper-box {
    height: 400rpx;
    margin: 20rpx 0;
    overflow: hidden;
    // background-color: rgb(0, 0, 0);
    /* 兼容IOS，否则在swiper组件内的布局都不受border-radius和overflow的约束 */
    transform: translateY(0);

    .swiper-item{
      margin: 0 20rpx;
      width: 710rpx;
      height: 100%;
    }
    
    image {
      width: 710rpx;
      height: 100%;
    }
  }

  .board-box {
    margin: 20rpx;
    padding: 20rpx;
    background-color: white;
    border-radius: 5px;

    h1 {
      font-size: 46rpx;
      margin: 10rpx 0 20rpx;
    }

    .list {
      display: inline-block;
      width: 335rpx;
      font-size: 30rpx;

      .top-item {
        position: relative;
        height: 64rpx;
        width: 335rpx;
        margin: 10rpx 0;

        .no {
          position: absolute;
          left: 0;
          top: 0;
          width: 44rpx;
          height: 44rpx;
          margin: 10rpx;
          text-align: center;
        }

        .name {
          position: absolute;
          left: 84rpx;
          top: 0;
          height: 64rpx;
          line-height: 64rpx;
          display: -webkit-box;
          /*弹性伸缩盒子模型显示*/
          -webkit-box-orient: vertical;
          /*排列方式*/
          -webkit-line-clamp: 1;
          /*显示文本行数(这里控制多少行隐藏)*/
          overflow: hidden;
          /*溢出隐藏*/
        }

        @for $i from 1 through 10 {

          /*前5条*/
          @if $i <=5 {
            .rank-#{$i} {
              color: #fff;
              border-radius: 22rpx;
              line-height: 44rpx;
              background-color: rgba(106, 152, 255, (11-$i)/10);
            }
          }

          /*后5条*/
          @if $i>5 {
            .rank-#{$i} {
              line-height: 44rpx;
              color: rgba(106, 152, 255, (16-$i)/10);
            }
          }
        }
      }
    }
  }

  .button-box {
    backdrop-filter: blur(20px);
    position: fixed;
    bottom: 0;
    width: 750rpx;
    height: 50px;
    display: flex;
    background-color: rgba(0, 0, 0, .5);
    z-index: 100;

    .button {
      color: #cccccc;
      width: 375rpx;
      margin: 10px 0;
      text-align: center;
      line-height: 30px;
      border-right: 1rpx solid rgba(255, 255, 255, .2);
      z-index: 101;
    }

    .button:last-child {
      border-left: 1rpx solid rgba(255, 255, 255, .2);
    }
  }
</style>
