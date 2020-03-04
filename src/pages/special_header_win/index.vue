<template>
<div class="container">
    <p class="txt">这是一个使用特殊header 的 window</p>
    <p>可以看到header 上扩展了一个文字按钮</p>
    <p>以及一个tabbar实例</p>
</div>
</template>

<script>
export default {
    name: 'special_header_win'
}
</script>

<style lang="scss">
html {
    background: #f9f9f9;
}

.container {
    font-size: 0.3rem;
    font-weight: bold;
    padding: 1rem 0;
    text-align: center;
}
</style>
