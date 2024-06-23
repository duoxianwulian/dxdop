import uart from '../dxmodules/dxUart.js'
import std from '../dxmodules/dxStd.js'
import logger from '../dxmodules/dxLogger.js'

// id
const id = "uart"

// 485串口地址
const UART_485 = "/dev/ttyS3"

// 打开485串口
uart.open(uart.TYPE.UART, UART_485, id)

// 设置串口波特率
uart.ioctl(1, '115200-8-N-1', id)

// 接收数据
std.setInterval(() => {
    let byteArr = uart.receive(1, 100, id)
    if (byteArr && byteArr.length > 0) {
        logger.info(JSON.stringify(byteArr));
        // 发送串口数据，原样返回
        let buffer = new ArrayBuffer(byteArr.length);
        let uint8View = new Uint8Array(buffer);
        for (let i = 0; i < byteArr.length; i++) {
            uint8View[i] = byteArr[i];
        }
        uart.send(buffer, id)
    }
}, 10)