import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '', // 保存toekn字符串
    userInfo: {} // 保存用户的基本信息
  },
  getters: {
    nickname: (state) => state.userInfo.nickname, // 昵称
    username: (state) => state.userInfo.username, // 用户名
    user_pic: (state) => state.userInfo.user_pic // 用户头像
  },
  mutations: {
    // 保存token
    updateToken(state, val) {
      state.token = val
    },
    // 更新用户信息
    updateUserInfo(state, info) {
      state.userInfo = info
    }
  },
  actions: {
    // 定义初始化用户基本信息的 action 函数
    async initUserInfo(store) {
      const { data: res } = await getUserInfoAPI()
      if (res.code) return
      store.commit('updateUserInfo', res.data)
    }
  },
  // 配置为 vuex 的插件
  plugins: [createPersistedState()]
})
// vuex默认保存在内存中,所以刷新所有的值会回归初始化(无法做到持久存储
// 于是下载那个插件，它可以帮我们同步到浏览器的本地存储
