import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    userInfo: ''
}

const getters = {
}

const mutations = {
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
