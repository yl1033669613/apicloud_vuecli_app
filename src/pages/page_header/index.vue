<template>
<div class="container">
    <navbar :title="title" :back="back"></navbar>
</div>
</template>

<script>
import Navbar from '../../components/navbar'
export default {
    name: 'page_header',
    components: {
        Navbar
    },
    data() {
        return {
            pageName: '',
            title: '',
            back: true
        }
    },
    mounted() {
        const self = this
        let pageParam = api.pageParam
        self.title = pageParam.title || ''
        self.back = pageParam.back || true
        self.pageName = pageParam.pageName
        setTimeout(() => {
            self.$comm.openFrame(pageParam.pageName, pageParam)
            // 窗口尺寸变化时调整frame布局
            self.$comm.resizeFrame(pageParam.pageName + '_frame', 2)
        }, 0)
        // 当页面有frame弹窗时先关闭frame弹窗再关闭页面， 需监听系统返回事件
        api.addEventListener({
            name: 'keyback'
        }, () => {
            if (!self.$comm.keyBackToClosePop()) return
            api.removeEventListener({
                name: 'keyback'
            })
            api.closeWin()
        })
    }
}
</script>

<style lang="scss">
.container {
    height: 100%;
    width: 100%;
}
</style>
