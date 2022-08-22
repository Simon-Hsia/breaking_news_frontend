import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
// 创建一个自定的axios方法(比原axios多了个基地址)
// axios函数请求的url地址前面会被拼接基地址, 然后axios请求baseURL+url后台完整地址
export const baseURL = 'http://big-event-vue-api-t.itheima.net'
const request = axios.create({ baseURL })

// 定义请求拦截器
// 白名单: 不需要携带token的api地址
const whiteAPIList = ['/api/reg', '/api/login']
request.interceptors.request.use(
  function (config) {
    // 不在白名单的请求在发起前都会进入一次
    if (!whiteAPIList.includes(config.url)) {
      // 传参给后台: params(查询字符串query), data(请求体body)，headers(请求头)
      // 为请求头挂载 Authorization 字段
      config.headers.Authorization = store.state.token
      // this.$store.state.token这里this不是组件对象不能用this.$store拿到store对象
    }
    // 它返回给axios内源码，config配置对象(要请求后台的参数都在这个对象上)
    return config
  },
  function (error) {
    /**
     * 请求发起前的代码，如果有异常报错，会直接进入这里
     * 返回一个拒绝状态的Promise对象(axios留在原地的Promise对象状态就为失败结果为error变量值)
     * 此函数类似catch函数()里return
     * 口诀:return非Promise对象值，会作为成功的结果，返回给下一个Promise对象(axios留在原地)
     * Promise.reject()原地留下一个新的Promise对象(状态为失败）它是Promise的类方法reject(
     *return new Promise((resolve, reject) =>{*reject(error)
     * })
     */

    return Promise.reject(error)
  }
)
// 定义响应拦截器
request.interceptors.response.use(
  /*  响应状态码2xx和3xx进入第一个函数,
      直接返回响应内容,
      如果响应状态码为4xx和5xx则会进入第二个函数,
      我们做具体判断和逻辑 */
  function (response) {
    // 响应状态码为 2xx 时触发成功的回调，形参中的 response 是“成功的结果”
    return response
  },
  // 调试小技巧：去应用里给token加点料，就过期了
  function (error) {
    // 响应状态码不是 2xx 时触发失败的回调，形参中的 error 是“失败的结果”
    if (error.response.status === 401) {
      // 无效的 token
      // 把 Vuex 中的 token 重置为空，并跳转到登录页面
      store.commit('updateToken', '')
      store.commit('updateUserInfo', {})
      router.push('/login')
      Message.error('用户身份已过期，请重新登录!!!')
    }
    return Promise.reject(error)
  }
)
// 导出自定义的axios方法, 供外面调用传参发请求
export default request
