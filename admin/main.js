import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

var port = 3000 
Vue.prototype.baseUrl = 'http://zhoup.top:' + port + '/admin';

//  H5开发时用本地服务器
// #ifdef H5
if (!location.href.indexOf('http://localhost')) {
	Vue.prototype.baseUrl = 'http://localhost:' + port + '/admin';
}
// #endif




App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
