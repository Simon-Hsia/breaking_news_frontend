import Vue from 'vue'
import App from './App.vue'
import router from './router'

import store from './store'

import '@/assets/global.less' // 全局初始化样式
import '@/elementUI' // 注册elementUI组件,参与打包

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入dayjs方法
import dayjs from 'dayjs'

// 定义时间格式化函数
Vue.prototype.$formatDate = (dateObj) => {
  return dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')
}
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

/*
前端:
前提:通过input[ type=file]让用户选择文件，通过事件对象.target.files拿到用户选择的"文件对象'预览:img标签的src属性的值(base64字符串/图片链接地址)
情况1:文件转成图片base64字符串:new FileReader()
给src属性赋予base64字符串（图片数据转base64字符串)，特点以data:image/ png;base64,开头
情况2:文件转成图片链接地址:URL.createobjURL(文件)
注意:它的地址只能在前端使用
需求:把用户选择的文件发给后台保存在服务器上
情况1;文件转成图片base64字符串，传递给后台
情况2:用new FormData()表单数据直接装文件本身，直接传递给后台 */
