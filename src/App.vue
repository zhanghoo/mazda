<template>
    <div id="app">
        <transition name="el-fade-in-linear" mode="out-in">
            <router-view/>
        </transition>
        <div class="iframe-button">金牌导购</div>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang='stylus'>
#app {
    position: relative;
    width: 100%;
    background: url('~@/assets/img/body_bg.jpg') left top no-repeat;
    background-size: cover;
    a {
        text-decoration: none;
        outline: none;
    }
}
@media screen and (max-width: 200px) {
    #app {
        flex-center();
        width: 100%;
        height: 100%;
        background: #000;
        *:not(.iframe-button) {
            display: none;
        }
        .iframe-button {
            color: #999;
            font-size: 14px;
            font-weight: 600;
            padding: 5px 0;
        }
    }
}
</style>
