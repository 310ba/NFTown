<template>
	<view>
		<image src="../../static/icons/logo.png" mode="heightFix" class="nav-logo"></image>
		<view class="search-box" @click="goToSearch">
			<uni-search-bar :radius="17" bgColor="#ebebeb" cancelButton="none" placeholder="搜索" :readonly="true" />
		</view>

		<swiper vertical="true" class="nft-list" v-if="nftList.length != 0" @change="swiperChange"
			:next-margin="maginNext">
			<swiper-item class="nft-list-item" v-for="(nftItem, i) in nftList" :key="i">
				<my-nftItem-large :nft="nftItem"></my-nftItem-large>
			</swiper-item>
		</swiper>

		<view v-if="nftList.length != 0" class="bg" :style="{backgroundImage: 'url(' + nftList[swiperCurrent].nftPic + ')'}"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nftList: [
				// 	{
				// 	_id: 'ae6587',
				// 	nftPic: '../../static/test/bbb.jpg',
				// 	name: '天马御火',
				// 	span: true,
				// 	price: 900.00,
				// 	upper: '.红猫熊.',
				// 	starNum: 4,
				// },
				],
				id_list: [], //存放id，避免冲突
				//nftList: [],
				swiperCurrent: 0,
				maginNext: "",
				currentWebview: {}
			}
		},
		watch: {
			swiperCurrent(newPic, oldPic) {
        console.log("newPic",newPic);
        console.log("oldPic", oldPic);
				if (newPic === 0) {
          setTimeout(() => {
            this.currentWebview.setStyle({
            	pullToRefresh: {
            		support: true,
            		style: plus.os.name === 'Android' ? 'circle' : 'default'
            	}
            });
          }, 1000)
				} else if (oldPic === 0) {
					this.currentWebview.setStyle({
						pullToRefresh: {
							support: false,
							style: plus.os.name === 'Android' ? 'circle' : 'default'
						}
					});
				}
				if (newPic === this.id_list.length - 1) {
					//触底刷新
					console.log("触底刷新");
					this.more_col_list(this.id_list, 1);
				}
				console.log("监听", newPic)
			}
		},
		async onLoad() {

			////////////
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			this.currentWebview = page.$getAppWebview();
			console.log("this.currentWebview", this.currentWebview);
			////////////
			const db = uniCloud.database();
			const dbCmd = db.command;
			let temp = await db.collection("nftItem").aggregate().match({
				isSaling: true
			}).sample({
				size: 3 //随机选择的图片，数目不足时显示最大数目
			}).end();
			this.nftList = temp.result.data;
			//首次加载的图片id集合
			for (let i = 0; i < this.nftList.length; i++) {
				this.id_list.push(this.nftList[i]._id);
			}
			console.log(this.id_list);

			var Info = uni.getWindowInfo();
			if (Info.windowHeight > 1.2 * Info.windowWidth + 2 * Info.statusBarHeight + 208) {
				this.maginNext = "150px";
			} else {
				this.maginNext = '0px';
			}
		},
		onPullDownRefresh() {
			console.log('onpulldown');
			this.more_col_list(this.id_list, 0);
			uni.stopPullDownRefresh();
		},
		// onShow() {
		// 	console.log("this is onshow");
		// 	if(this.nftList.length != 0){
		// 		const db = uniCloud.database();
		// 		const dbCmd = db.command;
		// 		db.collection("nftItem").doc(this.nftList[this.swiperCurrent]._id).get().then(res => {
		// 			// delete this.nftList[this.swiperCurrent];
		// 			console.log("this.nftList", this.nftList[this.swiperCurrent]); 
				
		// 			// this.nftList[this.swiperCurrent] = res.result.data[0];
		// 			//this.nftList[this.swiperCurrent] = undefined;
		// 			console.log("this.nftList[this.swiperCurrent]", this.nftList[this.swiperCurrent]);
				
		// 		}).catch((err) => {
		// 			console.log(err.message)
		// 		});
		// 	}
		// },
		methods: {
			//下拉刷新调用的函数
			async more_col_list(id_list, flag) {
				const db = uniCloud.database();
				const dbCmd = db.command;
				let temp;
				await db.collection("nftItem").aggregate().match(
					dbCmd.and([{
							_id: dbCmd.nin(id_list)
						},
						{
							isSaling: true
						}
					])
				).sample({
					size: 3 //随机选择的图片，数目不足时显示最大数目
				}).end().then(res => {
					console.log("success");
					temp = res.result.data;
				}).catch(err => {
					console.log(err)
				});
				//图片增加
				console.log("new piclist", temp);
				//下拉
				if (flag === 0) this.nftList = temp.concat(this.nftList);
				//触底
				else this.nftList = this.nftList.concat(temp);
				//已经加载的图片id集合更新
				for (let i = 0; i < temp.length; i++) {
					this.id_list.push(temp[i]._id);
				}

			},
			swiperChange(e) {
				this.swiperCurrent = e.detail.current
			},
			goToSearch() {
				uni.navigateTo({
					url: '/pages/search/search',
					animationType: 'fade-in'
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-font {
		font-family: 'Alimama ShuHeiTi';
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100vh;
		background: fixed center center no-repeat;
		filter: blur(5px);
		transform: scale(1.1);
		overflow: hidden;
		z-index: -1;
		background-size: cover;
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

	.nft-list {
		position: fixed;
		top: 0;
		left: 0;
		width: 700rpx;
		height: 100vh;
		background-color: rgba(255, 255, 255, 0.3);
		padding: 0 25rpx;

		.nft-list-item {
			margin-top: calc(var(--status-bar-height) + 54px);
			border: 10px;
		}
	}
</style>
