import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isLogin: false
    },
    mutations: {
        changeLoginStatus (state, loginStatus) {
            state.isLogin = loginStatus
        }
    }
})

export default store