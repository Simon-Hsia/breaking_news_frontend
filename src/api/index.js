import request from '@/utils/request'

export const registerAPI = () => {
  // 这里先用这个接口测试下, 如果url以http开头会忽略baseURL, axios直接请求此地址
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username: 'admin',
      password: '123123',
      repassword: '123123'
    }
  })
}
