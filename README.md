# APICloud + VueCLI3 = APP


## 简介

APICloud+VueCLI 结合的模块化开发框架，快速构建apicloud APP

使用rem适配移动端各种设备

window和frame以多页面的形式编译最后生成`.html`文件

更多页面调试方式，助力快速开发APICloud 应用

common.js 封装了一些针对apicloud app的方法、图片缓存、窗口打开关闭、模块使用等(具体请参考example)

项目初始包含登录逻辑，以及初始页面构成（普通页面， 特殊页面）

## 目录

```
├─dist
├─node_modules
├─public
│  ├─image
│  │  └─tabbar // 底部tabbar 图标
│  └─res
│      └─refresh // 下拉刷新贞动画图片
└─src
    ├─assets
    ├─components // vue组件
    ├─libs // 存放一些不能通过npm依赖的js文件
    ├─pages // 页面都放在这里（window或者frame）
    │  ├─home // 每个页面都包含一个页面入口文件`index.js`和一个`index.vue`
    │  ├─index // `root`页
    │  ├─login // 登录页
    │  ├─normal_header_win
    │  ├─page_header // 公共页面头部
    │  ├─profile
    │  ├─special_header // 特殊页面头部
    │  ├─special_header_win
    │  └─tmp_pop // 一个frame弹窗
    └─scss // 样式
```

## 技术栈

apicloud、apicloud模块、vuejs 2.x、VueCLI、webPark 4、Babel、scss(css预编译)、nodejs、npm

## 如何使用

1. 创建APICloud项目（获取appId）

2. 从 `https://github.com/yl1033669613/apicloud_vuecli_app` 克隆或下载项目到本地

3. 请将项目中`publish`文件夹下`config.xml`文件里的appId改为您项目的appId(重要)

4. `npm install` （安装依赖）

5. `npm run serve` （运行项目前请确保全局安装了`@vue/cli`。如果没有请先 `npm install -g @vue/cli`）

    可以在浏览器中调试（模块，api接口除外）

    Local: `http://localhost:8080/your_pages.html`

    Network: `http://your_IP:8080/your_pages.html`

6. 同步手机

    首先 `npm run wifi-start` 初始wifi连接，初始成功后可以在自定义loader的wifi同步配置里输入`ip`和`端口号（默认10915）`进行连接

    `npm run wifi-sync` 命令操作 wifi同步手机

    `npm run wifi-log` 打开log输出，可以方便查看app运行时的报错和log

    开发模式下仍然编译代码到dist，所以也可以用 `APICloud Studio` 连接手机同步代码

7. `npm run build` 输出编译代码到dist将编译代码上传APICloud，即可打包编译APICloud APP

8. 请为您的项目添加以下模块 UIPullRefreshFlash(必须)、UIActionSelector(非必须)、photoBrowser(非必须)

9. app 必须包含根页面（`root`）作为初始页，默认`root`页为`index`，请在编程时确保`index`页存在，页面名字不可修改

## WKWebView

2020年4月后发布在ios平台上的应用必须使用WKWebView。因此模板默认全局启用WKWebView

WKWebView使用介绍[https://community.apicloud.com/bbs/thread-151904-1-1.html](https://community.apicloud.com/bbs/thread-151904-1-1.html)

## css 预编译

本项目推荐使用sass/scss

## 资源引用

开发环境下资源引用方式

当你在 `JavaScript`、`CSS` 或 `*.vue` 文件中使用相对路径 (必须以 . 开头) 引用一个静态资源时，该资源将会被包含进入 webpack 的依赖图中。在其编译过程中，所有诸如 &lt;img src="...">、css内的background: url(...) 和 CSS @import 的资源 URL 都会被解析为一个模块依赖。

因此此类资源请放在`assets`文件夹内，在`publish`下的文件只是简单的复制，请使用编译后的文件关系引用(即实际app内文件引用方式)

## 移动端框架

未使用移动端框架，如有需求可自行npm安装使用

## ESlint

本项目未安装ESlint如有需求请参考[VueCLI插件](https://cli.vuejs.org/zh/guide/plugins-and-presets.html#%E6%8F%92%E4%BB%B6)

## 框架编程需求

需要开发者有一定apicloud、vue开发经验。

## 最佳实践

示例[https://github.com/yl1033669613/apicloud_vuecli_example/tree/master/example](https://github.com/yl1033669613/apicloud_vuecli_example/tree/master/example)

## 错误&建议

欢迎指出错误，提出建议

## 相关链接

[APICloud](https://www.apicloud.com/)
[vueJS](https://cn.vuejs.org/)

## demo截图

![图片1](https://github.com/yl1033669613/apicloud_vuecli_example/blob/master/example/example_pic/1.jpg)
![图片2](https://github.com/yl1033669613/apicloud_vuecli_example/blob/master/example/example_pic/2.jpg)
![图片3](https://github.com/yl1033669613/apicloud_vuecli_example/blob/master/example/example_pic/3.jpg)
![图片4](https://github.com/yl1033669613/apicloud_vuecli_example/blob/master/example/example_pic/4.jpg)
![图片5](https://github.com/yl1033669613/apicloud_vuecli_example/blob/master/example/example_pic/5.jpg)
![图片6](https://github.com/yl1033669613/apicloud_vuecli_example/blob/master/example/example_pic/6.jpg)
![图片7](https://github.com/yl1033669613/apicloud_vuecli_example/blob/master/example/example_pic/7.jpg)
![图片8](https://github.com/yl1033669613/apicloud_vuecli_example/blob/master/example/example_pic/8.jpg)
![图片9](https://github.com/yl1033669613/apicloud_vuecli_example/blob/master/example/example_pic/9.jpg)

## LICENSE

[MIT](https://github.com/yl1033669613/apicloud_vuecli_app/blob/master/LICENSE)