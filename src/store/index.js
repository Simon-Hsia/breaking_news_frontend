import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '' // 保存toekn字符串
  },
  getters: {},
  mutations: {
    // 保存token
    updateToken(state, val) {
      state.token = val
    }
  },
  actions: {},
  modules: {}
})
