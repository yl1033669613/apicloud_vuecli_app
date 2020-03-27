/**
 * 作者: Zoran
 * 公共js, 封装了一些重要的api接口, 和模块
 * 以及对一些设备兼容的方法
 */

import Vue from 'vue'
import FastClick from './fastclick.min'
import { storage, superZero, dateRemoveTime } from './utils'
import { toast, showProgress, hideProgress } from './base_ui'
import Ajax from './ajax'

// doc
const winDoc = window.document

export default function () {
	// css rem
	! function (win) {
		function a() {
			win.document.documentElement.style.fontSize = win.document.documentElement.clientWidth / 7.5 + 'px'
		}
		var b = null
		win.addEventListener('resize', function () {
			clearTimeout(b), b = setTimeout(a, 10)
		}, !1), a()
	}(window)

	//时间格式化
	Date.prototype.format = function (format) {
		var o = {
			'M+': this.getMonth() + 1, //month
			'd+': this.getDate(), //day
			'h+': this.getHours(), //hour
			'm+': this.getMinutes(), //minute
			's+': this.getSeconds(), //second
			'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
			'S': this.getMilliseconds() //millisecond
		}
		if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
			(this.getFullYear() + '').substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp('(' + k + ')').test(format))
				format = format.replace(RegExp.$1,
					RegExp.$1.length == 1 ? o[k] :
						('00' + o[k]).substr(('' + o[k]).length));
		return format
	}

	const Comm = {
		baseApiUrl: Ajax.baseApiUrl,
		resourceUrl: Ajax.resourceUrl,
		// 判断是否为全路径 不是完整路径则拼前缀
		setBaseUrl(url) {
			if (url) {
				if (url.match(/^(?:http|ftp|https):\/\//) || url.indexOf('../') > -1) {
					return url
				} else {
					return this.resourceUrl + url
				}
			} else {
				return ''
			}
		},
		/**
		 * 判断权限并发起授权请求 只有同意授权才会执行回调
		 * @param {String || Array} perm 需要授权的权限名可以传字符串或数组
		 */
		testAndReqPermission(perm) {
			const totalPerms = [
				'camera',
				'contacts',
				'contacts-r',
				'contacts-w',
				'microphone',
				'photos',
				'location',
				'locationAlways',
				'notification',
				'calendar',
				'calendar-r',
				'calendar-w',
				'phone',
				'phone-call',
				'phone-r',
				'phone-r-log',
				'phone-w-log',
				'sensor',
				'sms',
				'sms-s',
				'sms-r',
				'storage',
				'storage-r',
				'storage-w'
			]
			return new Promise((resolve, reject) => {
				let perms = []
				// 首先验证授权项是否存在
				let permIsValid = true
				if (typeof perm === 'string') {
					permIsValid = totalPerms.indexOf(perm) !== -1
					perms.push(perm)
				} else if (Array.isArray(perm) && perm.length) {
					for (let i = 0; i < perm.length; i++) {
						perms.push(perm[i])
						if (totalPerms.indexOf(perm[i]) === -1) {
							permIsValid = false
						}
					}
				} else {
					return reject({ errMsg: '权限参数异常' })
				}
				if (permIsValid) {
					let rets = api.hasPermission({
						list: perms
					})
					let permsNoGranted = []
					let permsGranted = []
					rets.forEach((a) => {
						if (a.granted) {
							permsGranted.push(a)
						} else {
							permsNoGranted.push(a.name)
						}
					})
					if (permsNoGranted.length) {
						api.requestPermission({
							list: permsNoGranted,
							code: 100001
						}, (ret, err) => {
							if (ret) {
								// 只有当全部权限都授权完成时才能回调
								if (ret.list.every((a) => a.granted)) {
									resolve(ret)
								}
							} else {
								reject(err)
							}
						})
					} else {
						resolve({
							list: permsGranted
						})
					}
				} else {
					reject({ errMsg: '存在无效授权项' })
				}
			})
		},
		/**
		 * 监听屏幕可显示范围变化导致布局变化 调整framegroup 和frame 布局, 该方法通常用于解决安卓键盘弹出时布局异常
		 * @param {String} name frame frameGroup 名
		 * @param {Number} type 打开frame 的类型 0 -> group 1 -> pop 2 -> normal frame
		 */
		resizeFrame(name, type) {
			let rect = {
				x: 0,
				y: 0,
				w: api.winWidth,
				h: 0
			}
			window.addEventListener('resize', () => {
				let headerH = 0, footerH = 0
				let headerEle = winDoc.querySelector('header')
				let footerEle = winDoc.querySelector('#footer')
				if (headerEle) {
					headerH = headerEle.offsetHeight
				}
				if (footerEle) {
					footerH = footerEle.offsetHeight
				}
				switch (type) {
					case 0:
						rect.y = headerH
						rect.h = api.winHeight - headerH - footerH
						break
					case 1:
						rect.h = api.winHeight
						break
					case 2:
						rect.y = headerH
						rect.h = api.winHeight - headerH
						break
				}
				if (type == 0) {
					api.setFrameGroupAttr({
						name: name,
						rect: rect
					})
				} else {
					api.setFrameAttr({
						name: name,
						rect: rect
					})
				}
			})
		},
		/**
		 * 打开新窗口
		 * @param {Object} pageOpt 打开窗口的一些参数
		 * @param {String} pageOpt.name 打开窗口主frame html文件名 实际窗口名
		 * @param {String} pageOpt.headerName 打开窗口头部所在页面的文件名 默认为 header 可以不传
		 * @param {Object} pageOpt.pageParam 传递的额外参数
		 * @param {Object} option 打开页面的参数
		 */
		openWin(pageOpt, option) {
			let opt = option || {}
			let param = pageOpt.pageParam || { pageName: pageOpt.name }
			let headerName = pageOpt.headerName ? pageOpt.headerName : 'page_header'
			param.pageName = pageOpt.name
			let wins = api.windows()
			if (wins.some((a) => a.name === pageOpt.name)) {
				// 如果页面已打开则先关闭页面再打开
				api.closeWin({
					name: pageOpt.name
				})
			}
			api.openTabLayout({
				name: pageOpt.name, //窗口页面
				url: `widget://${headerName}.html`,
				reload: true,
				slidBackEnabled: opt.slidBackEnabled || false,
				slidBackType: opt.slidBackType || 'edge',
				vScrollBarEnabled: opt.vScrollBarEnabled || false,
				hScrollBarEnabled: opt.hScrollBarEnabled || false,
				pageParam: param,
				bounces: opt.bounces || false, //页面是否弹动。注意如果页面使用了上拉、下拉刷新等功能，该属性可能会被刷新组件重新设置
				singleInstance: opt.singleInstance || false, //设置该window是否为单例对象。若设置为单例对象，当调用closeWin方法关闭时，window将只是从屏幕移除而不会被销毁，下次再打开时将直接使用已存在的window，而不会再重新创建
				bgColor: opt.bgColor || '',
				delay: opt.delay || 0,
				animation: opt.animation || {
					type: 'movein', //动画类型（详见动画类型常量）
					subType: 'from_right', //动画子类型（详见动画子类型常量）
					duration: 400 //动画过渡时间，默认300毫秒
				},
				scrollEnabled: opt.scrollEnabled || false  // 打开的window通常禁止滚动， 确保在弹窗键盘时ios等设备不必要的滚动
			})
		},
		/**
		 * 打开新 frame
		 * @param {String} name 打开打开新frame名及对应url，url与文件名对应
		 * @param {Object} pageParam openFrame窗口参数
		 * @param {Object} opt 是否回弹
		 */
		openFrame(name, pageParam, opt) {
			let option = opt || {}
			let y = 0
			let header = winDoc.querySelector('header')
			if (header) { // 判断所在window是否存在头部导航 如果存在则设置frame的坐标y的位置
				y = header.offsetHeight
			}
			api.openFrame({
				name: `${name}_frame`,
				url: `widget://${name}.html`,
				pageParam: pageParam,
				rect: option.rect || {
					x: 0,
					y: y,
					w: api.winWidth,
					h: 'auto'
				},
				bgColor: option.bgColor || '#ffffff',
				animation: option.animation || {
					type: 'none'
				},
				bounces: option.bounces || false,
				vScrollBarEnabled: option.vScrollBarEnabled || false,
				hScrollBarEnabled: option.hScrollBarEnabled || false,
				allowEdit: option.allowEdit || false,
				reload: option.reload || true,
				overScrollMode: option.overScrollMode || 'scrolls'
			})
		},
		/**
		 * 打开新的 Frame 弹窗
		 * @param {String} name 打开打开新frame名及对应url，url与文件名对应
		 * @param {Object} pageParam openFrame窗口参数
		 */
		openPopFrame(name, pageParam) {
			const rect = {
				x: 0,
				y: 0,
				w: api.winWidth,
				h: api.winHeight
			}
			api.openFrame({
				name: `${name}_POPWIN`,
				url: `widget://${name}.html`,
				pageParam: pageParam,
				rect: rect,
				animation: {
					type: 'fade', //动画类型（详见动画类型常量）
					duration: 300
				},
				reload: true
			})
			this.resizeFrame(name, 1)
		},
		/**
		 * 操作系统返回时（需在window页面监听keyback事件），先检查是否有frame弹窗并关闭之后再关闭页面 请参考page_header.html
		 */
		keyBackToClosePop() {
			const frames = api.frames()
			let popFrames = frames.filter(a => /_POPWIN/.test(a.name))
			if (popFrames.length) {
				let revArr = popFrames.reverse()
				api.closeFrame({ name: revArr[0].name })
				return false
			} else {
				return true
			}
		},
		/**
		 * 批量缓存图片
		 * @param {Array} opt.datas 图片数组 支持传对象数组
		 * @param {String} opt.imgKey 该字段为对象数组时指定图片对应的key
		 * @param {String} opt.timeout 缓存图片超时时间
		 */
		fnImageCache(opt) {
			const self = this
			return new Promise((resolve, reject) => {
				let currArr = opt.datas
				let key = opt.imgKey
				let count = 0
				let timeout = opt.timeout || 30000
				let loadDone = () => { // 缓存完成执行
					if (count === currArr.length) {
						resolve(currArr)
					}
				}
				if (currArr && currArr.length) {
					currArr.forEach((a, i) => {
						let currUrl = ''
						let itemType = typeof a
						if (itemType === 'string') {
							currUrl = self.setBaseUrl(a)
						} else {
							if (key) currUrl = self.setBaseUrl(a[key])
						}
						if (currUrl) {
							// 缓存超时的情况 缓存超时为30000ms
							let timer = setTimeout(() => {
								clearTimeout(timer)
								timer = null
								count++
								loadDone()
							}, timeout)
							api.imageCache({
								url: currUrl,
								thumbnail: false
							}, (ret, err) => {
								// 如果缓存超时则不执行缓存超时之后的回调
								if (timer) {
									clearTimeout(timer)
									timer = null
									if (ret.url) {
										if (itemType === 'string') {
											currArr[i] = ret.url
										} else {
											a[key] = ret.url
										}
									}
									count++
									loadDone()
								}
							})
						} else {
							count++
							loadDone()
						}
					})
				} else {
					reject({ errMsg: '缓存图片为空', opt: opt })
				}
			})
		},
		// 上拉加载
		pullUp(callBack) {
			api.addEventListener({
				name: 'scrolltobottom'
			}, (ret, err) => {
				callBack()
			})
		},
		//下拉刷新 使用模块：UIPullRefreshFlash
		pullDown(callBack, bgColor) {
			api.setCustomRefreshHeaderInfo({
				bgColor: bgColor || '#2b2c30',
				loadAnimInterval: 45,
				image: {
					pull: [
						'widget://res/refresh/1.png'
					],
					load: ['widget://res/refresh/1.png', 'widget://res/refresh/2.png', 'widget://res/refresh/3.png', 'widget://res/refresh/4.png', 'widget://res/refresh/5.png', 'widget://res/refresh/6.png', 'widget://res/refresh/7.png', 'widget://res/refresh/8.png', 'widget://res/refresh/9.png', 'widget://res/refresh/10.png', 'widget://res/refresh/11.png', 'widget://res/refresh/12.png', 'widget://res/refresh/13.png', 'widget://res/refresh/14.png', 'widget://res/refresh/15.png', 'widget://res/refresh/16.png', 'widget://res/refresh/17.png', 'widget://res/refresh/18.png', 'widget://res/refresh/19.png', 'widget://res/refresh/20.png', 'widget://res/refresh/21.png', 'widget://res/refresh/22.png', 'widget://res/refresh/23.png', 'widget://res/refresh/24.png', 'widget://res/refresh/25.png', 'widget://res/refresh/26.png', 'widget://res/refresh/27.png', 'widget://res/refresh/28.png', 'widget://res/refresh/29.png', 'widget://res/refresh/30.png', 'widget://res/refresh/31.png', 'widget://res/refresh/32.png', 'widget://res/refresh/33.png', 'widget://res/refresh/34.png', 'widget://res/refresh/35.png', 'widget://res/refresh/36.png', 'widget://res/refresh/37.png', 'widget://res/refresh/38.png', 'widget://res/refresh/39.png', 'widget://res/refresh/40.png', 'widget://res/refresh/41.png', 'widget://res/refresh/42.png', 'widget://res/refresh/43.png', 'widget://res/refresh/44.png']
				},
				isScale: false
			}, () => {
				callBack()
			})
		},
		// 打开一个action select 模块为UIActionSelector
		openActionSelect(opt, cb) {
			const UIActionSelector = api.require('UIActionSelector')
			UIActionSelector.open({
				datas: opt.datas,
				actives: opt.actives,
				layout: {
					row: opt.row || 5,
					col: opt.col || 3,
					height: 50,
					size: 14,
					sizeActive: 18,
					rowSpacing: 0,
					colSpacing: 0,
					maskBg: 'rgba(0,0,0,0.65)',
					bg: '#f5f5f5',
					color: '#333',
					colorActive: '#97a38d',
					colorSelected: '#97a38d',
					leftMargin: 20,
					rightMargin: 20
				},
				animation: true,
				cancel: {
					text: '取消',
					size: 15,
					w: 80,
					h: 36,
					bg: '#e5e4e6',
					bgActive: '#e5e4e6',
					color: '#aaa6a7',
					colorActive: '#aaa6a7'
				},
				ok: {
					text: '确定',
					size: 15,
					w: 80,
					h: 36,
					bg: '#97a38d',
					bgActive: '#7c8870',
					color: '#fff',
					colorActive: '#fff'
				},
				title: {
					text: '',
					size: 12,
					h: 50,
					bg: '#eee',
					color: '#222'
				},
				lineColor: '#ccc'
			}, (ret, err) => {
				if (ret) {
					cb && cb(ret, UIActionSelector)
				}
			})
			return UIActionSelector
		},
		// 打开一个图片查看器
		openPhotoBrowser(opt, cb) {
			const photoBrowser = api.require('photoBrowser')
			photoBrowser.open({
				images: opt.images || [],
				placeholderImg: 'widget://res/placeH_pic.png',
				bgColor: opt.bgColor || '#000',
				activeIndex: opt.activeIndex || 0,
				atime: 0.3
			}, (ret, err) => {
				cb && cb(ret, photoBrowser)
			})
			return photoBrowser
		},
		/**
		 * 简单的表单验证
		 * @param {Object} formObj 表单对象
		 * @param {Object} formRule 表单验证规则 {required : Boolean, validFunc : function(formObjItem, callFunc), message : String}
		 */
		validForm(formObj, formRule) {
			if (formObj && formRule) {
				for (var key in formRule) {
					if (formRule[key].required && !formObj[key]) {
						toast(formRule[key].message)
						return false
					}
					if (formRule[key].validFunc) {
						var validFuncRet = formRule[key].validFunc(formObj[key], function (msg) {
							toast(msg)
						})
						if (!validFuncRet) return false
					}
				}
				return true
			} else {
				return false
			}
		}
	}

	// 初始化fastClick
	function _initFastClick() {
		// 仅为ios时有效
		if (api.systemType === 'ios' && typeof (FastClick) !== 'undefined') {
			FastClick.attach(winDoc.body)
		}
	}

	// 沉浸式状态栏配置
	function _immersiveStatusBar() {
		api.parseTapmode()
		let eleHeader = winDoc.querySelector('header')
		if (eleHeader) {
			eleHeader.style.paddingTop = api.safeArea.top + 'px'
		}
	}

	// app 环境时调用页面 ready
	Vue.prototype.$appPageReady = (callback) => {
		if (api) {
			// 沉浸式状态栏
			_immersiveStatusBar()
			// fastClick
			// _initFastClick() // 2020-03 启用WKWebView, 可以不使用fastClick
			callback && callback()
		}
	}

	// 将comm 对象挂载在vue.js 上
	Vue.prototype.$comm = Comm

	// 状态 UI 直接挂在vue上
	Vue.prototype.toast = toast
	Vue.prototype.showProgress = showProgress
	Vue.prototype.hideProgress = hideProgress

	// storage
	Vue.prototype.setStorage = storage.set
	Vue.prototype.getStorage = storage.get
	Vue.prototype.rmStorage = storage.del

	// ajax 
	Vue.prototype.ajax = Ajax.ajax

	// 工具函数
	Vue.prototype.superZero = superZero
	Vue.prototype.dateRemoveTime = dateRemoveTime

	// vue 过滤器
	Vue.filter('setBaseUrl', Comm.setBaseUrl.bind(Comm))
	Vue.filter('superZero', superZero)
	Vue.filter('dateRemoveTime', dateRemoveTime)
}
