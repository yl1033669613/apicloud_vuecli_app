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
            const self = this
            self.showProgress('请稍候...')
            setTimeout(() => {
                self.hideProgress()
                self.toast({
                    msg: '登录成功',
                    duration: 600
                })
                self.setStorage('token', 'test token')
                setTimeout(() => {
                    api.execScript({
                        name: 'root',
                        script: '$vm.loginDone()'
                    })
                    api.closeFrame()
                }, 800)
            }, 1500)
        }
    }
}
</script>

<style lang="scss">
.login-content {
    padding: 2rem .3rem;
    box-sizing: border-box;
    height: 100vh;
    position: relative;
}

.btn-block {
    position: absolute;
    left: .8rem;
    right: .8rem;
    top: 50%;
    transform: translate(0, -50%);
    -webkit-transform: translate(0, -50%);
    background-color: #b7c1b6;
    height: .8rem;
    text-align: center;
    color: #fff;
    font-size: .3rem;
    line-height: .8rem;
    border-radius: .1rem;
    transition: all .3s;
}

.btn-block:active {
    opacity: .8;
}

.login-title {
    text-align: center;
    padding-top: 1rem;
    font-size: .34rem;
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
    margin-top: .5rem;
    text-align: center;
    color: #ccc;
    font-size: .24rem;
}
</style>
