import Vue from 'vue'
import Vuex from 'vuex'

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
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
