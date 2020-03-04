<template>
<div class="container">
    <div class="home-slider" ref="homeSlider"></div>
    <div class="home-content">
        <div class="btn-group line-spt-bott">
            <div class="area-row">
                1. app退出示例，关闭frameGroup打开登陆页
            </div>
            <!-- 退出示例，通过在root（index）页打开frame来实现。因此退出登录时需要先返回到root（index）页-->
            <div class="btn" @click="logOut">退出</div>
        </div>
        <div class="btn-group line-spt-bott">
            <div class="area-row">
                2. 公共头部和特殊头部页面的实现
            </div>
            <!-- 打开普通头部导航的window -->
            <div class="btn" @click="openWin()">普通win</div>
            <!-- 打开特殊头部导航的 window， 特殊的头部导航需要自定义 -->
            <div class="btn" @click="openSpecialHeaderWin()">特殊win</div>
        </div>
        <div class="btn-group line-spt-bott">
            <!-- 打开带透明蒙层的 frame 弹窗，样式需自定义 -->
            <div class="area-row">
                3. 打开带透明蒙层的frame弹窗（当页面有frame弹窗时先关闭frame弹窗再关闭页面）
            </div>
            <div class="btn" @click="openFramePop">frame 弹窗</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'home',
    data() {
        return {}
    },
    mounted() {
        const self = this
        // 下拉刷新 使用模块：UIPullRefreshFlash
        self.$comm.pullDown(() => {
            self.showProgress('请稍候...')
            setTimeout(() => {
                self.hideProgress()
                api.refreshHeaderLoadDone()
            }, 1000)
        })
        self.$comm.pullUp(() => {
            // 上拉加载 监听页面触底实际 scrolltobottom
        })
    },
    methods: {
        // 打开普通头部导航的 window, 普通头部导航默认使用公共导航 page_header
        openWin() {
            this.$comm.openWin({
                name: 'normal_header_win',
                pageParam: {
                    title: '普通win'
                }
            })
        },
        // 打开特殊头部导航的 window
        openSpecialHeaderWin() {
            this.$comm.openWin({
                name: 'special_header_win', // 实际主体 name
                headerName: 'special_header', // 需要传特殊头部导航页面name
                pageParam: {
                    title: '特殊win'
                }
            })
        },
        // 退出登录
        logOut() {
            const self = this
            api.confirm({
                title: '提示',
                msg: '登出提示',
                buttons: ['确定', '取消']
            }, (ret, err) => {
                if (ret.buttonIndex == 1) {
                    self.rmStorage('token') // 退出清空登录授权
                    api.execScript({ // 打开登录窗口 也可以不用打开直接回到首页
                        name: 'root',
                        script: '$vm.openLoginWhenTokenInvalid()'
                    })
                    // 关闭页面并回到root 页
                    api.closeToWin({
                        name: 'root',
                        animation: {
                            type: "movein",
                            subType: "from_left",
                            duration: 300
                        }
                    })
                }
            })
        },
        // 打开一个新的frame 弹窗
        openFramePop() {
            // 打开 frame 弹窗 第二个参数为所传参数
            this.$comm.openPopFrame('tmp_pop', {
                title: 'frame 弹窗'
            })
        }
    }
}
</script>

<style lang="scss">
.area-row {
    width: 100%;
    line-height: .6rem;
    text-align: left;
    margin: .2rem 0;
    font-size: .24rem;
}

.btn-group {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    min-height: .8rem;
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    margin: .2rem 0;
    padding: 0 .2rem;

    .btn {
        height: .6rem;
        line-height: .6rem;
        font-size: .24rem;
        color: #b7c1b6;
        border-radius: .6rem;
        border: 1px solid #b7c1b6;
        padding: 0 .4rem;
        text-align: center;
        transition: all .3s;
        margin-right: .1rem;
        margin-bottom: .2rem;
    }

    .btn:active {
        color: #6c8a69;
        border-color: #6c8a69;
        background: rgba(0, 0, 0, .05);
    }
}
</style>
