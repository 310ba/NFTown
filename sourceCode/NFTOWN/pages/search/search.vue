<template>
	<view>
		<view style="height: var(--status-bar-height); width: 100%; background-color: #fff;">
			<!-- 这里是状态栏 -->
		</view>
		<view class="nav-bar">
			<view class="nav-icon" :style="{opacity: opacity}">
				<uni-icons color="#000" size="25" type="back" @click="navBack" />
			</view>
			<view class="search-box" :animation="searchClickAnimation">
				<uni-search-bar @input="input" :radius="17" bgColor="#ebebeb" cancelButton="none"
					:placeholder="placeholder" />
			</view>
		</view>

		<view class="sugg-list" v-if="kw.length !== 0">
			<view class="sugg-item" @click="gotoList(kw)">
				<view class="nft-name">查询“{{kw}}”相关NFT</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item._id)">
				<view class="nft-name">{{item.intro}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>

		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag class="tag" :text="item" v-for="(item, i) in historys" :key="i" @click="gotoList(item)">
				</uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			historys() {
				// 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
				// 而是应该新建一个内存无关的数组，再进行 reverse 反转
				return [...this.historyList].reverse()
			}
		},
		data() {
			return {
				searchClickAnimation: {},
				opacity: 0,
				placeholder: '搜索',
				timer: null,
				// 搜索关键词
				kw: '',
				// 搜索结果列表
				searchResults: [],
				// 搜索关键词的历史记录
				historyList: []
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		onShow() {
			this.kw = ''
			this.searchResults = []
			var animation = uni.createAnimation({
				timingFunction: 'ease',
			});
			this.animation = animation;

			this.animation.width('710upx').step({
				duration: 1000
			})
			this.animation.width('640upx').step({
				duration: 1000
			})
			setTimeout(() => {
				this.searchClickAnimation = this.animation.export();
			}, 350)

			setTimeout(() => {
				this.opacity = 1;
			}, 1350)
		},
		methods: {
			async getSearchList() {
				console.log("加载getSearchList");
				// 判断关键词是否为空
				if (this.kw === '') {
					this.searchResults = []
					return
				}
				
				
				
				/*const db = uniCloud.database();
				const dbCmd = db.command;
				await db.collection("nftItem").where({
					//name:/`{$this.kw}`/ig
					name: new RegExp(this.kw, "ig")
				}).limit(10).get().then(res=>{
					console.log("len:",res.result.data.length);
					for(let i=0;i<res.result.data.length;i++) 
					{
						this.searchResults.push(res.result.data[i]);
					}
				}).then(res => {
					console.log("数据库操作成功", this.searchResults);
					console.log("length", this.searchResults.length);
				}).catch((err) => {
					console.log(err.message)
				});		*/		
				// 发起请求，获取搜索建议列表
				// let db = wx.cloud.database()
				// let _ = db.command
				// db.collection('renwu')
				//   .where(_.or([{
				//   intro: db.RegExp({
				//     regexp: this.kw,
				//     options: 'i'
				//   }),
				//   status: 0
				// }, {
				//   _id: this.kw
				// }]))
				// .limit(10)
				// .get()
				// .then(res => {
				//   this.searchResults = res.data
				//   console.log('results:', this.searchResults)
				// })
				// .catch(err => {
				//   console.log('失败', err)
				// })
			},
			gotoList(keyWord) {
				console.log("加载gotolist");
				this.kw = keyWord
				this.saveSearchHistory()
				uni.navigateTo({
					url: '/pages/searchResult/searchResult?query=' + keyWord,
					fail(res) {
						console.log(res)
					}
				})
			},
			input(e) {
				// 清除 timer 对应的延时器
				clearTimeout(this.timer)
				// 重新启动一个延时器，并把 timerId 赋值给 this.timer
				this.timer = setTimeout(() => {
					// 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
					this.kw = e.valueOf()
					this.getSearchList()
				}, 500)
			},
			// focusSearch() {
			//   this.placeholder = '搜索NFT小镇';
			// },
			navBack() {
				uni.navigateBack({
					animationType: 'fade-out'
				})
			},
			cleanHistory() {
				let that = this
				if (that.historyList !== [])
					uni.showModal({
						content: "确定要清空搜索历史？",
						cancelColor: "#000",
						confirmColor: "#000",
						success(res) {
							if (res.confirm) {
								// 清空 data 中保存的搜索历史
								that.historyList = []
								// 清空本地存储中记录的搜索历史
								uni.setStorageSync('kw', '[]')
							}
						}
					})
			},
			saveSearchHistory() {
				const set = new Set(this.historyList)
				set.delete(this.kw)
				set.add(this.kw)
				this.historyList = Array.from(set)
				// 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			gotoDetail(id) {
				this.saveSearchHistory()
				uni.navigateTo({
					// 指定详情页面的 URL 地址，并传递 id 参数
					url: '/subpkg/details/details?id=' + id
				})
			},
		}
	}
</script>

<style lang="scss">
	.nav-bar {
		position: relative;
		width: 750upx;
		height: 44px;
		background-color: #fff;

		.nav-icon {
			position: absolute;
			top: 5px;
			left: 20upx;
			height: 34px;
			width: 34px;
			line-height: 34px;
			opacity: 0;
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

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.nft-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.tag {
				margin-top: 5px;
				margin-right: 5px;
				margin-bottom: 5px;
			}
		}
	}
</style>
