import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
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
  // 配置为 vuex 的插件
  plugins: [createPersistedState()]
})
// vuex默认保存在内存中,所以刷新所有的值会回归初始化(无法做到持久存储
// 于是下载那个插件，它可以帮我们同步到浏览器的本地存储
