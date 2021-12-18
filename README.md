# 前言

## 微前端使用意义？

- 将一个复杂的应用拆分成多个子应用
- 团队项目人员技术栈不相同时，可以使用不同的技术栈分别对子应用开发，集成不受影响



## 使用框架

qiankun



# 使用教程

## 创建微前端项目

### 创建基座应用

我们以vue为基座，用脚手架创建一个vue项目：

```cmd
vue create qiankun-base
```



### 创建子应用

我们用vue和react的脚手架分别创建一个子应用

```cmd
vue create qiankun-vue

create-react-app qiankun-react
```



## 基座配置

### 基座安装element-ui依赖包并执行相关配置

```
npm i -S element-ui
```



### 基座中的App.vue进行以下改动

```vue
<template>
  <div>
    <el-menu :router="true" mode="horizontal">
      <!-- 基座也可以放自己的路由 -->
      <el-menu-item index="/">Home</el-menu-item>
      <!-- 基座可以引用其他子应用 -->
      <el-menu-item index="/vue">vue应用</el-menu-item>
      <el-menu-item index="/react">react应用</el-menu-item>
    </el-menu>
    <router-view></router-view>
    <div id="vue"></div>    
    <div id="react"></div>
  </div>
</template>
```



### 基座中的main.js引入element-ui

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```



### 基座路由配置为Browser类型路由



### 基座添加vue.config.js

```vue
module.exports = {
  lintOnSave:false
}
```



此时初步得到一个可运行的基座：

<p>
<img width="95%" src="https://github.com/BK201-Drama/Micro-Frontends/blob/master/pic/基座.png" />
</p>




## 基座注册

### 基座安装qiankun依赖包

```cmd
npm i -S qiankun
```



### 基座main.js进行子应用引入配置与注册配置

```js
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
    name: 'vueApp',
    entry: '//localhost:10000', // 子应用的入口，基座可以加载内部的东西，但是子应用必须支持跨域，用fetch
    // fetch
    container:'#vue',
    activeRule: '/vue'
  }, {
    name: 'reactApp',
    entry: '//localhost:3000', // 子应用的入口，基座可以加载内部的东西，但是子应用必须支持跨域，用fetch
    // fetch
    container:'#react',
    activeRule: '/react'
  }
]

// 注册运行
registerMicroApps(apps)
start()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

```



## 子应用配置

### vue子应用配置

#### main.js配置

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Vue.config.productionTip = false

let instance = null
function render () {
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
```



#### router/index.js配置

我们需要配置成Browser类型的路由

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/vue',
  routes
})

export default router

```



#### vue.config.js配置

```js
module.exports = {
  devServer: {
    port:15000,
    headers:{
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack:{
    output:{
      library:'vueApp',// 对应了基座的配置名称
      libraryTarget:'umd'// 打包成umd模块
    }
  }
}
```





### react子应用配置

#### 重新配置webpack

- 安装插件

  ```js
  yarn add react-app-rewired --save
  ```

- 更改package.json文件的script部分

  ```js
    "scripts": {
      "start": "react-app-rewired start",
      "build": "react-app-rewired build",
      "test": "react-app-rewired test",
      "eject": "react-app-rewired eject"
    }
  ```

- 添加config-overrides.js文件，重写配置文件

  ```js
  module.exports = {
    webpack:(config) => {
      config.output.library = 'reactApp';
      config.output.libraryTarget = 'umd';
      config.output.publicPath = 'http://localhost:3000/';
      return config;
    },
    devServer:(configFunction) => {
      return function (proxy, allowedHost) {
        const config = configFunction(proxy, allowedHost)
        config.port = '3000'
        config.headers = {
          'Access-Control-Allow-Origin': '*'
        }
        return config
      }
    }
  }
  ```

  

#### 重新书写index.js入口文件

与vue方法几乎一致

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

function render () {
  ReactDOM.render(<App />, document.getElementById('root'));
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap () {

}

export async function mount () {
  render()
}

export async function unmount () {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'))
}

```



# 效果展示

- 基座效果展示

<p>
<img width="95%" src="https://github.com/BK201-Drama/Micro-Frontends/blob/master/pic/基座初步配置成功界面.jpg" />
</p>


- vue微应用展示

<p>
<img width="95%" src="https://github.com/BK201-Drama/Micro-Frontends/blob/master/pic/vue微应用.png" />
</p>


- react微应用展示

<p>
<img width="95%" src="https://github.com/BK201-Drama/Micro-Frontends/blob/master/pic/react微应用.png" />
</p>




这样，我们就已经将项目分成了两个文件，就可以分别进行开发啦！

