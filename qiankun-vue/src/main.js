import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Vue.config.productionTip = false

let instance = null
function render (props) {
  console.log(props)
  instance = new Vue({
    router,
    render: h => h(App)
  }).$mount('#app');// 这个是挂载到自己的html中，基座拿到挂载后的html插入进基座里面
}

// 使用webpack运行时publicPath配置【动态加载publicPath】
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

// 设置独立运行微应用【子应用】
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}


// ---------------------- 子组件协议 -------------------------- //

export async function bootstrap (props) {};

export async function mount (props) {
  render(props) // 挂载
}

export async function unmount (props) {
  instance.$destroy(); // 卸载
}