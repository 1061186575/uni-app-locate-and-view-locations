<template>
	<view>
		<web-view  :src="chatUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chatUrl: 'http://localhost:4000/'
			};
		},
		onLoad() {
			var that =this;
			uni.request({
				url: `${this.baseUrl}/chatUrl`,
				success(d) {
					// console.log(d);
					if (d.data && d.data.src) {
						that.chatUrl = d.data.src;
					}
				}
			});
		}
	}
</script>

<style lang="less">

</style>
