//build:20240524
//通过这个组件来读取卡，包括M1卡，psam卡之类的
//依赖组件: dxDriver,dxMap,dxLogger,dxDriver,dxCommon,dxEventCenter
import { nfcClass } from './libvbar-p-dxnfc.so'
import dxCommon from './dxCommon.js'
import center from './dxEventCenter.js'
import std from './dxStd.js'
import dxMap from './dxMap.js'
import * as os from "os"
const nfcObj = new nfcClass();
const map = dxMap.get("default")
const nfc = {}

/**
 * NFC 初始化
 * @param {string} id 句柄id，非必填（若初始化多个实例需要传入唯一id）
 */
nfc.init = function (id) {
	let pointer = nfcObj.init()
	if (pointer === undefined || pointer === null) {
		throw new Error("nfc.init: init failed")
	}
	dxCommon.handleId("nfc", id, pointer)
}

/**
 * NFC 普通卡注册回调
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 */
nfc.cbRegister = function (id) {
	let pointer = dxCommon.handleId("nfc", id)
	return nfcObj.cbRegister(pointer, "nfc_cb", 1)
}

/**
 * NFC PSAM卡注册回调
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 */
nfc.psamCbRegister = function (id) {
	let pointer = dxCommon.handleId("nfc", id)
	return nfcObj.nfcPsamCheckVgcardCallback(pointer)
}

/**
 * NFC 取消初始化
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 */
nfc.deinit = function (id) {
	let pointer = dxCommon.handleId("nfc", id)
	let ret = nfcObj.cbUnregister(pointer, "nfc_cb")
	if (ret === false) {
		throw new Error("nfc.cbUnregister: cbUnregister failed")
	}
	return nfcObj.deinit(pointer)
}

/**
 * NFC 卡信息创建
 * @param {number} cardType 卡芯片类型(原厂定义)
 * @param {ArrayBuffer} cardId 卡号
 * @param {number} type 卡类型(我们自己定义的)
 * @returns cardInfo(pointer)
 */
nfc.cardInfoCreate = function (cardType, cardId, type) {
	if (!cardType) {
		throw new Error("cardInfoCreate:cardType should not be null or empty")
	}
	if (!cardId) {
		throw new Error("cardInfoCreate:cardId should not be null or empty")
	}
	if (!type) {
		throw new Error("cardInfoCreate:type should not be null or empty")
	}
	return nfcObj.cardInfoCreate(cardType, cardId, type);
}

/**
 * NFC 卡信息销毁
 * @param {pointer} cardInfo 卡信息
 * @returns 
 */
nfc.cardInfoDestory = function (cardInfo) {
	if (!cardInfo) {
		throw new Error("cardInfoDestory:cardInfo should not be null or empty")
	}
	return nfcObj.cardInfoDestory(cardInfo);
}

/**
 * NFC 卡信息复制
 * @param {pointer} cardInfo 卡信息
 * @returns cardInfo(pointer)
 */
nfc.cardInfoCopy = function (cardInfo) {
	if (cardInfo == null) {
		throw new Error("cardInfoCopy:cardInfo should not be null or empty")
	}
	return nfcObj.cardInfoCopy(cardInfo);
}

/**
 * NFC 判断是否有卡
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns bool
 */
nfc.isCardIn = function (id) {
	let pointer = dxCommon.handleId("nfc", id)
	return nfcObj.isCardIn(pointer);
}

/**
 * NFC 读M1卡扇区
 * @param {number} taskFlg 任务标志：
 *                    0x00->AUTO 告知扫码器该指令可单独执行，无指令间的依赖关系。
 *                    0x01->START 告知扫码器开始对卡操作或对卡操作尚未结束，且指令间可能存在依赖关系。
 *                    0x02->FINISH 告知扫码器本条指令是操作卡的最后一条指令，将卡片操作环境恢复到默态。
 * @param {number} secNum 扇区号
 * @param {number} logicBlkNum 块号（在扇区内的逻辑号0~3)
 * @param {number} blkNums 块数
 * @param {array} key 密钥, 长度6bytes
 * @param {number} keyType 密钥类型: A:0x60 B:0x61
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns Array 读取结果 undefined:失败
 */
