import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false


Vue.prototype.baseUrl = 'http://zhoup.top:3000'

//  H5开发时用本地服务器
// #ifdef H5
	if (!window.location.href.indexOf('http://localhost')) {
		Vue.prototype.baseUrl = 'http://localhost:3000';
	}
// #endif


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
