import request from '@/utils/request'

export const registerAPI = (from) => {
  // 这里先用这个接口测试下, 如果url以http开头会忽略baseURL, axios直接请求此地址
  return request({
    url: '/api/reg',
    method: 'POST',
    data: from
  })
}

/**
 * 登录接口
 * @param {*} param0 { username: 用户名, password: 密码 }
 * @returns Promise对象
 */
export const loginAPI = (from) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: from
  })
}
