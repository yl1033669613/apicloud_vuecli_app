<template>
	<div class="container">
		<div class="login-content">
			<p class="login-title">登录 模板</p>
			<p class="txt-note">登录窗口从 root 页面以frame的形式打开</p>
			<div class="btn-block" @click="loginHandle">登录</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'login',
	methods: {
		loginHandle() {
			const self = this;
			self.showProgress('请稍候...');
			setTimeout(() => {
				self.hideProgress();
				self.toast({
					msg: '登录成功',
					duration: 600,
				});
				self.setStorage('token', 'test token');
				setTimeout(() => {
					api.execScript({
						name: 'root',
						script: '$vm.loginDone()',
					});
					api.closeFrame();
				}, 800);
			}, 1500);
		},
	},
};
</script>

<style lang="scss">
.login-content {
	padding: 2rem 0.3rem;
	box-sizing: border-box;
	height: 100vh;
	position: relative;
}

.btn-block {
	position: absolute;
	left: 0.8rem;
	right: 0.8rem;
	top: 50%;
	transform: translate(0, -50%);
	-webkit-transform: translate(0, -50%);
	background-color: #b7c1b6;
	height: 0.8rem;
	text-align: center;
	color: #fff;
	font-size: 0.3rem;
	line-height: 0.8rem;
	border-radius: 0.1rem;
	transition: all 0.3s;
}

.btn-block:active {
	opacity: 0.8;
}

.login-title {
	text-align: center;
	padding-top: 1rem;
	font-size: 0.34rem;
	font-weight: bold;
	position: relative;
}

.login-title:after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: -0.2rem;
	height: 1px;
	background: #b7c1b6;
	width: 1rem;
	margin: 0 auto;
}

.txt-note {
	margin-top: 0.5rem;
	text-align: center;
	color: #ccc;
	font-size: 0.24rem;
}
</style>
