<template>
	<view class="">
		<view class="box">
			<u--form :model="form" ref="uForm">
				<view class="uItem">
					<u-form-item label="上传nft" labelWidth="100">
						<u-upload slot="right" :fileList="nftPic" @afterRead="afterRead" @delete="deletePic"
							:maxCount="1">
						</u-upload>
					</u-form-item>
				</view>

				<view class="uItem">
					<u-form-item label="名字" prop="name">
						<u-input v-model="form.name" placeholder="" input-align='center' />
					</u-form-item>
					<u-form-item label="售价" prop="price">
						<u-input v-model="form.price" type="digit" placeholder="" maxlength='8' input-align='center' />
					</u-form-item>
					<u-form-item label="发布类型" labelWidth="150">
						<view class="spanLine" v-if="form.span === false">
							衍生品
						</view>
						<view class="spanLine ac" v-else>
							版权品
						</view>
						<u-switch slot="right" v-model="form.span" inactive-color="#42D3AD" active-color="#A0CFFF">
						</u-switch>
					</u-form-item>
				</view>

				<view class="uItem">
					<u-form-item label="NFT详情" labelWidth="100">
						<u-button slot="right" @click="openEditor()" size="mini">{{editorTip}}</u-button>
					</u-form-item>
				</view>
			</u--form>
		</view>
		<my-editor v-if="editorTip === '完成'"></my-editor>
		<view class="richHTML" v-else-if="html !== ''">
			<mp-html :content="html"></mp-html>
		</view>

		<view style="margin: 20upx;">
			<u-button @click="up()">确认发布</u-button>
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
	} from 'vuex'
	export default {
		computed: {
			// 2. 从 m_user 模块中导入需要的 token 字符串
			...mapState('m_user', ['token']),
			userInfo() {
				return store.userInfo
			},
		},
		data() {
			return {
				editorTip: "编写NFT详情",
				html: '',
				rules: {
					name: [{
						required: true,
						message: '未输入名字',
						trigger: ['change', 'blur']
					}, {
						max: 15,
						message: '名字过长',
						trigger: ['change', 'blur']
					}],
					price: [{
							required: true,
							message: '未输入nft售卖金额',
							trigger: ['change', 'blur']
						},
						{
							pattern: /^(0|([1-9]\d{0,6}))(\.\d{1,2})?$/g,
							message: '售价不符合规范',
							trigger: ['change', 'blur']
						}
					]
				},
				form: {
					span: true,
					name: '',
					detail: '',
					price: '',
				},
				nftPic: [],
				nickname: '',
				uploading: false,
			};
		},
		onLoad() {
			// 监听事件
			uni.$on('upload', (html) => {
				console.log(html)
				this.html = html;
			})
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onUnload() {
			// 移除监听事件  
			uni.$off('upload');
		},
		methods: {
			openEditor() {
				console.log("editorTip",this.editorTip);
				if (this.editorTip !== '完成') this.editorTip = '完成'
				else this.editorTip = '编写NFT详情'
			},
			async up() {
				if (this.uploading === true) return;
				this.uploading = true;
				this.$refs.uForm.validate().then(async valid => {

					const db = uniCloud.database();
					const dbCmd = db.command;
					if (true) {

						//添加pic到云存储
						const nftID = await uniCloud.uploadFile({
							filePath: this.nftPic[0].url,
							cloudPath: this.form.name + ".jpg", //需要修改
							fileType: 'image',
							onUploadProgress: function(progressEvent) {
								console.log(progressEvent);
								var percentCompleted = Math.round(
									(progressEvent.loaded * 100) / progressEvent.total
								);
							}
						});
						//添加pic到云数据库
						db.collection("nftItem").add({
							"name": this.form.name,
							"price": parseInt(this.form.price),
							"nftPic": nftID.fileID,
							"upper": this.userInfo.nickname, //user.nickname
							"owner": this.userInfo.nickname,
							"upper_id": this.userInfo._id,
							"owner_id": this.userInfo._id,
							"detail": this.html,
							"span": this.form.span
						}).then(res => {
							//添加pic到user_list
							console.log("user_id:", this.userInfo._id);
							uniCloud.callFunction({
								name: "add_user_col_list",
								data: {
									pic_id: res.result.id,
									user_id: this.userInfo._id
								}
							}).then(res => {
								console.log("数据库操作成功", res)
							}).catch((err) => {
								console.log(err.message)
							});
						}).catch(err => {
							console.log(err)
						});


						if (this.editorTip === '完成' || this.html === '') {
							uni.showToast({
								title: '请完成NFT详情的介绍',
								icon: 'none'
							})
							this.uploading = false
						}
						console.log('验证通过');
					} else {
						console.log('验证失败');
						this.uploading = false
					}
				});
				await uni.navigateBack();
			},
			// 删除图片
			deletePic(event) {
				this.nftPic = []
			},
			// 新增图片
			async afterRead(event) {
				this.nftPic = [].concat(event.file)
			},

		}
	}
</script>

<style lang="scss">
	@import '/static/css/editor.css';

	.uItem {
		background-color: #fff;
		padding: 0 25rpx;
		border-radius: 25rpx;
		margin-bottom: 20rpx;
	}

	.box {
		margin: 20rpx;
	}

	.container {
		padding: 10px;
		width: 100%;

		#editor {
			width: 100%;
			height: 300px;
			background-color: #CCCCCC;
		}
	}

	.spanLine {
		color: #42D3AD;
		font-family: 'Alimama ShuHeiTi';
	}

	.ac {
		color: #A0CFFF;
	}

	.richHTML {
		margin: 20rpx;
		padding: 20rpx;
		background-color: white;
		border-radius: 10px;
	}
</style>
