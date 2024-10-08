import tcp from '../dxmodules/dxTcp.js'
import std from '../dxmodules/dxStd.js'
import logger from '../dxmodules/dxLogger.js'

// id
const id = "tcp"

// 连接tcp服务
tcp.create("192.168.60.166", "6000", 5000, 1, 60, id)

let timer = std.setInterval(() => {
    // 判断tcp连接状态
    if (tcp.isConnect(id)) {
        std.clearInterval(timer)
        // 连接上后接收tcp数据
        std.setInterval(() => {
            let byteArr = tcp.receive(1, 100, id)
            if (byteArr && byteArr.length > 0) {
                logger.info(JSON.stringify(byteArr));
                // 发送串口数据，原样返回
                tcp.send("hello", id)
            }
        }, 10)
    }
}, 1000)