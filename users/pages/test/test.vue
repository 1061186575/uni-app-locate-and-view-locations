<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		created() {
			uni.openLocation({
				latitude: 30.669190804864563,
				longitude: 104.10187343530437,
				success: function () {
					console.log('success');
				}
			});
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
