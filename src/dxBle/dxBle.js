// build: 20240808
// 蓝牙数据通信通道
// 依赖组件:dxDriver，dxStd，dxLogger，dxMap，dxEventBus,dxCommon
import dxMap from './dxMap.js'
import common from './dxCommon.js'
import std from './dxStd.js'
import bus from './dxEventBus.js'
import uart from './dxUart.js'
import * as os from "os"
import log from './dxLogger.js'
const map = dxMap.get('default')
const ble = {}


ble.VG = {
	RECEIVE_MSG: '__ble__MsgReceive',
}

/**
 * 简化微光蓝牙通信协议的使用，
 * 1. 接受数据：把TLV的二进制的数据接受到后解析成对象，并以eventbus的event发送出去(uart.VG.RECEIVE_MSG+options.id)
 * 返回的对象格式：{cmd:"2a",result:"01",length:7,data:"0a1acc320fee32",bcc:true}
 * cmd: 1个字节的命令字，16进制字符串
 * result:1个字节的标识字，表示数据处理的结果，成功或失败或其他状态。只有反馈数据才有标识字，16进制字符串
 * length：数据的长度，在TLV里用2个字节来定义，这里直接转成10进制的数字
 * data：多个字节的数据域，16进制字符串
 * bcc: bcc校验成功或失败
 * 2. 发送数据：把对象转成TLV格式的二进制数据再发送出去，可以通过uart.sendVg('要发送的数据',id)，数据格式如下
 * 发送的数据格式有二种 1.对象格式 ：{cmd:"2a",result:"01",length:7,data:"0a1acc320fee32"} 2. 完整的16进制字符串'55AA09000000F6'
 * 3. 同样的id，多次调用runvg也只会执行一次
 * 
 * @param {object} options 启动的参数
 *			@param {number} options.type 通道类型，参考枚举 TYPE，必填  （兼容USBHID块传输，默认1024每块）
 *			@param {string} options.path 不同的设备或同一设备的不同类型通道对应的path不一样，比如DW200的485对应的值是"/dev/ttyS2"，必填
 *			@param {number} options.result 0和1(缺省是0)，标识是接收的数据还是发送的数据包含标识字节，0表示接受的数据不包括标识字，发送的数据包括，1是反之
 *			@param {number} options.passThrough passThrough为true则接收的数据使用透传模式，非必填
 *          @param {string} options.id  句柄id，非必填（若初始化多个实例需要传入唯一id）
 * 			@param {number} options.bleName 要设置的蓝牙名称 非必填
 *          @param {string} options.broadcast 要设置的广播标识 非必填
 */
ble.run = function (options) {
	if (options === undefined || options.length === 0) {
		throw new Error("dxuart.runvg:'options' parameter should not be null or empty")
	}
	if (options.id === undefined || options.id === null || typeof options.id !== 'string') {
        // 句柄id
        options.id = ""
    }
	if (options.type === undefined || options.type === null) {
		throw new Error("dxuart.runvg:'type' should not be null or empty")
	}
	if (options.path === undefined || options.path === null) {
		throw new Error("dxuart.runvg:'path' should not be null or empty")
	}
	let oldfilepre = '/app/code/dxmodules/vgBleWorker'
	let content = std.loadFile(oldfilepre + '.js').replace("{{id}}", options.id)
	let newfile = oldfilepre + options.id + '.js'
	std.saveFile(newfile, content)
	let init = map.get("__vgble__run_init" + options.id)
	if (!init) {//确保只初始化一次
		map.put("__vgble__run_init" + options.id, options)
		bus.newWorker(options.id || "__ble",newfile)
	}
}

/**
 * 
 * @param {*} data 例如：55AA31010001CE 或 55 AA 31 01 00 01 CE
 * @returns 
 */
ble.send = function(data, id) {
    data = data.replaceAll("\"", "")
    uart.send(common.hexStringToArrayBuffer(data), id)
}

/**
 * 查询蓝牙配置信息
 * @param {*} 
 * @returns 
 */
