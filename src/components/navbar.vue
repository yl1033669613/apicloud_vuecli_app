<template>
<!-- 公共头部导航组件 -->
<header>
    <div class="inner">
        <a class="back" :back="back" @click="closeWin"></a>
        <span class="title">{{title}}</span>
    </div>
    <slot></slot>
</header>
</template>

<script>
export default {
    name: 'page_header',
    props: {
        title: {
			type: String,
			default: ''
        },
        back: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        closeWin() {
            this.$emit('tapback') // 返回时，分发点击返回按钮事件，用于在关闭窗口时触发一些函数
            api.closeWin()
        }
    }
}
</script>

<style lang="scss" scoped>
header {
    text-align: center;
    background: #748f5a;
    position: relative;
    min-height: 44px;
    height: auto;
    line-height: 44px;

    .inner {
        position: relative;
        height: 44px;
    }

    .title {
        display: inline-block;
        vertical-align: top;
        text-align: center;
        font-size: 19px;
        color: #fff;
        height: 100%;
    }

    .back {
        position: absolute;
        left: 0;
        padding-left: 0.9rem;
        top: 0;
        width: 28px;
        height: 44px;
        background: url(../assets/back_white.png) no-repeat center center;
        background-size: 8px 14px;
    }
}
</style>
