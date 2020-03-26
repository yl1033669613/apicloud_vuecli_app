/**
 * 作者: Zoran
 * app storage 使用 api.setPrefs()
 * 和可能用到的工具函数
 */

const storage = {
	set(key, value) {
		api.setPrefs({ key, value })
	},

	get(key) {
		return api.getPrefs({ sync: true, key })
	},

	del(key) {
		api.removePrefs({ key })
	}
}

/**
** 加法函数，用来得到精确的加法结果
** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
** 调用：accAdd(arg1,arg2)
** 返回值：arg1加上arg2的精确结果
**/
function accAdd(arg1, arg2) {
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
}
/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub(arg1, arg2) {
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
}
/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
function accMul(arg1, arg2) {
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
}
/**
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
function accDiv(arg1, arg2) {
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
}

/**
 * 价格格式化 10000 => 10,000
 * @param {String} price 数字
 * @param {Boolean} hasW 是否需要 *10000
 */
function priceFormate(price, hasW) {
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
		l = (parseInt(price, 10000) + "").split("").reverse()
	} else {
		let strArr = (parseFloat(price) + "").split(".")
		l = strArr[0].split("").reverse()
		d = strArr[1] || ''
	}
	for (let i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "")
	}
	return t.split("").reverse().join("") + (d ? ("." + d) : "")
}

// 日期去除时分秒
function dateRemoveTime(date) {
	if (date && date.length > 10) {
		return date.substring(0, 10)
	} else {
		return date
	}
}

// 个位数补零
function superZero(num) {
	return num < 10 ? ('0' + num) : num
}

// 验证手机
function validPhone(val) {
	const expPhone = /^1[3456789]\d{9}$/
	if (!expPhone.test(val)) {
		return false
	} else {
		return true
	}
}

// 固定电话验证
function validTele(val) {
	const expTele = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
	if (!expTele.test(val)) {
		return false
	} else {
		return true
	}
}

// 验证邮箱
function validEmail(val) {
	const expEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
	if (!expEmail.test(val)) {
		return false
	} else {
		return true
	}
}

//验证只包含数字
function validNumber(val) {
	const expNum = /^\d+$/
	if (!expNum.test(val)) {
		return false
	} else {
		return true
	}
}

// 验证可能包含浮点的数字
function isNumber(val) {
	const regPos = /^\d+(\.\d+)?$/ //非负浮点数
	const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ //负浮点数
	if (regPos.test(val) || regNeg.test(val)) {
		return true;
	} else {
		return false;
	}
}

// 验证身份证号 年限制在 1800 - 2199
function isIdNum(val) {
	var regID = /^[1-9]\d{5}(18|19|20|21)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	if (!regID.test(val)) {
		return false
	} else {
		return true
	}
}

// 验证只包含数字或字母
function onlyNumOrLetters(val) {
	const reg = /^[0-9a-zA-Z]+$/
	if (!reg.test(val)) {
		return false
	} else {
		return true
	}
}

export {
	storage, 
	accAdd, 
	accSub, 
	accMul, 
	accDiv, 
	priceFormate, 
	dateRemoveTime, 
	superZero, 
	validPhone,
	validTele,
	validEmail,
	validNumber,
	isNumber,
	isIdNum,
	onlyNumOrLetters
}