ble.getBleConfig = function(id) {
    let pack = { "head": "55aa", "cmd": "60", "result": "00", "dlen": 6, "data": [0x7e, 0x01, 0x00, 0x02, 0x00, 0xfe] }
    pack.crc = ble.genCrc(pack)
    let data = pack.head + pack.cmd + pack.result + common.decimalToLittleEndianHex(pack.dlen, 2) + pack.data.map(v => v.toString(16).padStart(2, '0')).join("") + pack.crc.toString(16).padStart(2, '0')
    ble.send(data, id)
    for (let index = 0; index < 20; index++) {
        let res = map.get("__ble__config")
        if(res){
            return res
        }
        os.sleep(50)
    }
    return null
}

/**
 * 设置蓝牙配置信息
 * @param {*} param param.name蓝牙名称 param.mac蓝牙mac param.broadcastSnTlv蓝牙广播SN param.broadcastStatusTlv蓝牙广播状态标识
 * @returns 
 */
ble.setBleConfig = function(param, id) {
    if (!param || !param.name) {
        return
    }
    let nameTlv = ""
    let macTlv = ""
    let broadcastSnTlv = ""
    let broadcastStatusTlv = ""

    let name = param.name
    if (name !== undefined) {
        if (name && !/[\u4E00-\u9FA5]/g.test(name) && name.length <= 10) {
            nameTlv = "10" + common.decimalToLittleEndianHex(name.length, 1) + common.stringToHex(name)
        } else {
            log.error("蓝牙名称不能为中文且长度不能超过10个字符");
            return
        }
    }

    // 内部方法，mac校验
    let VBAR_M_BLE_MACLEN = 6
    function bleMacIsValid(mac) {
        if (mac.length != VBAR_M_BLE_MACLEN) {
            return false;
        }
        if (!mac.some(v => v !== "00") || mac[VBAR_M_BLE_MACLEN - 1] & 0xc0 !== 0xc0) {
            return false;
        }
        return true;
    }

    let mac = param.mac
    if (mac !== undefined) {
        if (mac && mac.length === 12 && /^[a-zA-Z0-9]*$/.test(mac) && bleMacIsValid(mac.match(/.{2}/g))) {
            macTlv = "11" + "06" + mac
        } else {
            log.error("蓝牙mac地址格式错误");
            return
        }
    }

    let broadcastSn = param.broadcastSn
    if (broadcastSn !== undefined) {
        if (broadcastSn && broadcastSn.length === 12 && /^[a-zA-Z0-9]*$/.test(broadcastSn)) {
            macTlv = "12" + "06" + mac
        } else {
            log.error("蓝牙广播SN格式错误");
            return
        }
    }

    let broadcastStatus = param.broadcastStatus
    if (broadcastStatus !== undefined) {
        if (broadcastStatus) {
            macTlv = "15" + "01" + broadcastStatus
        } else {
            log.error("蓝牙广播状态标识格式错误");
            return
        }
    }

    let content = "7a00" + nameTlv + macTlv + broadcastSnTlv + broadcastStatusTlv + "fe"

    let pack = { "head": "55aa", "cmd": "60", "result": "00", "dlen": content.length / 2, "data": content.match(/.{2}/g).map(v => parseInt(v, 16)) }
    pack.crc = ble.genCrc(pack)
    let data = pack.head + pack.cmd + pack.result + common.decimalToLittleEndianHex(pack.dlen, 2) + pack.data.map(v => v.toString(16).padStart(2, '0')).join("") + pack.crc.toString(16).padStart(2, '0')
    ble.send(data, id)
}


ble.genCrc =  function(pack) {
    let bcc = 0;
    let dlen = pack.dlen - 1;//去掉index
    bcc ^= 0x55;
    bcc ^= 0xaa;
    bcc ^= parseInt(pack.cmd, 16);
    bcc ^= pack.result ? parseInt(pack.result, 16) : 0;
    bcc ^= (dlen & 0xff);
    bcc ^= (dlen & 0xff00) >> 8;
    for (let i = 0; i < pack.dlen; i++) {
        bcc ^= pack.data[i];
    }
    return bcc;
}

ble.toHexadecimal =  function(data) {
    return parseInt(data).toString(16).padStart(2, '0')
}

ble.getUrandom = function(len) {
    return common.systemWithRes(`dd if=/dev/urandom bs=1 count="${len}" 2>/dev/null | xxd -p`, 100).split(/\s/g)[0]
}

export default ble;