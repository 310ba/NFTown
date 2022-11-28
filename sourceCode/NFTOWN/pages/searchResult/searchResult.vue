<template>
  <view>
    <view style="height: var(--status-bar-height); width: 100%;">
      <!-- 这里是状态栏 -->
    </view>
    <view class="nav-bar">
      <view class="nav-icon">
        <uni-icons color="#000" size="25" type="back" @click="goToSearch" />
      </view>
      <view class="search-box" @click="goToSearch">
        <uni-search-bar :radius="17" bgColor="#ebebeb" cancelButton="none" placeholder="搜索" :readonly="true" />
      </view>
    </view>

    <view class="itemList" v-if="resultList.length !== 0">
      <view class="itemList-item" v-for="(nft, i) in resultList" :key="i">
        <my-nftItem :nft="nft"></my-nftItem>
      </view>
    </view>
    <view class="notFound" v-else>
      
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        resultList: []
      };
    },
    async onLoad(kw) {
      console.log(kw);
      const db = uniCloud.database();
      const dbCmd = db.command;
      await db.collection("nftItem").where({
        //name:/`{$this.kw}`/ig
        name: new RegExp(kw.query, "ig")
      }).limit(10).get().then(res => {
        this.resultList = res.result.data;
      }).then(res => {
        console.log("数据库操作成功", this.resultList);
      }).catch((err) => {
        console.log(err.message)
      });
    },
    methods: {
      goToSearch() {
        uni.navigateBack({
          animationType: 'fade-out'
        })
      },
    }
  }
</script>

<style lang="scss">
  .my-font {
    font-family: 'Alimama ShuHeiTi';
  }

  .notFound {
    position: absolute;
    top: 0;
    left: 200rpx;
    width: 350rpx;
    height: 100vh;
    background: center / contain no-repeat url("../../static/default_pic/empty.png");
    background-size: contain;
  }

  .nav-bar {
    position: relative;
    width: 750upx;
    height: 44px; 

    .nav-icon {
      position: absolute;
      top: 5px;
      left: 20upx;
      height: 34px;
      width: 34px;
      line-height: 34px;
    }

    .search-box {
      position: absolute;
      top: 5px;
      right: 20upx;
      width: 80px;
      height: 34px;
      border-radius: 17px;
      line-height: 34px;
      background-color: #ebebeb;
      overflow: hidden;

      .placeholder {
        font-size: 14px;
        margin-left: 5px;
        color: #cccccc;
      }
    }
  }

  .itemList {
    margin: 15rpx;

    .itemList-item {
      margin: 5rpx;
      display: inline-block;
    }
  }
</style>
