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
		l = (parseInt(accMul(price, 10000)) + "").split("").reverse()
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

export { storage, accAdd, accSub, accMul, accDiv, priceFormate }