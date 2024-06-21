//build: 20240525
//依赖组件:dxDriver，dxStd，dxLogger，dxMap，dxEventCenter,dxCommon
import { faceClass } from './libvbar-b-dxface.so'
import dxCommon from './dxCommon.js'
import center from './dxEventCenter.js'
import dxMap from './dxMap.js'
import std from './dxStd.js'
import * as os from "os"
const faceObj = new faceClass();
const map = dxMap.get('default')
const face = {}

/**
 * 人脸处理初始化
 * @param {object} options 配置参数，大部分可以用默认值
 * @param {string} options.rgbPath 必填，rgb图像采集设备路径，每种设备有差异，比如DW200对应的值是'/dev/video11', M500对应的'/dev/video0'
 * @param {string} options.nirPath 必填，红外图像采集设备路径，每种设备有差异
 * @param {string} capturerRgbId 必填，rgb取图句柄id
 * @param {string} capturerNirId 必填，nir取图句柄id
 * @param {string} dbPath 数据库路径，必填
 * @param {number} score 特征值对比成功所需最低对比得分 ，非必填（缺省0.6）
 * @param {number} fflitMax 内存中加载的最大特征列表数量，非必填（缺省5000）
 * @param {string} mapPath 标定结果文件路径，非必填
 * @param {string} saveFacePath 保存完整人脸照片路径，非必填
 * @param {string} saveFaceThumbnailPath 保存人脸缩略图照片路径，非必填
 * @returns true/false
 */
face.init = function (options, capturerRgbId, capturerNirId, dbPath, score = 0.6, fflitMax = 5000, mapPath = "/app/path.txt", saveFacePath, saveFaceThumbnailPath) {
	if (options.rgbPath === undefined || options.rgbPath === null || options.rgbPath.length < 1) {
		throw new Error("dxFace.init: 'rgbPath' parameter should not be null or empty")
	}
	if (options.nirPath === undefined || options.nirPath === null || options.nirPath.length < 1) {
		throw new Error("dxFace.init: 'nirPath' parameter should not be null or empty")
	}
	if (capturerRgbId === undefined || capturerRgbId === null || capturerRgbId.length < 1) {
		throw new Error("dxFace.init: 'capturerRgbId' parameter should not be null or empty")
	}
	if (capturerNirId === undefined || capturerNirId === null || capturerNirId.length < 1) {
		throw new Error("dxFace.init: 'capturerNirId' parameter should not be null or empty")
	}
	if (dbPath === undefined || dbPath === null || dbPath.length < 1) {
		throw new Error("dxFace.init: 'dbPath' parameter should not be null or empty")
	}
	capturerRgbId = dxCommon.handleId("capturer", capturerRgbId)
	capturerNirId = dxCommon.handleId("capturer", capturerNirId)
	
	return faceObj.init(options, capturerRgbId, capturerNirId, dbPath, score, fflitMax, mapPath, saveFacePath, saveFaceThumbnailPath);
}
/**
 * 人脸处理去初始化
 * @returns true/false
 */
face.deinit = function () {
	return faceObj.deinit();
}
/**
 * 人脸工作模式
 * @param {number} mode 工作模式，必填（ 0 人脸识别模式；1 人脸注册模式）
 * @returns true/false
 */
face.setRecgMode = function (mode) {
	if (mode === undefined || mode === null) {
		throw new Error("dxFace.setRecgMode: 'mode' parameter should not be null or empty")
	}
	return faceObj.setRecgMode(mode)
}
/**
 * 人脸注册
 * @param {string} userId 	人员ID，必填
 * @param {object} options 注册参数，由注册回调获取
 * @param {string} options.feature 	特征值 base64字符串，必填
 * @param {number} options.is_wear_mask 是否支持带口罩 0 1，必填
 * @param {number} options.is_living 是否开启活检，必填
 * @param {number} options.rect_smooth0 平面坐标，必填
 * @param {number} options.rect_smooth1 平面坐标，必填
 * @param {number} options.rect_smooth2 平面坐标，必填
 * @param {number} options.rect_smooth3 平面坐标，必填
 * @returns true/false
 */
face.addFaceFeatures = function (userId, options) {
	if (userId === undefined || userId === null) {
		throw new Error("dxFace.addFaceFeatures: 'userId' parameter should not be null or empty")
	}
	if (options.feature === undefined || options.feature === null) {
		throw new Error("dxFace.addFaceFeatures: 'options.feature' parameter should not be null or empty")
	}
	if (options.is_wear_mask === undefined || options.is_wear_mask === null) {
		throw new Error("dxFace.addFaceFeatures: 'options.is_wear_mask' parameter should not be null or empty")
	}
	if (options.is_living === undefined || options.is_living === null) {
		throw new Error("dxFace.addFaceFeatures: 'options.is_living' parameter should not be null or empty")
	}
	if (options.rect_smooth0 === undefined || options.rect_smooth0 === null) {
		throw new Error("dxFace.addFaceFeatures: 'options.rect_smooth0' parameter should not be null or empty")
	}
	if (options.rect_smooth1 === undefined || options.rect_smooth1 === null) {
		throw new Error("dxFace.addFaceFeatures: 'options.rect_smooth1' parameter should not be null or empty")
	}
	if (options.rect_smooth2 === undefined || options.rect_smooth2 === null) {
		throw new Error("dxFace.addFaceFeatures: 'options.rect_smooth2' parameter should not be null or empty")
	}
	if (options.rect_smooth3 === undefined || options.rect_smooth3 === null) {
		throw new Error("dxFace.addFaceFeatures: 'options.rect_smooth3' parameter should not be null or empty")
	}
	return faceObj.addFaceFeatures(userId, options.feature, options.is_wear_mask, options.is_living, options.rect_smooth0, options.rect_smooth1, options.rect_smooth2, options.rect_smooth3)
}
/**
 * 人脸删除
 * @param {object} options 注册参数，由注册回调获取，参考face.addFaceFeatures方法
 * @returns true/false
 */
