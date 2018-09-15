import Vue from 'vue'
import Vuex from 'vuex'
import Router from '@/router'
import cache from '@/utils/cache'
import JIM from '@/api/jim'
import { kfuLogin, kfuLoginOut } from '@/api'

Vue.use(Vuex)

const state = {
    initData: '',
    userInfo: ''
}

const getters = {
}

const mutations = {
    SET_INIT_DATA(state, val) {
        state.initData = val
    },
    SET_USER_INFO(state, val) {
        state.userInfo = val
    }
}

const actions = {
    kfuLogin({ state }) {
        kfuLogin(state.userInfo.username).then(res => {
            console.log('客服登录', res)
        })
    },
    kfuLoginOut({ state }) {
        kfuLoginOut(state.userInfo.username).then(res => {
            console.log('客服退出登录', res)
            JIM.loginOut()
            cache.removeToken()
            Router.push({ name: 'login' })
        })
    }
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
