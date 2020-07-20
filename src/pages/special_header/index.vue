<template>
<div class="container">
    <navbar :title="title" :back="back">
        <div class="right-btn">按钮</div>
        <!-- 一个tabbar例子 -->
        <div class="tabbar">
            <div class="tabbar-item" v-for="(item, i) in tabbar" :key="i" :class="{active: i === tabbarIdx}" @click="switchTabbar(i)">
                <span>{{item}}</span>
            </div>
        </div>
    </navbar>
</div>
</template>

<script>
import Navbar from '../../components/navbar'
export default {
    name: 'special_header',
    components: {
        Navbar
    },
    data() {
        return {
            pageName: '',
            title: '',
            back: true,

            tabbar: ['全部', '推荐', '视频信息', '文字信息', '音频信息'],
            tabbarIdx: 0
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
        }, 0)
    },
    methods: {
        switchTabbar(idx) {
            if (idx !== this.tabbarIdx) {
                this.tabbarIdx = idx
            }
        }
    }
}
</script>

<style lang="scss">
.container {
    height: 100%;
    width: 100%;
}

.right-btn {
    position: absolute;
    right: 0;
    bottom: 1rem;
    width: 70px;
    height: 44px;
    color: #fff;
    font-size: 0.28rem;
}

.right-btn:active {
    background: rgba(0, 0, 0, 0.05);
}

/*tabbar*/

.tabbar {
    height: 1rem;
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    padding: 0 0.2rem;
}

.tabbar .tabbar-item {
    height: 100%;
    position: relative;
    text-align: center;
    font-size: 0.28rem;
    padding: 0 0.1rem;
    line-height: 1rem;
}

.tabbar .tabbar-item span {
    position: relative;
    display: block;
    transition: all 0.3s;
}

.tabbar .tabbar-item span::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.1rem;
    height: 4px;
    border-radius: 4px;
    background: #fff;
    transition: all 0.3s;
}

.tabbar .tabbar-item.active span {
    color: #7d8971;
}

.tabbar .tabbar-item.active span::after {
    background-color: #7d8971;
}
</style>
