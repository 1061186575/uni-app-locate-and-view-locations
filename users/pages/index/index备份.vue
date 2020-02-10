<template>
	
	
	<view class="content">
		<!-- <button type="primary" @click="sendLocation">click sendLocation</button> -->
		<button type="primary" @click="chooseLocation">选择位置</button>
		<!-- <button type="primary" @click="openLocation">click openLocation</button> -->
		<view class="text-area">
			<view id="start">
				count: {{count}}
			</view>
			suc: 
			<view v-html="suc">
				
			</view>
			<view id="err">
				err: 
				<pre>
					{{err}}
				</pre>
			</view>
			<view id="comp">
				comp: 
				<pre>
					{{comp}}
				</pre>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				count: 0,
				suc: '',
				err: '',
				comp:'',
				detail:'',
			}
		},
		onLoad() {
			this.sendLocation();
		},
		methods: {
			sendLocation() {
				var that = this;
				that.count++;
				
				// var res = {
				// 	userName: 'user2',
				// 	type: 'wgs84' ,
				// 	altitude: 0 ,
				// 	latitude:30.669190804864563 ,
				// 	longitude:104.10187343530437 ,
				// 	speed: 0 ,
				// 	accuracy: 550,
				// 	address: {
				// 		country:'中国',
				// 		province:'四川省',
				// 		city:'成都市',
				// 		district:'成华区',
				// 		street: '培华西路',
				// 		streetNum: '38-附22号',
				// 		poiName:'培华小学',
				// 		ityCode:'028' ,
				// 	},
				// 	errMsg: 'sendLocation:ok'
				// }
				// that.suc = that.objToHtml(res)
				// that.send(res)
				
				// return;
				
				uni.getLocation({
					type: 'wgs84',
					altitude: true,
					geocode: true,
					success: function (res) {
						
						that.suc = that.objToHtml(res)
						that.send(res)
						
					},
					fail(e){
						console.log(e);
						that.err = e.errMsg;
					},
					complete(e) {
						console.log('执行完毕', e);
						that.comp = '执行完毕' + that.count;
					}
				});
			},
			objToHtml(res){
				var html = ''
				for (var d in res){
					if (typeof res[d] == 'object' && !Array.isArray(res[d]) ){
						html += 
						`<view class="block">
							${d}:
							<view class="block">{</view>
							${this.objToHtml(res[d])}
							<view class="block">}</view>
						</view>`
					} else if (typeof res[d] == 'string' || typeof res[d] == 'number'){
						html += `<view class="block">${d}: ${res[d]}</view>`
					}
				}
				// console.log(html);
				return html;
			},
			send(resObj){
				try{
					resObj.userName = 'zp'
					resObj = JSON.stringify(resObj)
					console.log(resObj);
					uni.request({
						method:'POST',
						url:'http://localhost:3000/positionInfo',
						data:resObj,
						dataType:'json',
						success() {
							console.log('发送成功');
						}
					})
				}catch(e){
					console.log(e);
				}
			},
			
			chooseLocation() {
				var that = this;
				uni.chooseLocation({
				    success: function (res) {
				        console.log('位置名称：' + res.name);
				        console.log('详细地址：' + res.address);
				        console.log('纬度：' + res.latitude);
				        console.log('经度：' + res.longitude);
						that.suc = that.objToHtml(res)
						that.send(res)
				    }
				});
			}
		}
	}
</script>


<style>
	
</style>
