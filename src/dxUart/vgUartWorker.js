//build:20240524
//用于简化uart组件微光通信协议的使用，把uart封装在这个worker里，使用者只需要订阅eventcenter的事件就可以监听uart
import log from './dxLogger.js'
import uart from './dxUart.js'
import common from './dxCommon.js';
import dxMap from './dxMap.js'
import * as os from "os";
import center from './dxEventCenter.js'
const map = dxMap.get('default')
const id = "{{id}}"
const options = map.get("__vguart__run_init" + id)
const timeout = 100
const longTimeout = 500

function run() {
    uart.open(options.type, options.path, options.id)
    log.info('vg uart start......,id =', id)
    while (true) {
        try {
            // 接收数据模式
            if (options.passThrough) {
                // 透传模式，适配韦根之类
                passThrough()
            } else {
                // 微光通信协议模式
                receive()
            }
        } catch (error) {
            log.error(error, error.stack)
        }
        os.sleep(10)
    }
}

// 透传模式
function passThrough() {
    let pack = [];
    let buffer = readOne()
    while (buffer !== null) {
        pack.push(buffer)
        os.sleep(10)
        buffer = readOne()
    }
    if (pack.length !== 0) {
        center.fire(uart.VG.RECEIVE_MSG + options.id, pack)
    }
}

function receive() {
    //前2个字节必须是55aa
    let buffer = readOne()
    if (buffer === null) {
        return;
    }
    if (buffer == 85) {//0x55
        buffer = readOne()
        if (buffer != 170) {//0xaa
            return;
        }
    } else {
        return;
    }
    let pack = {};
    // 读取命令字（占用1Byte）
    buffer = readOne()
    if (buffer === null) {
        return;
    }
    pack.cmd = buffer
    if (options.result) {
        // 读取结果字（占用1Byte）
        buffer = readOne()
        if (buffer === null) {
            return;
        }
        pack.result = buffer;
    } else {
        pack.result = 0//0不影响bcc的计算结果
    }
    // 命令头已解析完，读取长度字（占用2Byte）
    let len1 = readOne()
    if (len1 === null) {
        return;
    }
    let len2 = readOne()
    if (len2 === null) {
        return;
    }
    // 解析长度字，获取数据域长度
    let len = len1 + len2 * 256
    // 根据长度字读取指定数据长度
    pack.length = len
    if (len > 0) {
        buffer = uart.receive(len, longTimeout, options.id)
        if (buffer === null) {
            return;
        }
        pack.data = Array.from(buffer);
    } else {
        pack.data = 0
    }
    // 读取1Byte的校验位
    buffer = readOne()
    if (buffer === null) {
        return;
    }
    let bcc = valid(pack, buffer)
    let res = { cmd: int2hex(pack.cmd), length: pack.length, bcc: bcc }
    if (pack.length > 0) {
        res.data = common.arrToHex(pack.data)
    }
    if (options.result) {
        res.result = int2hex(pack.result)
    }
    center.fire(uart.VG.RECEIVE_MSG + options.id, res)
}
function valid(pack, bcc) {
    let temp = common.calculateBcc([0x55, 0xaa, pack.cmd, pack.result, pack.length % 256, Math.floor(pack.length / 256)].concat(pack.data))
    return temp === bcc
}
function readOne() {
    let buffer = uart.receive(1, timeout, options.id)
    if (buffer) {
        return parseInt(buffer);
    }
    return null
}
function int2hex(num) {
    return num.toString(16).padStart(2, '0')
}

try {
    run()
} catch (error) {
    log.error(error, error.stack)
}