<template>
<!-- 这是app启动的root页面 必须命名为index -->
<div id="wrap" class="flex-wrap flex-vertical" @touchmove="handleRootPageScoll($event)">
    <!-- 根页面头部，单独样式，请使用<header>标签 -->
    <header ref="header">
        <div class="inner">
            <span class="title" v-for="(item, idx) in tabs" :key="idx" v-show="active === idx">{{item.name}}</span>
        </div>
    </header>
    <div id="main" class="flex-con"></div>
    <div id="footer" ref="footer" :style="{paddingBottom: safeAreaBott + 'px'}">
        <ul class="flex-wrap">
            <li class="flex-con" v-for="(item, index) in tabs" :key="index" @click="switchTab(index)" :class="{active: index === active}">
                <!-- 利用切换css的visibility属性达到几乎完美的首页tab切换 -->
                <span :style="{visibility: index !== active ? 'visible' : 'hidden', backgroundImage: 'url('+ item.normal +')'}"></span>
                <span :style="{visibility: index === active ? 'visible' : 'hidden', backgroundImage: 'url('+ item.active +')'}"></span>
                {{item.name}}
            </li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
    name: 'root',
    data() {
        return {
            active: 0, //底部nav bar active
            title: '首页', //底部nav bar 对应标题
            // 底部nav bar 数组 于上面 footer item 对应
            tabs: [{
                    page: 'home',
                    name: '首页',
                    normal: './image/tabbar/1.png',
                    active: './image/tabbar/1_ac.png'
                },
                {
                    page: 'profile',
                    name: '我的',
                    normal: './image/tabbar/5.png',
                    active: './image/tabbar/5_ac.png'
                }
            ],
            //登录状态
            tokenInvalid: false
        }
    },
    computed: {
        //判断底部是否存在安全区域如果有则留出安全区域 适配iphone x等机型
        safeAreaBott() {
            let bottH = 0
            if (typeof api === 'object') {
                bottH = api.safeArea.bottom
            }
            return bottH
        }
    },
    mounted() {
        const self = this
        // 初始监听app 退出
        self.ExitApp()
        // 初始判断登陆状态
        self.checkLoginState((state) => {
            if (state) {
                self.tokenInvalid = false
                api.setStatusBarStyle({ // 请根据app设计合理设置状态栏对比色
                    style: 'light'
                })
                //通过setTimeout将js放到最后执行 保证能获取到header高度
                setTimeout(() => {
                    self.initGroup()
                }, 0)
            } else {
                self.openLoginRegFrame('login')
            }
        })
    },
    methods: {
        // 根页面不需要滚动禁止根页面滚动
        handleRootPageScoll(e) {
            e.preventDefault()
        },
        // 双击退出app
        ExitApp() {
            const self = this
            let ci = 0
            let timer = null
            let time1, time2
            api.addEventListener({
                name: 'keyback'
            }, (ret, err) => {
                // 当页面有frame弹窗时先关闭frame弹窗再关闭页面
                if (!self.$comm.keyBackToClosePop()) return
                if (ci == 0) {
                    time1 = new Date().getTime()
                    ci = 1
                    timer = setTimeout(() => {
                        ci = 0
                        clearTimeout(timer)
                    }, 2000)
                    self.toast('再次操作退出')
                } else if (ci == 1) {
                    time2 = new Date().getTime()
                    if (time2 - time1 < 2000) {
                        clearTimeout(timer)
                        api.closeWidget({
                            id: api.appId,
                            retData: {
                                name: 'closeWidget'
                            },
                            silent: true
                        })
                    }
                }
            })
        },
        // 登录成功重新加载首页
        loginDone() {
            const self = this
            self.tokenInvalid = false
            api.closeFrame({
                name: 'login'
            })
            api.setStatusBarStyle({
                style: 'light'
            })
            self.initGroup()
        },
        // 初始化 framegroup
        initGroup() {
            const self = this
            api.closeFrameGroup({
                name: 'group'
            })
            let frames = []
            let tabs = self.tabs
            for (let i = 0, len = tabs.length; i < len; i++) {
                frames.push({
                    name: tabs[i].page,
                    url: `widget://${tabs[i].page}.html`,
                    bgColor: '#ffffff',
                    bounces: true,
                    vScrollBarEnabled: false,
                    hScrollBarEnabled: false,
                    scaleEnabled: false,
                    overScrollMode: 'scrolls'
                })
            }
            // 设置frameGroup位置
            let rect = {
                x: 0,
                y: self.$refs.header.offsetHeight,
                w: api.winWidth,
                h: api.winHeight -
                    self.$refs.header.offsetHeight -
                    self.$refs.footer.offsetHeight
            }
            self.$comm.resizeFrame('group', 0) // 监听root页窗口变化，从而重新设置frameGroup的高度
            api.openFrameGroup({
                name: 'group',
                scrollEnabled: false,
                preload: 0,
                rect: rect,
                index: self.active,
                frames: frames
            })
        },
        // root 页底部tab切换
        switchTab(index) {
            let idx = parseInt(index)
            if (this.active != idx) {
                this.active = idx
                this.title = this.tabs[idx].name
                api.setFrameGroupIndex({
                    name: 'group',
                    index: idx
                })
                this.resetFrameRect()
            }
        },
        //重新设置frameGroup的位置
        resetFrameRect() {
            const self = this
            self.$nextTick(() => {
                api.setFrameGroupAttr({
                    //重新设置frame 位置
                    name: 'group',
                    rect: {
                        x: 0,
                        y: self.$refs.header.offsetHeight,
                        w: api.winWidth,
                        h: api.winHeight -
                            self.$refs.header.offsetHeight -
                            self.$refs.footer.offsetHeight
                    }
                })
            })
        },
        // 登录相关----------------------------------------
        //判断登陆状态
        checkLoginState(cb) {
            let token = this.getStorage('token')
            if (token) {
                cb && cb(true)
            } else {
                cb && cb(false)
            }
        },
        // 打开登录frame
        openLoginRegFrame(name) {
            api.setStatusBarStyle({
                style: 'dark'
            })
            this.$comm.openFrame(name, null, {
                rect: {
                    x: 0,
                    y: 0,
                    w: api.winWidth,
                    h: api.winHeight
                },
                animation: {
                    type: 'movein',
                    subType: 'from_right',
                    duration: 300
                }
            })
        },
        // token失效的情况弹出登陆窗口
        openLoginWhenTokenInvalid() {
            const self = this
            if (!self.tokenInvalid) {
                self.tokenInvalid = true
                setTimeout(() => {
                    self.active = 0
                    self.title = self.tabs[self.active].name
                    // 退出登录 则关闭framegroup
                    api.closeFrameGroup({
                        name: 'group'
                    })
                    self.openLoginRegFrame('login')
                }, 0)
            }
        }
    }
}
</script>

