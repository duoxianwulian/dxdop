import * as os from "os"
import uart from '../dxmodules/dxUart.js'
import logger from '../dxmodules/dxLogger.js'
import center from '../dxmodules/dxEventCenter.js'
center.init()
/**
 * 基础示例
 */
const UART_485 = "/dev/ttyS3"
const id = 'uart1'
center.on(uart.VG.RECEIVE_MSG + id, function (data) {
    logger.debug(data)
    if (data.cmd === '04') {
        //55 AA 0A 00 10 00 75 A2 37 20 16 A2 A0 07 00 00 00 00 84 0B 9C CF EA
        uart.send({ "cmd": "0A", "length": 16, "result": "00", "data": "75A2372016A2A00700000000840B9CCF" }, id)
    } else if (data.cmd === '01') {
        uart.send('55AA0100020055AA03', id)
    }
}, id)

// passThrough参数为true则使用透传模式
uart.runvg({ id: id, type: uart.TYPE.UART, path: UART_485, result: 0, passThrough: false })
//等待启动休眠 100 毫秒
os.sleep(100)
//修改波特率 S99内不用添加指令了   蓝牙参数：921600-8-N-1  485 参数115200-8-N-1
uart.ioctl(1,'115200-8-N-1',id)
while (true) {
    center.getEvent()
    os.sleep(20)
}

