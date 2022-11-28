<template>
	<view>
		<!-- 购物车商品列表的标题区域 -->
		<view class="collect-title">
			<!-- 左侧的图标 -->
			<uni-icons type="wallet-filled" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="collect-title-text">我的收藏</text>
		</view>

		<view class="itemList" v-if="collect.length !== 0">
			<view class="itemList-item" v-for="(nft, i) in collect" :key="i" @click="sale(i)">
				<my-nftItem :nft="nft" :jump="false"></my-nftItem>
			</view>
		</view>
		<view class="emptyBg" v-else></view>

		<u-popup :show="show" bgColor="transparent" mode="center" @close="closePop()">
			<my-nftItem-large :nft="collect[showItem]"></my-nftItem-large>
			<view style="margin-top: 30upx;">
				<view class="confirm">
					<u-button @click="confirm()" type='primary' :ripple="true" ripple-bg-color="#a0cfff">确认出售
					</u-button>
				</view>
				<view class="cancel">
					<u-button @click='closePop()' type='error' :ripple="true" ripple-bg-color="#fab6b6">取消
					</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js';
	import {
		mapState
	} from 'vuex'
	export default {
		computed: {
			userInfo() {
				return store.userInfo
			},
			// 将 m_star 模块中的 star 数组映射到当前页面中使用
			...mapState('m_star', ['star']),
		},
		data() {
			return {
				issale: false,
				collect: [],
				show: false,
				showItem: -1
			}
		},
		async onLoad() {
			const db = uniCloud.database();
			const dbCmd = db.command;
			let res = await db.collection("uni-id-users").doc(this.userInfo._id).field("collection_list").get();
			let col_list = res.result.data[0].collection_list
			
			let temp = await db.collection("nftItem").where(
				dbCmd.and([
					{_id:dbCmd.in(col_list)},
					{isSaling: false}
				])	
			).get();
			this.collect = temp.result.data;

		},
		methods: {
			sale(i) {
				this.show = true,
				this.showItem = i
			},
			closePop() {
				this.show = false
			},
			//判断是否是在售物品，这个函数到时候需要移植
			async is_Saling(nft_id){
				
				const db = uniCloud.database();
				const dbCmd = db.command;
				await db.collection("nftItem").doc(nft_id).field("isSaling").get().then(res=>{
					this.issale = res.result.data[0].isSaling;
				}).then(res => {
					console.log("获取nft_id成功", res)
				}).catch((err) => {
					console.log(err.message)
				});
			},
			confirm() {
				console.log('确认出售', this.collect[this.showItem]);			
				uniCloud.callFunction({
					name: "upadte_issaling",
					data: {
						_id: this.collect[this.showItem]._id,
						isSaling: true //修改为正在出售
					}
				}).then(res => {
          this.show = false,
					console.log("数据库操作成功", res)
				}).catch((err) => {
					console.log(err.message)
				});
				
				this.collect.splice(this.showItem,1);
				
				
				/*this.is_Saling(this.collect[this.showItem]._id);
				if(this.issale === true ){
					console.log('取消出售', this.collect[this.showItem]);
					
					uniCloud.callFunction({
						name: "upadte_issaling",
						data: {
							_id: this.collect[this.showItem]._id,
							isSaling: false
						}
					}).then(res => {
						console.log("数据库操作成功", res)
					}).catch((err) => {
						console.log(err.message)
					});
				}
				else{
					console.log('确认出售', this.collect[this.showItem]);
					
					uniCloud.callFunction({
						name: "upadte_issaling",
						data: {
							_id: this.collect[this.showItem]._id,
							isSaling: true
						}
					}).then(res => {
						console.log("数据库操作成功", res)
					}).catch((err) => {
						console.log(err.message)
					});
				}*/
				
				

			}
		}
	}
</script>

<style lang="scss">
	.collect-title {
		height: 40px;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;

		.collect-title-text {
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

	.confirm {
		width: 78%;
		float: left;
		padding-bottom: 10px;
	}

	.cancel {
		padding-bottom: 10px;
		margin-left: 2%;
		width: 20%;
		float: left;
	}
</style>
