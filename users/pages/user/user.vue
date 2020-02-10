<template>
	<view>
		<view v-for="(d, index) in websiteList" :key="index">
			<text @click="updateHome(d.src)">{{d.name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				websiteList: [],
			};
		},
		onLoad() {
			var that = this;
			
			that.websiteList = [
				{
					name: 'to be continued',
					src: 'http://www.gddyu.com/'
				},
				{
					name: 'vip智能解析',
					src: 'http://www.gddyu.com/'
				},
				{
					name: 'vip智能解析2',
					src: 'http://jx.jzlemiao.cn/'
				},
				{
					name: '爱酷vip解析',
					src: 'https://www.ikukk.com/'
				},
				{
					name:'黑米影院-实时更新最新免费电影电视剧动漫综艺手机在线看',
					src: 'https://www.tv432.com'
				}
			]
			
			// uni.request({
			// 	url: this.baseUrl + '/websiteList',
			// 	success(d) {
			// 		console.log(d);
					
			// 		that.websiteList = d
			// 	}
			// })
		},
		methods:{
			updateHome(src){
				console.log(src);
				var that = this;
				
				uni.switchTab({
					url:'../index/index',
				})
			}
		}
	}
</script>

<style lang="less">

</style>