face.faceUpdateConfig = function (options) {
	if (options === null || options === undefined) {
		throw new Error("dxFace.faceUpdateConfig: 'options' parameter should not be null or empty")
	}
	return faceObj.faceUpdateConfig(options)
}
/**
 * 人脸删除
 * @param {string} userId 人员ID，必填
 * @returns true/false
 */
face.deleteFaceFeatures = function (userId) {
	if (userId === null || userId === undefined) {
		throw new Error("dxFace.deleteFaceFeatures: 'userId' parameter should not be null or empty")
	}
	return faceObj.deleteFaceFeatures("'" + userId + "'")
}
/**
 * 根据照片获取人脸特征值
 * @param {string} picPath 照片路径
 * @returns true/false
 */
face.faceGetFeaturesByPicFile = function (picPath) {
	if (picPath === null || picPath === undefined) {
		throw new Error("dxFace.faceGetFeaturesByPicFile: 'picPath' parameter should not be null or empty")
	}
	return faceObj.faceGetFeaturesByPicFile(picPath)
}
/**
 * 人脸追踪框回调注册
 * @param {string} name 函数名称，必填
 * @returns true/false
 */
face.registerDetectCallback = function (name) {
	if (name === undefined || name === null || name.length < 1) {
		throw new Error("dxFace.registerDetectCallback: 'name' parameter should not be null or empty")
	}
	return faceObj.registerDetectCallback(name)
}
/**
 * 人脸追踪框回调取消注册
 * @param {string} name 函数名称，必填
 * @returns true/false
 */
face.unregisterDetectCallback = function (name) {
	if (name === undefined || name === null || name.length < 1) {
		throw new Error("dxFace.unregisterDetectCallback: 'name' parameter should not be null or empty")
	}
	return faceObj.unregisterDetectCallback(name)
}
/**
 * 人脸线程启用/禁用，功能开关
 * @param {bool} en 启用、禁用，必填
 * @returns true/false
 */
face.faceSetEnable = function (en) {
	if (en === undefined || en === null) {
		throw new Error("dxFace.faceSetEnable: 'en' parameter should not be null or empty")
	}
	return faceObj.detectSetEnable(en)
}
/**
 * 同步人脸数据到内存（又添加又删除才需要调用）
 * @returns true/false
 */
face.faceFeaturesUpdate = function () {
	return faceObj.faceFeaturesUpdate()
}
/**
 * 清空人脸数据
 * @returns true/false
 */
face.faceFeaturesClean = function () {
	return faceObj.faceFeaturesClean()
}
/**
 * 获取屏幕亮度
 * @returns number 屏幕亮度
 */
face.getDisplayBacklight = function () {
	return faceObj.getDisplayBacklight()
}
/**
 * 设置屏幕亮度
 * @param {number} light 屏幕亮度，必填
 * @returns true/false
 */
face.setDisplayBacklight = function (light) {
	if (light === undefined || light === null) {
		throw new Error("dxFace.setDisplayBacklight: 'light' parameter should not be null or empty")
	}
	return faceObj.setDisplayBacklight(light)
}
/**
 * 判断face消息队列是否为空
 * @returns true/false
 */
face.msgIsEmpty = function () {
	return faceObj.msgIsEmpty()
}
/**
 * 从face消息队列中读取数据
 * @returns json
 */
face.msgReceive = function () {
	return JSON.parse(faceObj.msgReceive());
}

face.RECEIVE_MSG = '__face__MsgReceive'

/**
 * 用于简化face组件微光通信协议的使用，把face封装在这个worker里，使用者只需要订阅eventcenter的事件就可以监听face
 */
face.run = function () {
	let workerFile = '/app/code/dxmodules/faceWorker.js'
	new os.Worker(workerFile)
}

/**
 * 如果face单独一个线程，可以直接使用run函数，会自动启动一个线程，
 * 如果想加入到其他已有的线程，可以使用以下封装的函数
 */
face.worker = {
	//在while循环前
	beforeLoop: function (options) {
		// 人脸算法初始化
		face.init(options, options.capturerRgbId, options.capturerNirId, options.dbPath, options.score, options.fflitMax, options.mapPath, options.saveFacePath, options.saveFaceThumbnailPath)
		// 人脸追踪框回调注册
		face.registerDetectCallback("face")
	},
	//在while循环里
	loop: function () {
		if (!face.msgIsEmpty()) {
			let res = face.msgReceive();
			center.fire(face.RECEIVE_MSG, res)
		}
	}
}

export default face;
