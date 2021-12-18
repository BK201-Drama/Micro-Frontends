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



### 基座添加vue.config.js

```vue
module.exports = {
  lintOnSave:false
}
```



此时初步得到一个可运行的基座：

![基座初步配置成功界面](C:\Users\Drama\source\Micro-Frontends\pic\基座初步配置成功界面.jpg)



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





### react子应用配置
