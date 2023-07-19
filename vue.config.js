const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 通过chainWebpack自定义打包入口(默认是共用main.js)
  chainWebpack:config=>{
    config.when(process.env.NODE_ENV === 'production',config=>{
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals',{
        'vue-router':'VueRouter',
        axios:'axios',
        lodash:'_',
        echarts:'echarts',
        nprogress:'NProgress',
        'vue-quill-editor':'VueQuillEditor'
      })
      config.plugin('html').tap(args=>{
        args[0].isProd = true
        return args
      })
    })
    config.when(process.env.NODE_ENV === 'development',config=>{
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args=>{
        args[0].isProd = false
        return args
      })
    })
  }
})
