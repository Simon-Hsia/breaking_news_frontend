import request from '@/utils/request'

/**
 * 注册接口
 * @param {*} form { username:用户名,password:密码,repassword:重复密码}
 * @returns Promise对象
 */
export const registerAPI = (form) => {
  // 这里先用这个接口测试下, 如果url以http开头会忽略baseURL, axios直接请求此地址
  return request({
    url: '/api/reg',
    method: 'POST',
    data: form
  })
}

/**
 * 登录接口
 * @param {*} param0 { username: 用户名, password: 密码 }
 * @returns Promise对象
 */
export const loginAPI = (form) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: form
  })
}

/**
 * 获取用户信息的接口
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
    // method不写默认就是 get 请求
  })
}

/**
 * 退出登录，重新登录，只走相关组件代码（异步dom切换，不会导致所有代码重新执行，App.vue不走)
 * 效果不对:你换个账号它得重新请求用户数据呀
 * 解决:
 * 1．可以在登录页面，登录成功后，再发请求去拿到用户信息
 * 2．可以在全局前置路由守卫中，写（路由跳转的时候，判断+获取)
 * 3.个人认为可以在layout里面的created调用initUserInfo
 */

/**
 * 获取-侧边栏菜单数据
 * @returns Promise对象
 */
export const getMenusAPI = () => {
  return request({
    url: '/my/menus'
  })
}

/**
 * 更新-用户基本资料
 * @param {*} param0 { id: 用户id, email: 用户邮箱, nickname: 用户昵称, user_pic: 用户头像地址, username: 用户名 }
 * @returns Promise对象
 */
export const updateUserInfoAPI = (form) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: form
  })
}

/**
 * 更新-用户头像
 * @param {*} avatar 头像的base64字符串
 * @returns Promise对象
 */
export const updateAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}

/**
 * 更新-用户密码
 * @param {*} form { old_pwd: 旧密码, new_pwd: 新密码, re_pwd: 新密码确认 }
 * @returns Promise对象
 */
export const updatePwdAPI = (form) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: form
  })
}

/**
 * 获取文章分类
 * @returns Promise对象
 */
export const getArtCateListAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 提交新增分类
 * @param {*} form { cate_name: 文章分类名字, cate_alias: 文章分类别名 }
 * @returns Promis对象
 */
export const addArtCateAPI = (form) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: form
  })
}

/**
 * 更新-文章分类
 * @param {*} param0 { id: 文章分类id, cate_name: 文章分类名字, cate_alias: 文章分类别名 }
 * @returns Promise对象
 */
export const updateArtCateAPI = (artcate) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: artcate
  })
}

/**
 * 删除-文章分类
 * @param {*} id 要删除的-文章分类id
 * @returns Promise对象
 */
export const delArtCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}
