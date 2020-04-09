import Vue from 'vue'
import App from './index.vue'
import Common from '../../libs'

Common() // 初始化公共库

Vue.config.productionTip = false

// 判断是否为 app 环境
const isApp = window.navigator.userAgent.toLowerCase().indexOf('apicloud') !== -1
let vm = null
if (isApp) {
	window.apiready = () => {
		vm = new Vue({
			render: h => h(App)
		}).$mount('#app')
		vm.$nextTick(() => {
			// 页面渲染完成时 执行一次app Page Ready
			vm.$appPageReady()
		})
		// 将页面组件vue实例挂载在window对象上方便使用 api.execScript({name:'winName', script: '$vm.someVueMethods()'})
		window.$vm = vm.$children[0]
	}
} else {
	vm = new Vue({
		render: h => h(App)
	}).$mount('#app')
}