<style lang="scss">
html,
body,
#wrap {
    margin: 0;
    height: 100vh;
    overflow: hidden;
}

.flex-wrap {
    display: flex;
}

.flex-vertical {
    -webkit-box-orient: vertical;
    -webkit-flex-flow: column;
    flex-flow: column;
}

.flex-con {
    overflow: auto;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}

/*footer*/

#footer {
    background-color: #f7f7f7;
    font-size: 0.2rem;
    padding: 0.1rem 0 0 0;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;

    ul {
        padding-bottom: 0.1rem;

        li {
            position: relative;
            padding-top: 0.5rem;
            text-align: center;
            font-size: 0.2rem;
            color: #bec0bf;
            transition: all .2s;

            &.active {
                color: #748f5a;
            }

            span {
                width: 100%;
                height: 0.5rem;
                position: absolute;
                left: 0;
                top: 0;
                background: url(../../assets/placeH_pic.png) no-repeat center 2px;
                background-size: auto 0.4rem;
            }
        }
    }
}

/*footer end*/

// root header
header {
    text-align: center;
    background: #748f5a;
    position: relative;
    height: auto;
    min-height: 44px;
    line-height: 44px;

    .inner {
        height: 44px;
        position: relative;
    }

    .title {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        display: inline-block;
        vertical-align: top;
        text-align: center;
        font-size: 19px;
        color: #fff;
        height: 100%;
        z-index: 10;
    }
}
</style>
