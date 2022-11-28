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
			<view class="itemList-item" v-for="(nft, i) in collect" :key="i">
				<my-nftItem :nft="nft"></my-nftItem>
			</view>
		</view>

		<view class="emptyBg" v-else></view>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js';
import collectVue from './collect.vue';
	export default {
		computed: {
			userInfo() {
				return store.userInfo
			},
		},
		data() {
			return {
				collect: []
			}
		},
		async onLoad() {
			//获取onSale数组
			const db = uniCloud.database();
			const dbCmd = db.command;
			//获取collect_list
			let res = await db.collection("uni-id-users").doc(this.userInfo._id).field("collection_list").get();
			let col_list = res.result.data[0].collection_list
			
			let temp = await db.collection("nftItem").where({
				_id:dbCmd.in(col_list)
			}).get();
			this.collect = temp.result.data;
			
		},
		methods: {

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
</style>
