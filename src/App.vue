<template>
    <div id="app">
        <transition name="el-fade-in-linear" mode="out-in">
            <router-view />
        </transition>
        <!-- progress-bar-->
        <vue-progress-bar></vue-progress-bar>
    </div>
</template>

<script>
export default {
    name: 'App',
    created() {
        this.$Progress.start()
        this.$router.beforeEach((to, from, next) => {
            this.$Progress.start()
            next()
        })
        this.$router.afterEach((to, from) => {
            this.$Progress.finish()
        })
    },
    mounted() {
        this.$Progress.finish()
    }
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
</style>
