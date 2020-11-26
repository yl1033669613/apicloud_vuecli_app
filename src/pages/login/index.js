import Vue from 'vue';
import App from './index.vue';
import { isApp, appPageReady } from '../../libs';

Vue.config.productionTip = false;

if (isApp) {
	window.apiready = () => {
		appPageReady(
			new Vue({
				render: (h) => h(App),
			}).$mount('#app')
		);
	};
} else {
	new Vue({
		render: (h) => h(App),
	}).$mount('#app');
}
