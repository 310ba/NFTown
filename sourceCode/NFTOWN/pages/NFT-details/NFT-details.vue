<template>
	<view>
		<view class="bg" :style="{backgroundImage: 'url(' + nft.nftPic + ')'}"></view>
		<view class="nav-icon">
			<uni-icons color="#fff" size="25" type="back" @click="navBack" />
		</view>
		<image class="details-nftPic" :src="nft.nftPic" mode="widthFix" @click="preview()"></image>

		<view class="nft-upper-box" @click="jumpToUserHouse()">
      <image class="nft-upper-avatar" v-if="upper_info.avatar_file&&upper_info.avatar_file.url" :src="upper_info.avatar_file.url" mode="aspectFit">
      </image>
      <image v-else class="nft-upper-avatar" src="../../static/default_pic/avatar.png" mode="aspectFit"></image>
			<span class="nft-upper-name my-font">{{upper_info.nickname||upper_info.username||upper_info.mobile}}</span>
			<span class="nft-upper-createNum">收藏 {{collectNum}}</span>
			<span class="nft-upper-button my-font">进入TA的小屋</span>
		</view>

		<view class="nft-details-box">
			<view class="nft-info-body">
				<!-- 商品名称 -->
				<view class="nft-name my-font">{{nft.name}}</view>
				<!-- 收藏 -->
				<view class="favi" @click="clickStar()">
					<view :animation="animationData">
						<uni-icons v-if="!has_Star" type="heart" size="18" color="gray"></uni-icons>
						<uni-icons v-else type="heart-filled" size="18" color="red"></uni-icons>
					</view>
					<text>{{nft.starNum}}</text>
				</view>
			</view>

			<view class="item-no">
				<view class="item-no-num my-font">
					#{{nft._id}}
				</view>
				<image src="../../static/icons/NO.png" mode="heightFix" class="item-no-image"></image>
			</view>

			<view class="center">
				<view class="nft-arrt">
					<view class="">
						<h1>权益属性</h1>
						<p v-if="nft.span">版权品</p>
						<p v-else>衍生品</p>
					</view>
					<view class="">
						<h1>出售者</h1>
						<p>{{nft.owner}}</p>
					</view>
					<view class="">
						<h1>发布者</h1>
						<p>{{nft.upper}}</p>
					</view>
				</view>
			</view>

			<view class="nft-detail my-font">
        <mp-html :content="nft.detail"></mp-html>
			</view>
		</view>
		<view></view>
		<view class="nav">
			<uni-goods-nav :price="nft.price" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		mapMutations
	} from 'vuex';
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js';

	export default {
		computed: {
			// 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
			// ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
			...mapState('m_star', ['star']),
			userInfo() {
				return store.userInfo
			},
			hasLogin() {
				return store.hasLogin
			},
		},
		data() {
			return {
        collectNum: 0,
				owner_id: 0,
				upper_info: {},
				starClicked: true,
				animationData: {},
				has_Star: false,
				nft: {},
				options: [{
					icon: 'heart',
					text: '我的喜欢',
					info: 0
				}],
				buttonGroup: [{
					text: '立即购买',
					color: '#fff'
				}]
			}
		},
		onLoad(e) {
			this.nft = JSON.parse(e.nft)
			console.log("this.nft", this.nft);

			uniCloud.callFunction({
				name: "get_user",
				data: {
					user_id: this.nft.upper_id
				}
			}).then(res => {
				this.upper_info = res.result.data[0]
        console.log(this.upper_info)
        this.collectNum = this.upper_info.collection_list.length
			}).catch((err) => {
				console.log(err.message)
			});

			if (this.nft.owner_id === this.userInfo._id) {
				if (this.nft.isSaling === true) {
					this.buttonGroup[0].text = '取消出售'
				} else {
					this.buttonGroup[0].text = '确认出售'
				}
			}
			this.has_Star = (this.star.find((x) => x._id === this.nft._id) !== undefined)

		},
		onShow() {
			var animation = uni.createAnimation({
				duration: 500,
				timingFunction: 'ease',
			})
			this.animation = animation,
				this.starClicked = false
		},
		methods: {
			...mapMutations('m_star', ['addStar', 'removeStarById']),
			onClick(e) {
				console.log('onclick', this.nft);



				let pages = getCurrentPages();
				console.log(pages[pages.length - 1].toString())
				if (this.hasLogin) uni.navigateTo({
					url: "/pages/minePages/likes"
				})
				else uni.navigateTo({
					url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
				})
			},
			buttonClick(e) {
				if (this.buttonGroup[0].text === '取消出售') {
					uniCloud.callFunction({
						name: "upadte_issaling",
						data: {
							_id: this.nft._id,
							isSaling: false //修改为未出售
						}
					}).then(res => {
						console.log("数据库操作成功", res)
					}).catch((err) => {
						console.log(err.message)
					});
				} else if (this.buttonGroup[0].text === '确认出售') {
					uniCloud.callFunction({
						name: "upadte_issaling",
						data: {
							_id: this.nft._id,
							isSaling: true //修改为正在出售
						}
					}).then(res => {
						console.log("数据库操作成功", res)
					}).catch((err) => {
						console.log(err.message)
					});
				} else {
					//交易
					const db = uniCloud.database();
					const dbCmd = db.command;
					//await db.collection("nftItem").remove();
					db.collection("nftItem").doc(this.nft._id).field("isSaling").get()
						.then(res => {
							console.log("isSaling", res.result.data[0].isSaling)
							if (res.result.data[0].isSaling === false)
								uni.showToast({
									title: "售罄",
									icon: 'error'
								})
							else uniCloud.callFunction({
								name: "transaction",
								data: {
									buyer_name: this.userInfo.nickname,
									buyer_id: this.userInfo._id,
									seller_id: this.nft.owner_id,
									product_id: this.nft._id,
									product_price: this.nft.price
								}
							}).then(res => {
								console.log("交易成功", res)
							}).catch((err) => {
								console.log("error", err.message)
							});
						}).catch((err) => {
							console.log("error", err.message)
						});
				}
			},
			jumpToUserHouse() {
				uni.navigateTo({
					url: '/pages/userHouse/userHouse?type=1&user=' + JSON.stringify(this.upper_info),
				})
			},
			navBack() {
				uni.navigateBack({
					animationType: 'fade-out'
				})
			},
			preview() {
				uni.previewImage({
					// 预览时，默认显示图片的索引
					current: 0,
					// 所有图片 url 地址的数组
					urls: [this.nft.nftPic]
				})
			},
			clickStar() {
				const db = uniCloud.database();
				const dbCmd = db.command;

				if (!this.starClicked) {
					this.starClicked = true
					if (this.hasLogin) {
						this.animation.scale(1.1).step().scale(0.9).step().scale(1).step()
						this.animationData = this.animation.export()
						if (this.has_Star) {
							this.removeStarById(this.nft._id)
							this.has_Star = false
							this.nft.starNum -= 1
							//爱心减少
							uniCloud.callFunction({
								name: "update_like_num",
								data: {
									_id: this.nft._id,
									num: -1
								}
							}).then(res => {
								console.log("starNum减少成功", res)
							}).catch((err) => {
								console.log(err.message)
							});

						} else {
							this.addStar(this.nft)
							this.has_Star = true
							this.nft.starNum += 1
							//爱心增加
							uniCloud.callFunction({
								name: "update_like_num",
								data: {
									_id: this.nft._id,
									num: 1
								}
							}).then(res => {
								console.log("starNum增加成功", res)
							}).catch((err) => {
								console.log(err.message)
							});

						}
					} else uni.showToast({
						title: "登录后才可以点赞噢",
						icon: 'none'
					})
					setTimeout(() => {
						this.starClicked = false;
						this.animation.scale(1).step({
							duration: 0
						})
						this.animationData = this.animation.export()
					}, 1550)
				}
			}
		}
	}