nfc.m1cardReadSector = function (taskFlg, secNum, logicBlkNum, blkNums, key, keyType, id) {
	let pointer = dxCommon.handleId("nfc", id)
	_validate('m1cardReadSector', taskFlg, secNum, logicBlkNum, blkNums, key, keyType, ' ')
	return nfcObj.m1cardReadSector(pointer, taskFlg, secNum, logicBlkNum, blkNums, key, keyType);
}

/**
 * NFC 读M1卡扇区
 * @param {number} taskFlg 任务标志：
 *                    0x00->AUTO 告知扫码器该指令可单独执行，无指令间的依赖关系。
 *                    0x01->START 告知扫码器开始对卡操作或对卡操作尚未结束，且指令间可能存在依赖关系。
 *                    0x02->FINISH 告知扫码器本条指令是操作卡的最后一条指令，将卡片操作环境恢复到默态。
 * @param {number} secNum 扇区号
 * @param {number} logicBlkNum 块号（在扇区内的逻辑号0~3)
 * @param {number} blkNums 块数
 * @param {array} key 密钥, 长度6bytes
 * @param {number} keyType 密钥类型: A:0x60 B:0x61
 * @param {array} data 写入数据
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns int 写入长度 -1:错误
 */
nfc.m1cardWriteSector = function (taskFlg, secNum, logicBlkNum, blkNums, key, keyType, data, id) {
	let pointer = dxCommon.handleId("nfc", id)
	_validate('m1cardWriteSector', taskFlg, secNum, logicBlkNum, blkNums, key, keyType, data)
	return nfcObj.m1cardWriteSector(pointer, taskFlg, secNum, logicBlkNum, blkNums, key, keyType, data);
}

/**
 * 
 * @param {number} taskFlg 任务标志：
 *                    0x00->AUTO 告知扫码器该指令可单独执行，无指令间的依赖关系。
 *                    0x01->START 告知扫码器开始对卡操作或对卡操作尚未结束，且指令间可能存在依赖关系。
 *                    0x02->FINISH 告知扫码器本条指令是操作卡的最后一条指令，将卡片操作环境恢复到默态。
 * @param {number} blkNums 块号
 * @param {array} key 密钥, 长度6bytes
 * @param {number} keyType 密钥类型: A:0x60 B:0x61
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns Array 读取结果 undefined:失败
 */
nfc.m1cardReadBlk = function (taskFlg, blkNum, key, keyType, id) {
	let pointer = dxCommon.handleId("nfc", id)
	_validate('m1cardReadBlk', taskFlg, 1, 0, blkNum, key, keyType, ' ')
	return nfcObj.m1cardReadBlk(pointer, taskFlg, blkNum, key, keyType);
}

/**
 * 
 * @param {number} taskFlg 任务标志：
 *                    0x00->AUTO 告知扫码器该指令可单独执行，无指令间的依赖关系。
 *                    0x01->START 告知扫码器开始对卡操作或对卡操作尚未结束，且指令间可能存在依赖关系。
 *                    0x02->FINISH 告知扫码器本条指令是操作卡的最后一条指令，将卡片操作环境恢复到默态。
 * @param {number} blkNums 块号
 * @param {array} key 密钥, 长度6bytes
 * @param {number} keyType 密钥类型: A:0x60 B:0x61
 * @param {array} data 写入数据
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns int 写入长度 -1:错误
 */
nfc.m1cardWriteBlk = function (taskFlg, blkNum, key, keyType, data, id) {
	let pointer = dxCommon.handleId("nfc", id)
	_validate('m1cardWriteBlk', taskFlg, 1, 0, blkNum, key, keyType, data)
	return nfcObj.m1cardWriteBlk(pointer, taskFlg, blkNum, key, keyType, data);
}

