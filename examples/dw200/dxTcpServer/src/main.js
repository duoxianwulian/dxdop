import tcpServer from '../dxmodules/dxTcpServer.js'
import std from '../dxmodules/dxStd.js'
import logger from '../dxmodules/dxLogger.js'

// id
const id = "tcpServer"

// 初始化tcp服务
logger.info(tcpServer.init(6008, 1000, id));

let timer = std.setInterval(() => {
    let clients = JSON.parse(tcpServer.scan(id))
    if (clients && clients.length > 0) {
        logger.info("扫描到的第一个客户端ID: ", clients[0].id)
        logger.info("扫描到的第一个客户端IP: ", clients[0].ip)
        logger.info("扫描到的第一个客户端PORT: ", clients[0].port)
        std.clearInterval(timer)
    }
}, 1000)

std.setInterval(() => {
    if (!tcpServer.msgIsEmpty()) {
        // 数据接收
        let msgOjb = tcpServer.msgReceive();
        let data = String.fromCharCode.apply(null, new Uint8Array(msgOjb.data));
        logger.info(data);
        // 数据发送
        let buffer = new ArrayBuffer(4); // 创建一个长度为 4 的 buffer
        let view = new Uint8Array(buffer);
        // 让我们写入"abcd"
        view[0] = 0x61;
        view[1] = 0x62;
        view[2] = 0x63;
        view[3] = 0x64;
        logger.info(tcpServer.send(msgOjb.clientId, buffer));
    }
}, 10)
