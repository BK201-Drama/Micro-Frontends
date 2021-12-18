import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// Vue.config.productionTip = false

Vue.use(ElementUI);

// 引入qiankun
import { registerMicroApps, start } from 'qiankun'

// 配置数组，用于配置每个子应用
const apps = [
  {
    name: 'vueApp', // 子应用的名字
    entry: '//localhost:15000', // 子应用的入口，基座可以加载内部的东西，但是子应用必须支持跨域，用fetch
    container:'#vue', // 加载容器
    activeRule: '/vue', // 激活的路由
    props: {
      test: 'vue'
    }
  }, {
    name: 'reactApp',
    entry: '//localhost:3000', // 子应用的入口，基座可以加载内部的东西，但是子应用必须支持跨域，用fetch
    container:'#react',
    activeRule: '/react',
    props: {
      test: 'react'
    }
  }
]

// 注册运行
registerMicroApps(apps)
start()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