/**
 * 判断nfc消息队列是否为空
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns bool
 */
nfc.msgIsEmpty = function (id) {
	let pointer = dxCommon.handleId("nfc", id)
	return nfcObj.msgIsEmpty(pointer)
}

/**
 * 从nfc消息队列中读取数据
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns json消息对象
 */
nfc.msgReceive = function (id) {
	let pointer = dxCommon.handleId("nfc", id)
	let msg = nfcObj.msgReceive(pointer)
	return JSON.parse(msg);
}

function _validate(fun, taskFlg, secNum, logicBlkNum, blkNums, key, keyType, data) {
	if (![0x00, 0x01, 0x02].includes(taskFlg)) {
		throw new Error(fun, ":taskFlg error")
	}
	if (!(secNum >= 0)) {
		throw new Error(fun, ":secNum error")
	}
	if (logicBlkNum == null || logicBlkNum == undefined || logicBlkNum < 0 || logicBlkNum > 3) {
		throw new Error(fun, ":logicBlkNum error")
	}
	if (blkNums == null || blkNums == undefined || blkNums < 0 || blkNums > 4) {
		throw new Error(fun, ":blkNums error")
	}
	if (key == null || key === undefined || key.length < 0) {
		throw new Error(fun, ":key error")
	}
	if (![0x60, 0x61].includes(keyType)) {
		throw new Error(fun, ":keyType error")
	}
	if (data === null || data === undefined) {
		throw new Error(fun, ":data error")
	}
}

nfc.RECEIVE_MSG = '__nfc__MsgReceive'

/**
 * 简化NFC组件的使用，无需轮询去获取网络状态，网络的状态会通过eventcenter发送出去
 * run 只会执行一次，执行之后网络基本配置不能修改
 * 如果需要实时获取刷卡数据，可以订阅 eventCenter的事件，事件的topic是nfc.CARD，事件的内容是类似
 * {id:'卡id',card_type:卡芯片类型,id_len:卡号长度,type：卡类型,timestamp:'刷卡时间戳',monotonic_timestamp:'相对开机的时间'}
 * @param {*} options 
 * 		@param {boolean} options.m1 非必填，普通卡回调开关
 * 		@param {boolean} options.psam 非必填，psam卡回调开关
 *      @param {string} options.id  句柄id，非必填（若初始化多个实例需要传入唯一id）
 */
nfc.run = function (options) {
	if (options === undefined || options.length === 0) {
		throw new Error("dxnfc.run:'options' parameter should not be null or empty")
	}
	if (options.id === undefined || options.id === null || typeof options.id !== 'string') {
		// 句柄id
		options.id = ""
	}
	let oldfilepre = '/app/code/dxmodules/nfcWorker'
	let content = std.loadFile(oldfilepre + '.js').replace("{{id}}", options.id)
	let newfile = oldfilepre + options.id + '.js'
	std.saveFile(newfile, content)
	let init = map.get("__nfc__run_init" + options.id)
	if (!init) {//确保只初始化一次
		map.put("__nfc__run_init" + options.id, options)
		new os.Worker(newfile)
	}
}

/**
 * 如果nfc单独一个线程，可以直接使用run函数，会自动启动一个线程，
 * 如果想加入到其他已有的线程，可以使用以下封装的函数
 */
nfc.worker = {
	//在while循环前
	beforeLoop: function (options) {
		nfc.init(options.id)
		// PSAM和普通卡回调
		if (options.m1) {
			nfc.cbRegister(options.id)
		}
		if (options.psam) {
			nfc.psamCbRegister(options.id)
		}
	},
	//在while循环里
	loop: function (options) {
		if (!nfc.msgIsEmpty(options.id)) {
			let res = nfc.msgReceive(options.id);
			if (options.id === undefined || options.id === null || typeof options.id !== 'string') {
				// 句柄id
				options.id = ""
			}
			center.fire(nfc.RECEIVE_MSG + options.id, res)
		}
	}
}
export default nfc;
