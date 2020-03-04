<template>
<div class="container">
    <div class="pop-body-fillinfo">
        <div class="pop-head">
            <p class='title'>提示</p>
        </div>
        <div class="content">
            <p>
                这是一个{{txt}} <br> 可以自定义样式
            </p>
        </div>
        <div class="btn-confirm-row">
            <div class="btn-item cancel" @click="cancelHandle">
                取消
            </div>
            <div class="btn-item confirm" @click="confirmHandle">
                确定
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'tmp_pop',
    data() {
        return {
            txt: ''
        }
    },
    mounted() {
        let param = api.pageParam
        this.txt = param.title
    },
    methods: {
        confirmHandle() {
            api.closeFrame()
        },
        cancelHandle() {
            api.closeFrame()
        }
    }
}
</script>

<style lang="scss">
html {
    background: transparent;
}

.container {
    background: rgba(0, 0, 0, 0.65);
    height: 100vh;
    position: relative;
}

.pop-body-fillinfo {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    margin: auto;
    width: 85%;
    transform: translate(0, -50%);
    -webkit-transform: translate(0, -50%);
    background: #fff;
    border-radius: 0.2rem;
    box-sizing: border-box;
    padding-bottom: 1.2rem;

    .pop-head {
        border-radius: 0.2rem;
        height: 1.5rem;
        background-size: 100% 100%;
        background-color: #fff;
        background-position: center center;
    }

    .pop-head .title {
        text-align: center;
        font-size: 0.4rem;
        color: #333;
        line-height: 1.5rem;
        letter-spacing: 2px;
    }

    .content {
        padding: 0 0.5rem 0.2rem 0.5rem;
        text-align: center;
        font-size: 0.28rem;
    }

    .content p {
        word-break: break-all;
    }

    .btn-confirm-row {
        width: 100%;
        position: absolute;
        bottom: 0;
        display: flex;
        display: -webkit-flex;
        border-top: 1px solid #e5e5e5;
        height: 1rem;
    }

    .btn-confirm-row .btn-item {
        width: 100%;
        text-align: center;
        line-height: 1rem;
        font-size: 0.32rem;
    }

    .btn-confirm-row .btn-item.cancel {
        color: #999999;
        border-right: 1px solid #e5e5e5;
    }

    .btn-confirm-row .btn-item.confirm {
        color: #b7c1b6;
    }

    .btn-confirm-row .btn-item:active {
        background: rgba(0, 0, 0, 0.03);
    }
}
</style>
