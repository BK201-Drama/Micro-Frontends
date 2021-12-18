module.exports = {
  devServer: {
    port:10000,
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