</script>

<style lang="scss">
	.my-font {
		font-family: 'Alimama ShuHeiTi';
	}

	.bg {
		position: fixed;
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

	.center {
		text-align: center;
	}

	.details-nftPic {
		width: 750rpx;
		display: block;
	}

	.nav-icon {
		position: fixed;
		top: calc(var(--status-bar-height) + 5px);
		left: 20rpx;
		height: 30px;
		width: 30px;
		border-radius: 17px;
		line-height: 30px;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.nft-upper-box {
		position: relative;
		height: 120rpx;
		background-color: rgba(227, 227, 227, 0.8);

		.nft-upper-avatar {
			position: absolute;
			background-color: #dddddd;
			height: 80rpx;
			width: 80rpx;
			top: 20rpx;
			left: 40rpx;
			border-radius: 40rpx;
			box-shadow: 0 0 3px #4f4f4f;
		}

		.nft-upper-name {
			position: absolute;
			top: 20rpx;
			left: 150rpx;
			font-size: 30rpx;
		}

		.nft-upper-createNum {
			position: absolute;
			bottom: 20rpx;
			left: 150rpx;
			color: #4f4f4f;
			font-size: 25rpx;
		}

		.nft-upper-button {
			position: absolute;
			bottom: 20rpx;
			right: 40rpx;
			height: 40rpx;
			line-height: 40rpx;
			padding: 0 20rpx;
			background-color: #000000;
			color: #fff;
			font-size: 25rpx;
			opacity: 1;
		}
	}

	.nft-details-box {
		margin: 15rpx 0 50px;
		padding: 10px;
		background-color: rgba(227, 227, 227, 0.8);

		height: 75vh;

		.nft-info-body {
			display: flex;
			justify-content: space-between;
			height: 100rpx;
			padding-right: 0;

			.nft-name {
				font-size: 50rpx;
				padding-right: 20rpx;
				line-height: 100rpx;
			}

			.favi {
				width: 200rpx;
				font-size: 24rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-left: 2rpx solid #efefef;
				color: gray;
			}
		}

		.item-no {
			position: relative;
			height: 44rpx;

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

		.nft-arrt {
			display: inline-flex;
			padding: 36rpx 0 48rpx;
			border-bottom: 2rpx solid rgba(0, 0, 0, .05);
			color: rgba(0, 0, 0, .7);

			view {
				border-right: 2rpx solid rgba(0, 0, 0, .1);
				padding: 0 40rpx;
				padding-left: 40rpx;
				font-size: 24rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin: 0;
				box-sizing: border-box;
				font-size: 24rpx;

				h1 {
					color: rgba(0, 0, 0, .4);
					font-size: 24rpx;
					line-height: 24rpx;
					white-space: nowrap;
					font-weight: 400;
					box-sizing: border-box;
				}
			}

			view:last-child {
				border-right: none;
			}
		}
	
    .nft-detail {
      background-color: #fff;
      padding: 15rpx;
      margin-top: 20rpx;
      box-shadow: 0 0 15rpx 15rpx rgba(0, 0, 0, .1);
      
      p {
        margin: 15rpx 0;
      }
    }
  }

	.nav {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}
</style>
