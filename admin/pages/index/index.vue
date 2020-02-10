

<!-- 最后修改时间2020年2月9日 -->


<template>
	<view class="content">
		<view v-if="!postData.password">
			<input type="text" v-model="inputPassword" style="height: 35px;border: 1px solid #4CD964;" />
			<button type="primary" @click="login">login</button>
		</view>
		
		<view v-else class="config">
			<view class="control" @click="isShowConfig = !isShowConfig">
				<text :class="isShowConfig ? 'triangle-down' : 'triangle-right' "></text>
			</view>
			
			<view v-if="isShowConfig" style="margin: 10px;">
				<view>
					改变用户首页
					<input type="text" v-model="homePage">
				</view>
				<view>
					<checkbox-group @change="isFilterErrPositon = !isFilterErrPositon">
						<label>
							<checkbox value="true"  />过滤错误信息
						</label>
					</checkbox-group>
				</view>
				<radio-group @change="radioChange">
					<view>
						<label class="radio"><radio value="recentPosition" checked="true" />最近的信息</label>
						<br>
						<label class="radio"><radio value="allPosition" />所有的信息</label>
					</view>
				</radio-group>
				
				<view v-if="isShowInput">
					用户名:
					<input type="text" class="input" v-model="postData.userName" />
					
					日期:
					<input type="text"class="input" v-model="postData.date" />
					
					当前日期可选择的用户名:
					<picker @change="bindPickerChange" :value="userIndex" :range="allUserName">
						<view class="uni-input input">{{allUserName[userIndex]}}</view>
					</picker>
					
					<button type="primary" style="background: #009688;margin-top: 5px;" @click="query">查询</button>
				</view>
			</view>
			
		</view>
		
		
		<view v-for="(d,index) in positionInfo" :key="index" >
			
			<!-- 如果是错误的位置信息  -->
			<view v-if="d.errMsg && d.errMsg.toString().includes('getLocation:fail') && !isFilterErrPositon" class="item">
				<view>{{d.userName ? `用户名: ${d.userName}` : ''}}</view>
				<view>时间: {{d.time}}</view>
				<view>错误信息: {{d.errMsg}}</view>
			</view>
			
			<!-- 如果是正确的位置信息 -->
			<view v-if="d.errMsg && !d.errMsg.toString().includes('getLocation:fail') " class="item">
				<view>{{d.userName ? `用户名: ${d.userName}` : ''}}</view>
				<view>时间: {{d.time}}</view>
				<view>国家: {{d.country}}</view>
				<view>省份: {{d.province}}</view>
				<view>城市: {{d.city}}</view>
				<view>区（县）: {{d.district}}</view>
				<view>街道信息: {{d.street}}</view>
				<view>街道门牌号: {{d.streetNum}}</view>
				<view>POI信息: {{d.poiName}}</view>
				<view>邮政编码: {{d.postalCode}}</view>
				<view>城市代码: {{d.cityCode}}</view>
				
				<view>纬度: {{d.latitude}}</view>
				<view>经度: {{d.longitude}}</view>
				<view>速度: {{d.speed}}m/s</view>
				<view>位置的精确度: {{d.accuracy}}</view>
				<view>高度: {{d.altitude}}m</view>
				<view>垂直精度: {{d.verticalAccuracy}}m</view>
				<view>水平精度: {{d.horizontalAccuracy}}m</view>
				<button type="primary" @click="openLocation(d.latitude, d.longitude)">
					从地图打开
				</button>
			</view>
			
			<!-- 如果不能判断位置信息是否正确(当做错误) -->
			<view v-if="!d.errMsg && !isFilterErrPositon" class="item">
				<view>{{d.userName ? `用户名: ${d.userName}` : ''}}</view>
				<view>时间: {{d.time}}</view>
				<view>错误信息: 没有errMsg!</view>
			</view>
			
			
		</view>
		
	</view>
</template>


