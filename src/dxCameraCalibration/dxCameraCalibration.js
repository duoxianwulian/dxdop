//build: 20240528
//依赖组件:dxDriver，dxLogger，dxMap，dxCapturer
import { calibrationClass } from './libvbar-m-dxcapturer_calibration.so'
import * as os from "os";
import dxMap from './dxMap.js'
const calibrationObj = new calibrationClass();
const map = dxMap.get('default')
const calibration = {}

/**
 * calibration 初始化
 * @returns true/false
 */
calibration.init = function () {
	return calibrationObj.init();
}

/**
 * calibration 销毁
 * @returns true/false
 */
calibration.deinit = function () {
	return calibrationObj.deinit();
}

/**
 * 识别标定（拿方格纸对准屏幕上的方框）
 * @param {number} imageRgb image指针，必填
 * @param {number} imageNir image指针，必填
 * @param {number} cnt 标定次数，必填（0：第一次标定,1：第二次标定）
 * @returns true/false
 */
calibration.calibrationFromImage = function (imageRgb, imageNir, cnt) {
	return calibrationObj.calibrationFromImage(imageRgb, imageNir, cnt);
}

/**
 * 计算并存储标定结果
 * @param {number} imageNir image指针，必填
 * @param {string} path 存储路径，必填
 * @returns true/false
 */
calibration.getMap = function (imageRgb, imageNir,cnt, path) {
	return calibrationObj.getMap(imageRgb, imageNir,cnt, path);
}

/**
 * 获取绘制标定ui框信息
 * @param {number} cnt 标定次数，必填（0：第一次标定,1：第二次标定）
 * @returns {x:横坐标,y:纵坐标,w:宽,h:高}
 */
calibration.getBox = function (cnt) {
	return calibrationObj.getBox(cnt);
}

calibration.RECEIVE_MSG = '__calibration__MsgReceive'

/**
 * 简化cameraCalibration组件的使用，无需轮询去获取数据，数据会通过eventcenter发送出去
 * 由于识别标定calibrationFromImage是阻塞线程的方法，所以必须新开一个线程执行，否则会阻塞其他线程
 * run 只会执行一次
 * @param {object} options 配置参数
 * @param {string} options.capturerRgbId      必填，rgb取图句柄id
 * @param {string} options.capturerNirId      必填，nir取图句柄id
 * @param {number} options.timeout      	单位秒，非必填（缺省20秒），标定的超时时间，在此期间内未完成两次标定，则标定失败结束线程，如需重新标定，必须再次执行run方法
 */
calibration.run = function (options) {
	if (options === undefined || options.length === 0) {
		throw new Error("dxCameraCalibration.run:'options' parameter should not be null or empty")
	}
	if (options.capturerRgbId === undefined || options.capturerRgbId === null || options.capturerRgbId.length <= 0) {
		throw new Error("dxCameraCalibration.run:'capturerRgbId' should not be null or empty")
	}
	if (options.capturerNirId === undefined || options.capturerNirId === null || options.capturerNirId.length <= 0) {
		throw new Error("dxCameraCalibration.run:'capturerNirId' should not be null or empty")
	}
	options.timeout = options.timeout ? options.timeout : 20
	let workerFile = '/app/code/dxmodules/cameraCalibrationWorker.js'
	let init = map.get("__cameraCalibration__run_init")
	if (!init) {//确保只初始化一次
		map.put("__cameraCalibration__run_init", options)
		new os.Worker(workerFile)
	}
}

export default calibration;