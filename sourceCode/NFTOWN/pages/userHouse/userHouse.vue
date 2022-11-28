<template>
	<view>
		<view class="nav-icon">
			<uni-icons color="#fff" size="25" type="back" @click="navBack" />
		</view>
		<!-- 头像昵称区域 -->
		<view class="top-box">
			<image class="avatar" v-if="user.avatar_file&&user.avatar_file.url" :src="user.avatar_file.url">
			</image>
			<image v-else class="avatar" src="../../static/default_pic/avatar.png" mode="aspectFit"></image>
			<view class="nickname">
				{{user.nickname||user.username||user.mobile}}
			</view>
		</view>

		<view class="bottom-box">
			<u-collapse @change="change" @close="close" @open="open" :border="false">
				<u-collapse-item title="在售" name="onSale">
					<uni-icons type="shop-filled" size="20" slot="icon"></uni-icons>
					<view class="itemList" v-if="onSaleList.length !== 0">
						<view class="itemList-item" v-for="(nft, i) in onSaleList" :key="i">
							<my-nftItem :nft="nft"></my-nftItem>
						</view>
					</view>
					<text style="margin-left: 15px;" v-else>暂无在售NFT</text>
				</u-collapse-item>
				<u-collapse-item title="收藏" name="own">
					<uni-icons type="wallet-filled" size="20" slot="icon"></uni-icons>
					<view class="itemList" v-if="ownList.length !== 0">
						<view class="itemList-item" v-for="(nft, i) in ownList" :key="i">
							<my-nftItem :nft="nft"></my-nftItem>
						</view>
					</view>
					<text style="margin-left: 15px;" v-else>暂未收藏NFT</text>
				</u-collapse-item>
			</u-collapse>
		</view>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js';

	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				user: {},
				onSaleList: [],
				ownList: []
			};
		},
		computed: {
			userInfo() {
				return store.userInfo
			},
			...mapState('m_star', ['star']),
		},
		async onLoad(res) {
			if (res.type == 0) this.user = this.userInfo
			else this.user = JSON.parse(res.user)//获取用户信息
			console.log("asdasd",this.user.nickname);
			//获取 onSaleList 和 ownList
			const db = uniCloud.database();
			const dbCmd = db.command;

			let resList = await db.collection("uni-id-users").doc(this.user._id).field("collection_list").get();
			let col_list = resList.result.data[0].collection_list;
			//获取ownList
			db.collection("nftItem").where({
				_id: dbCmd.in(col_list)
			}).get().then(res => {
				this.ownList = res.result.data; 
			}).catch((err) => {
				console.log(err.message)
			});

			//获取onSaleList
			db.collection("nftItem").where(
				dbCmd.and([{
						_id: dbCmd.in(col_list)
					},
					{
						isSaling: true
					}
				])
			).get().then(res => {
				this.onSaleList = res.result.data;
			}).catch((err) => {
				console.log(err.message)
			});

		},

		methods: {
			navBack() {
				uni.navigateBack()
			},
			open(e) {
				// console.log('open', e)
			},
			close(e) {
				// console.log('close', e)
			},
			change(e) {
				// console.log('change', e)
			}
		}
	}
</script>

<style lang="scss">
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

	.top-box {
		height: 400rpx;
		width: 750rpx;
		padding: 50rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #a6e6ff;
		background-image: linear-gradient(160deg, #a6e6ff 0%, #a6fffc 50%, #c4ffe0 100%);

		.avatar {
			display: block;
			width: 90px;
			height: 90px;
			border-radius: 45px;
			border: 2px solid white;
			box-shadow: 0 1px 5px black;
		}

		.nickname {
			color: white;
			font-weight: bold;
			font-size: 16px;
			margin-top: 10px;
		}
	}

	.bottom-box {
		margin: 0 15rpx;
		position: relative;
		top: -50rpx;
		background: white;
		border-radius: 3px;

		.itemList {
      margin: 0px;
      padding: 0px;
			.itemList-item {
				width: 350rpx; 
        padding: 5rpx;
				display: inline-block;
			}
		}
	}
</style>
