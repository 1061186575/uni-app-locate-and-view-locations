
<!-- 最后修改时间2020年2月9日 -->

<template>
	<view class="content">
		
		<view class="bg"></view>
		
		<view v-if="isLogin" >
			<view class="" >
				<web-view :webview-styles="webviewStyles" :src="homePage"></web-view>
			</view>
		</view>
		
		
		<view v-else class="login-wrapper">
			<view class="input-group" >
			    <view class="input-row border">
			        <text class="title">账号：</text>
			        <m-input class="m-input" type="text" clearable focus v-model="account" placeholder="请输入账号"></m-input>
			    </view>
			    <view class="input-row">
			        <text class="title">密码：</text>
			        <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			    </view>
			</view>
			<view class="btn-row">
			    <button type="primary" class="primary" @tap="bindLogin">登录</button>
			</view>
		</view>
		
		
	</view>
</template>


<script>
	import mInput from '../../components/m-input.vue'
	
	export default {
		components: {
		    mInput
		},
		data() {
			return {
				isLogin: false,
				account:'',
				password:'',
				homePage: '',
				webviewStyles:{
					progress: {
						color: '#FF3333'
					}
				},
			}
		},
		onLoad() {
			var that = this;
			
			// 加载首页
			uni.request({
				url: `${this.baseUrl}/homePage`,
				success(d) {
					// console.log(d);
					if (d.data && d.data.src) {
						that.homePage = d.data.src;
					}
				}
			});
			
			// 从localStorage加载用户数据
			uni.getStorage({
				key:'user_info',
				success(d){
					// console.log(d.data.userName);
					if (d && d.data && d.data.userName) {
						that.isLogin = true
						that.account = d.data.userName
					}
				},
				complete() {
					that.sendLocation();
				}
			})
			
		},
		methods: {
			sendLocation() {
				var that = this;
				var baseUrl = this.baseUrl;
				
				function send(resObj){
					try{
						resObj.userName = that.account || '未登录';
						resObj = JSON.stringify(resObj)
						console.log(resObj);
						that.postData('/positionInfo', resObj)
					}catch(e){
						console.log(e);
					}
				}
				
				
				uni.getLocation({
					type: 'wgs84',
					altitude: true,
					geocode: true,
					success: function (res) {
						
						send(res)
						// uni.showModal({
						// 	title:'获取位置成功'
						// })
						
					},
					fail(e){
						console.log(e);
						send({errMsg: e.errMsg})
						// uni.showModal({
						// 	title:'获取位置失败'
						// })
					}
				});
			},
			postData(url, data, func){
				uni.request({
					method:'POST',
					url:`${this.baseUrl}${url}`,
					data,
					dataType:'json',
					success(d) {
						// console.log('发送成功');
						if (func) {
							func(d.data)
						}
					}
				})
			},
			bindLogin() {
			    var that = this;
			    if (this.account.length < 1) {
			        uni.showToast({
			            icon: 'none',
			            title: '账号最短为 1 个字符'
			        });
			        return;
			    }
			    if (this.password.length < 6) {
			        uni.showToast({
			            icon: 'none',
			            title: '密码最短为 6 个字符'
			        });
			        return;
			    }
				
				this.postData('/verifyUsers', {account:this.account,password:this.password}, (data) => {
					// console.log(data);
					if (data.loginResult) {
						this.isLogin = true;
					    uni.setStorage({
					    	key:'user_info',
							data:{
								userName: this.account
							},
							success() {
								that.sendLocation();
							}
					    })
					} else {
					    uni.showToast({
					        icon: 'none',
					        title: '用户账号或密码不正确',
					    });
					}
				})
				
			},
			
			
		}
	}
</script>


<style>
	page .content{
		width:100%;
		height: 100%;
	}
	.content .bg{
		position: absolute;
		z-index: -1;
		background: url(../../static/bg.jpg) repeat fixed center;
		width: 100%;
		height: 100%;
	}
	
	.history{
		/* position: fixed; */
		/* bottom: 0; */
		/* height: 50px; */
	}
	
	/* 登录框 */
	.login-wrapper{
		position: absolute;
		top: 30%;
		left: 50%;
		transform: translate(-50%,0);
		padding: 10px;
		width: 95%;
		box-sizing: border-box;
	}
	
	m-input {
		width: 100%;
		min-height: 100%;
		display: flex;
	}
	
	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #efeff4;
		padding: 20upx;
	}
	
	.input-group {
		background-color: #ffffff;
		margin-top: 40upx;
		position: relative;
	}
	
	.input-group::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	
	.input-group::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	
	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
	}
	
	.input-row .title {
		width: 20%;
		height: 50upx;
		min-height: 50upx;
		padding: 15upx 0;
		padding-left: 30upx;
		line-height: 50upx;
	}
	
	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 15upx;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	
	.btn-row {
		margin-top: 50upx;
		padding: 20upx;
	}
	
	button.primary {
		background-color: #0faeff;
	}
	
</style>
