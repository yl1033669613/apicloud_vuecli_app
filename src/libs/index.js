import Vue from 'vue'
import FastClick from './fastclick.min'
import { storage } from './utils'

const BASE_API_URL = 'http://localhost:8080' //接口 base url
const RESOURCE_URL = 'http://localhost:8080/resource' //资源 base url

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
		baseApiUrl: BASE_API_URL,
		resourceUrl: RESOURCE_URL,
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
				switch (type) {
					case 0:
						rect.y = winDoc.querySelector('header').offsetHeight
						rect.h = api.winHeight - winDoc.querySelector('header').offsetHeight - (winDoc.querySelector('#footer') ? winDoc.querySelector('#footer').offsetHeight : 0)
						break
					case 1:
						rect.h = api.winHeight
						break
					case 2:
						rect.y = winDoc.querySelector('header').offsetHeight
						rect.h = api.winHeight - winDoc.querySelector('header').offsetHeight
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
		 * 如果为ios系统在键盘弹出时，将绝对定位底部元素变为无定位元素， 对于ios的妥协办法，防止绝对定位元素在ios上的异常表现 可在$apiReady内统一调用  也可以分开调用
		 * @param {String} eleSelector 元素选择器
		 * @param {String} height 固定在底部的元素高度 css高度 需要带单位 例如'10px','-1.1rem'等 取负值
		 */
		fixIosBottomViewWhenKeyBoardShow(eleSelector, height) {
			let currEle = winDoc.querySelector(eleSelector)
			if (api.systemType === 'ios' && currEle) {
				api.addEventListener({
					name: 'keyboardshow'
				}, (ret, err) => {
					// 判断内容高度大于frame窗口高度
					if (winDoc.querySelector('body').offsetHeight > api.frameHeight) {
						currEle.style.position = 'static'
						// 需要统一的底部绝对定位元素高度
						currEle.style.marginTop = height
					}
				})
				api.addEventListener({
					name: 'keyboardhide'
				}, (ret, err) => {
					currEle.style.position = 'fixed'
					currEle.style.marginTop = '0'
				})
			}
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
			api.openWin({
				name: pageOpt.name, //窗口页面
				url: `widget://${headerName}.html`,
				reload: true,
				slidBackEnabled: opt.slidBackEnabled || true,
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
		 * 操作系统返回时，先检查是否有frame弹窗并关闭之后再关闭页面 请参考page_header.html
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
		 * 封装api.ajax
		 * @param {Object} options ajax参数
		 */
		ajax(options) {
			const self = this
			let _default = {
				url: '',
				method: 'post',
				dataType: '',
				timeout: 30,
				headers: {
					'Accept': 'application/json'
				}
			}
			let _options = {}
			_options = Object.assign(_options, _default, options)
			if (!_options.url) {
				api.alert({
					msg: '数据地址不正确'
				})
				return false
			}
			if (_options.url.lastIndexOf('.json') > -1) {
				_options.type = 'get'
			}
			if (!_options.url.match(/^(?:http|ftp|https):\/\//)) {
				_options.url = self.baseApiUrl + _options.url
			}
			if (!_options.data) {
				_options.data = {}
			}
			if (!_options.data.files && !_options.data.body) {
				_options.headers = Object.assign(_options.headers, {
					'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
				})
			}
			let token = storage.get('token')
			if (token && !_options.disableToken) {
				_options.headers = Object.assign(_options.headers, {
					'token': token
				})
			}
			return new Promise((resolve, reject) => {
				api.ajax({
					url: _options.url,
					data: _options.data,
					method: _options.method,
					dataType: _options.dataType,
					headers: _options.headers,
					timeout: _options.timeout
				}, (ret, err) => {
					if (ret) {
						if (ret.code == 200) { //接口返回判断 成功 具体判断请依据具体接口返回处理
							resolve(ret)
						} else {
							_hideProgress()
							api.refreshHeaderLoadDone()
							if (ret.code == 401) { //接口 授权判断  具体判断请依据具体接口返回处理
								_toast('登录已过期，请重新登录')
								//未授权则跳回首页并打开登录页
								setTimeout(() => {
									api.closeToWin({
										name: 'root',
										animation: {
											type: 'none',
											duration: 0
										}
									})
									api.execScript({
										name: 'root',
										script: '$vm.openLoginWhenTokenInvalid()'
									})
								}, 700)
								return reject({ errMsg: '登录已过期，请重新登录' })
							}
							reject(ret)
						}
					} else {
						_hideProgress()
						api.refreshHeaderLoadDone()
						_toast('请求失败')
						reject(err)
					}
				})
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
		// 个位数补零
		superZero(num) {
			return num < 10 ? ('0' + num) : num
		},
		// 日期去除时分秒
		dateRemoveTime(date) {
			if (date && date.length > 10) {
				return date.substring(0, 10)
			} else {
				return date
			}
		},
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
		 * 价格格式化 10000 => 10,000
		 * @param {String} price 数字
		 * @param {Boolean} hasW 是否需要 *10000
		 */
		priceFormate(price, hasW) {
			let l
			let t = ""
			let d = ""
			if (price === 0) {
				return 0
			}
			if (!price) {
				return ""
			}
			if (price < 1) {
				return price
			}
			if (hasW) {
				l = (parseInt(this.accMul(price, 10000)) + "").split("").reverse()
			} else {
				let strArr = (parseFloat(price) + "").split(".")
				l = strArr[0].split("").reverse()
				d = strArr[1] || ''
			}
			for (let i = 0; i < l.length; i++) {
				t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "")
			}
			return t.split("").reverse().join("") + (d ? ("." + d) : "")
		},
		/**
		 ** 加法函数，用来得到精确的加法结果
		 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
		 ** 调用：accAdd(arg1,arg2)
		 ** 返回值：arg1加上arg2的精确结果
		 **/
		accAdd(arg1, arg2) {
			let r1, r2, m, c
			try {
				r1 = arg1.toString().split(".")[1].length
			} catch (e) {
				r1 = 0
			}
			try {
				r2 = arg2.toString().split(".")[1].length
			} catch (e) {
				r2 = 0
			}
			c = Math.abs(r1 - r2)
			m = Math.pow(10, Math.max(r1, r2))
			if (c > 0) {
				let cm = Math.pow(10, c)
				if (r1 > r2) {
					arg1 = Number(arg1.toString().replace(".", ""))
					arg2 = Number(arg2.toString().replace(".", "")) * cm
				} else {
					arg1 = Number(arg1.toString().replace(".", "")) * cm
					arg2 = Number(arg2.toString().replace(".", ""))
				}
			} else {
				arg1 = Number(arg1.toString().replace(".", ""))
				arg2 = Number(arg2.toString().replace(".", ""))
			}
			return (arg1 + arg2) / m
		},
		/**
		 ** 减法函数，用来得到精确的减法结果
		 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
		 ** 调用：accSub(arg1,arg2)
		 ** 返回值：arg1加上arg2的精确结果
		 **/
		accSub(arg1, arg2) {
			let r1, r2, m, n
			try {
				r1 = arg1.toString().split(".")[1].length
			} catch (e) {
				r1 = 0
			}
			try {
				r2 = arg2.toString().split(".")[1].length
			} catch (e) {
				r2 = 0
			}
			m = Math.pow(10, Math.max(r1, r2)) //last modify by deeka //动态控制精度长度
			n = (r1 >= r2) ? r1 : r2
			return ((arg1 * m - arg2 * m) / m).toFixed(n)
		},
		/**
		 ** 乘法函数，用来得到精确的乘法结果
		 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
		 ** 调用：accMul(arg1,arg2)
		 ** 返回值：arg1乘以 arg2的精确结果
		 **/
		accMul(arg1, arg2) {
			let m = 0
			let s1 = arg1.toString()
			let s2 = arg2.toString()
			try {
				m += s1.split(".")[1].length
			} catch (e) { }
			try {
				m += s2.split(".")[1].length
			} catch (e) { }
			return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
		},
		/**
		 ** 除法函数，用来得到精确的除法结果
		 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
		 ** 调用：accDiv(arg1,arg2)
		 ** 返回值：arg1除以arg2的精确结果
		 **/
		accDiv(arg1, arg2) {
			let t1 = 0
			let t2 = 0
			let r1, r2
			try {
				t1 = arg1.toString().split(".")[1].length
			} catch (e) { }
			try {
				t2 = arg2.toString().split(".")[1].length
			} catch (e) { }
			r1 = Number(arg1.toString().replace(".", ""))
			r2 = Number(arg2.toString().replace(".", ""))
			return (r1 / r2) * Math.pow(10, t2 - t1)
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
						_toast(formRule[key].message)
						return false
					}
					if (formRule[key].validFunc) {
						var validFuncRet = formRule[key].validFunc(formObj[key], function (msg) {
							_toast(msg)
						})
						if (!validFuncRet) return false
					}
				}
				return true
			} else {
				return false
			}
		},
		// 验证手机
		validPhone(val) {
			const expPhone = /^1[3456789]\d{9}$/
			if (!expPhone.test(val)) {
				return false
			} else {
				return true
			}
		},
		// 固定电话验证
		validTele(val) {
			const expTele = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
			if (!expTele.test(val)) {
				return false
			} else {
				return true
			}
		},
		// 验证邮箱
		validEmail(val) {
			const expEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
			if (!expEmail.test(val)) {
				return false
			} else {
				return true
			}
		},
		//验证只包含数字
		validNumber(val) {
			const expNum = /^\d+$/
			if (!expNum.test(val)) {
				return false
			} else {
				return true
			}
		},
		// 验证可能包含浮点的数字
		isNumber(val) {
			const regPos = /^\d+(\.\d+)?$/ //非负浮点数
			const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ //负浮点数
			if (regPos.test(val) || regNeg.test(val)) {
				return true;
			} else {
				return false;
			}
		},
		// 验证身份证号 年限制在 1800 - 2199
		isIdNum: function (val) {
			var regID = /^[1-9]\d{5}(18|19|20|21)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
			if (!regID.test(val)) {
				return false
			} else {
				return true
			}
		},
		// 验证只包含数字或字母
		onlyNumOrLetters(val) {
			const reg = /^[0-9a-zA-Z]+$/
			if (!reg.test(val)) {
				return false
			} else {
				return true
			}
		}
	}

	/**
	 * toast
	 * @param {String} msg
	 * @param {Object} msg
	 */
	function _toast(msg) {
		if (typeof msg === 'string') {
			api.toast({
				msg: msg,
				duration: 3000,
				location: 'bottom'
			})
		} else if (typeof msg === 'object') {
			api.toast({
				msg: msg.msg || '',
				duration: msg.duration || 3000,
				location: msg.location || 'bottom'
			})
		}
	}

	//显示等待模态框
	function _showProgress(title, text, modal) {
		api.showProgress({
			title: title,
			text: text || '',
			modal: !!modal
		})
	}

	//关闭模态框
	function _hideProgress() {
		api.hideProgress()
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
			_initFastClick()
			callback && callback()
		}
	}

	// 状态 UI 直接挂在vue上
	Vue.prototype.toast = _toast
	Vue.prototype.showProgress = _showProgress
	Vue.prototype.hideProgress = _hideProgress

	// 将comm 对象挂载在vue.js 上
	Vue.prototype.$comm = Comm

	// storage
	Vue.prototype.setStorage = storage.set
	Vue.prototype.getStorage = storage.get
	Vue.prototype.rmStorage = storage.del

	// vue 过滤器
	Vue.filter('setBaseUrl', Comm.setBaseUrl.bind(Comm))
	Vue.filter('superZero', Comm.superZero)
	Vue.filter('dateRemoveTime', Comm.dateRemoveTime)
	Vue.filter('priceFormate', Comm.priceFormate.bind(Comm))
}
