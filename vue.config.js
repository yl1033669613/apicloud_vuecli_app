const glob = require('glob')
const path = require('path')
const WebpackOnBuildPlugin = require('on-build-webpack')
const fs = require("fs")

const buildDir = './dist/'
let isFirst = true

// 开发模式首次编译时 删除dist文件夹下多余的文件
function deleteDistHotUpdateFiles (stats) {
  if (isFirst) {
    isFirst = false
    const newlyCreatedAssets = stats.compilation.assets
    fs.readdir(path.resolve(buildDir), (err, files) => {
      files.forEach(file => {
        let st = fs.statSync(path.resolve(buildDir + file))
        if (!newlyCreatedAssets[file] && !st.isDirectory()) {
          fs.unlink(path.resolve(buildDir + file), (err) => {
            if (err) throw err
          })
        }
      })
    })
  }
}

function getEntry(url) {
  let entrys = {}
  glob.sync(url).forEach(item => {
    let urlArr = item.split('/').splice(-3)
    entrys[urlArr[1]] = {
      entry: 'src/pages/' + urlArr[1] + '/' + 'index.js',
      template: './public/index.html',
      filename: urlArr[1] + '.html',
      title: 'pages-' + urlArr[1],
      name: urlArr[1]
    }
  })
  return entrys
}

// 获取多页应用页面入口
let pages = getEntry('./src/pages/**?/*.js')

module.exports = {
  pages,
  publicPath: '',
  filenameHashing: true,
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    writeToDisk: true // 开发环境下文件写入 dist 用于真机调试
  },
  configureWebpack: config => {
    // 运行开发环境时清理一次dist
    if (process.env.NODE_ENV !== 'production') {
      config.plugins.push(new WebpackOnBuildPlugin(deleteDistHotUpdateFiles))
    }
  },
  // 添加全局css
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, './src/scss/common.scss')]
    }
  }
}