<script>
	export default {
		data() {
			return {
				isFilterErrPositon: false,
				isShowConfig: false,
				isShowInput: false,
				positionInfo: [],
				postData: {
							userName: '',
							date: '',
							password:'',
							pageNumber: 0,
							pageSize: 20
						},
				inputPassword: '',
				previousDate: '',
				allUserName: [],
				userIndex: 0,
				homePage:''
			}
		},
		onLoad() {
			var that= this;
			
			that.initData();
			
		},
		methods: {
			// 提示登录与初始化管理员数据
			initData(){
				var that = this;
				that.postData.date = that.formatDate(new Date());
				uni.getStorage({
					key:'user_info',
					success(d){
						// console.log(d.data.userName);
						if (d && d.data && d.data.password) {
							that.postData.password = d.data.password;
							that.getAllUserName();
							that.getData(`/recentPositionInfo`, undefined, that.renderData );
						}
					},
					complete() {}
				})
				
			},
			login(){
				var that = this;
				var account = 'zp';
				var password =  that.inputPassword;
				
				that.getData('/verifyAdmin', {account, password}, (data) => {
					// console.log(data);
					if (data.loginResult) {
						uni.setStorage({
							key:'user_info',
							data:{
								password: password
							}
						})
						that.postData.password = password;
						that.postData.date = that.formatDate(new Date());
						that.getAllUserName();
						that.getData(`/recentPositionInfo`, undefined, that.renderData );
					} else {
					    uni.showToast({
					        icon: 'none',
					        title: '用户账号或密码不正确',
					    });
					}
				})
			},
			// 得到当前日期所有的用户名
			getAllUserName(){
				var that= this;
				if (this.previousDate === this.postData.date) return;
				this.previousDate = this.postData.date
				that.getData(`/allUserName`, {
					date: that.postData.date,
					password: that.postData.password
				}, function(data){
					// console.log(data);
					if (Array.isArray(data)) {
						that.allUserName = data;
					} else {
						that.allUserName = ['无'];
					}
				})
			},
			getData(url, data = this.postData, func) {
				var that= this;
				uni.request({
					method:'post',
					url: this.baseUrl + url,
					dataType:'json',
					data,
					success(d) {
						// console.log(d);
						var data = d.data;
						
						// 有处理函数就用处理函数
						if (func) {
							func(data);
							return;
						}
						
					}
				})
			},
			renderData(data){
				var that = this;
				if (data === ''){
					that.positionInfo = [];
					return;
				}
				if (typeof data == 'string'){
					console.error(data);
					uni.showToast({
						icon:'none',
						title:data
					})
					that.positionInfo = [];
					return;
				}
				
				data = data.reverse(); // 最新的信息排前面
				
				// 合并对象的属性
				var position_arr = []
				for (var d of data){
					if (d.address){
						position_arr.push(Object.assign({}, d, d.address))
					} else {
						position_arr.push(d)
					}
				}
				console.log(position_arr);
				
				that.positionInfo = position_arr;
			},
			openLocation(latitude, longitude){
				var that = this;
				uni.openLocation({
					latitude,
					longitude,
					success: function (e) {
						// console.log(e);//'打开成功'
					}
				});
			},
			radioChange(e){
				var that= this;
				// console.log(e.target.value);
				var val = e.target.value;
				if (val === 'recentPosition') {
					that.isShowInput = false;
					that.getData(`/recentPositionInfo`, undefined, that.renderData )
				} else if (val === 'allPosition') {
					that.isShowInput = true;
					that.getData(`/positionInfo`, undefined, that.renderData )
				}
			},
			bindPickerChange: function(e) {
				// console.log('picker发送选择改变，携带值为', e.target.value)
				this.userIndex = e.target.value
				this.postData.userName = this.allUserName[this.userIndex]
				this.getData(`/positionInfo`, undefined, this.renderData )
			},
			query(){
				this.getAllUserName(); // 得到新数据的同时更新当前日期所有的用户名
				this.getData(`/positionInfo`, undefined, this.renderData )
				// 如果主页地址正确就更改主页
				if (/https?:\/\/\w+\.\w+/.test(this.homePage)) {
					this.getData('/changeHomePage',
						{password:this.postData.password, src:this.homePage}, 
						(d) => {
							this.homePage = ''
					})
				}
			},
			formatDate(inputTime) {
			    var date = new Date(inputTime);
			    var y = date.getFullYear();
			    var m = date.getMonth() + 1;
			    m = m < 10 ? ('0' + m) : m;
			    var d = date.getDate();
			    d = d < 10 ? ('0' + d) : d;
			    return y + '-' + m + '-' + d;
			},
			
		}
	}
</script>


<style>
	.content {
		position: relative;
		/* display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center; */
	}
	.content .item{
		position: relative;
		padding: 10px;
		border-bottom: 1px solid #007AFF;
		margin: 5px auto;
	}
	.content .item view{
		white-space: nowrap;
		overflow: auto;
		/* text-overflow: ellipsis; */
	}

	.config{
		width: 100%;
		/* height: 50px; */
		border: 1px solid #007AFF;
		
	}
	.config .control{
		position: relative;
		height: 50px;
		margin: 10px;
		box-sizing: border-box;
		background: rgba(16, 162, 192, 0.21);
	}
	.config .control text{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 0;
		height: 0;
	}
	.config .control text.triangle-right{
		    border-top: 20px solid transparent;
		    border-left: 25px solid #4CD964;
		    border-bottom: 20px solid transparent;
	}
	.config .control text.triangle-down{
		    border-top: 25px solid #4CD964 ;
		    border-left: 20px solid transparent;
		    border-right: 20px solid transparent;
			
	}
	.input{
		border: 1px solid #4CD964;
		height: 30px;
		line-height: 30px;
		padding-left: 10px;
	}
</style>
