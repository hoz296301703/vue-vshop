/**
 工具类
 */

//  判断值是否为空
let isEmpty = function (value) {
	return value == null || (value + "").trim() == "null" || (value + "").trim() == "" || (value + "").trim() == "undefined"
}

export {
	isEmpty
}

// 保留两位小数，不四舍五入
export const cutOutNum = (num, decimals) => {
	if (isNaN(num) || (!num && num !== 0)) {
		return '--'
	}
	// 默认为保留的小数点后两位
	let dec = decimals ? decimals : 2
	let tempNum = Number(num)
	let pointIndex = String(tempNum).indexOf('.') + 1 // 获取小数点的位置 + 1
	let pointCount = pointIndex ? String(tempNum).length - pointIndex : 0 // 获取小数点后的个数(需要保证有小数位)
	// 源数据为整数或者小数点后面小于decimals位的作补零处理
	if (pointIndex === 0 || pointCount <= dec) {
		let tempNumA = tempNum
		if (pointIndex === 0) {
			tempNumA = `${tempNumA}.`
			for (let index = 0; index < dec - pointCount; index++) {
				tempNumA = `${tempNumA}0`
			}
		} else {
			for (let index = 0; index < dec - pointCount; index++) {
				tempNumA = `${tempNumA}0`
			}
		}
		return tempNumA
	}
	let realVal = ''
	// 截取当前数据到小数点后decimals位
	realVal = `${String(tempNum).split('.')[0]}.${String(tempNum)
		.split('.')[1]
		.substring(0, dec)}`
	// 判断截取之后数据的数值是否为0
	if (realVal == 0) {
		realVal = 0
	}
	return realVal
}

export const shrink_img = (str) => {// 缩略图
	if (str.indexOf('goodsContent')) {// 判断str是否有‘goodsContent’字符，有就替换成‘goodsCompression’
		// str = str.replace('https://ym.191ec.com', 'http://test.191ec.com:8700');
		str = str.replace('goodsContent', 'goodsCompression');
		// var index = str.lastIndexOf("\/");// 找到最后一个下划线下标
		// var url = str.substring(0, index + 1)

		// var goodsName = str.substring(index + 1, str.length);// 截取图片名称
		// goodsName = 'c_' + goodsName;// 再名称前面拼接上c_字符串
		// str = url + goodsName
	}
	return str;
}