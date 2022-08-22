const { defineConfig } = require('@vue/cli-service')

// 需要排除的包对象
let externals = {}
// 需要配置的 CDN 链接
let CDN = { css: [], js: [] }
// 判断是否是生产环境
const isProduction = process.env.NODE_ENV === 'production'
// 如何是生产环境，需要执行以下逻辑
if (isProduction) {
  externals = {
    /**
     * externals 对象属性解析：
     * '包名': '在项目中引入的名字'
     * 以 element-ui 举例 我再 main.js 里是以
     * import ELEMENT from 'element-ui'
     * Vue.use(ELEMENT)
     * 这样引入的，所以我的 externals 的属性值应该是 ELEMENT
     * 一定要去main.js设置
     */
    echarts: 'echarts',
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    dayjs: 'dayjs',
    'element-ui': 'ELEMENT',
    'vue-quill-editor': 'VueQuillEditor',
    'vuex-persistedstate': 'createPersistedState'
  }
  CDN = {
    css: [
      // element-ui css 样式表
      'https://unpkg.com/element-ui@2.15.8/lib/theme-chalk/index.css',
      'https://unpkg.com/quill@1.3.7/dist/quill.core.css',
      'https://unpkg.com/quill@1.3.7/dist/quill.snow.css',
      'https://unpkg.com/quill@1.3.7/dist/quill.bubble.css'
    ],
    js: [
      'https://unpkg.com/echarts@5.3.2/dist/echarts.min.js',
      'https://unpkg.com/vue@2.6.14/dist/vue.js',
      'https://unpkg.com/vue-router@3.5.1/dist/vue-router.js',
      'https://unpkg.com/vuex@3.6.2/dist/vuex.js',
      'https://unpkg.com/axios@0.27.2/dist/axios.min.js',
      'https://unpkg.com/dayjs@1.11.3/dayjs.min.js',
      'https://unpkg.com/element-ui@2.15.8/lib/index.js',
      'https://unpkg.com/quill@1.3.7/dist/quill.js',
      'https://unpkg.com/vue-quill-editor@3.0.6/dist/vue-quill-editor.js',
      'https://unpkg.com/vuex-persistedstate@3.2.1/dist/vuex-persistedstate.umd.js'
    ]
  }
}

module.exports = defineConfig({
  transpileDependencies: true,
  // 影响打包时， index.html引入其他资源的前缀地址
  // ./可以让开发环境和生产环境都可以正常使用
  // 为了严谨一些,开发环境:‘/',生产环境:'./'
  // 问题:有无代码可以让他自己识别当前运行环境?
  // node里有个内置的环境变量process.env.NODE_ENV
  // process.env.NODE_ENV 它会根据你敲击的命令，来使用不同的值,解决:
  // 如果你敲击yarn server,process.env.NODE_ENV的值就是 'development' 字符串
  // 如果你敲击yarn build , process.env.NODE_ENV的值就是 'production' 字符串
  publicPath: isProduction ? './' : '/',
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    // name,
    externals: externals
  },
  chainWebpack(config) {
    // 注入cdn变量(打包时会执行)
    config.plugin('html').tap((args) => {
      // 参数对象添加属性叫cdn，值就是上面CDN对象
      args[0].cdn = CDN // 配置 CDN 给插件
      return args
    })
    // 省略其他...
  }
})

// 我们虽然排除掉了第三方的包
// 打包dist和开发环境都会使用这套配置，并排除掉第三方
// 生产环境，打包时会以public/index.html作为模板生成dist/index.html， index.html中就有了那些cdt地址
// 开发环境，public/index.html，也有那些第三方的cdn地址，所以也能正常运行
// 但是第一次的速度有点慢，所以开发环境呢我还是想让webpack引入本地的node_modules那些第三方包l/ process.env.NODE_ENV可以根据敲击的命令不同，值也不同，能够一个代码区分不同环境

// 总结:
// 1. publicPath:影响的是打包(webpack开发服务器/dist)的时候index.html引入其他资源的前缀地址
// 情况1:开发环境，值:‘/'
// 情况2:生产环境，值:'./’(才能确保dist/index.html相对路径下访问)
// 2. dist瘦身:影响dist的体积，其他第三方包用cdn地址引入到index.html中保证运行//情况1:开发环境
// (1): externals无值(不排除第三方包)
// (2): index.html里不引入cdn地址
// 情况2:生产环境
// (1): externals有值(排除第三方包)
// (2): index.html引入cdn地址
