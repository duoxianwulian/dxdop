//build: 20240606
//TCP Server
//依赖组件:
import { tcpServerClass } from './libvbar-m-dxTcpServer.so'
import dxCommon from './dxCommon.js'

const tcpServerObj = new tcpServerClass();
const tcpServer = {}

/**
 * TCP SERVER 初始化
 * @param {number} port 端口号
 * @param {number} clientNumber 最大客户端数
 * @returns true/false
 */
tcpServer.init = function (port, clientNumber, id) {
    let pointer = tcpServerObj.tcpServerInit(port, clientNumber)
    if (!pointer) {
        throw new Error("Tcp Server init failed")
    }
    dxCommon.handleId("tcpServer", id, pointer)
    return true
}
/**
 * TCP SERVER 数据发送
 * @param {number} clientId 客户端id
 * @param {string} data 要发送的数据
 * @returns true/false
 */
tcpServer.send = function (clientId, data) {
    return tcpServerObj.tcpServerSend(clientId, data);
}

/**
 * TCP SERVER 停止
 * @returns true/false
 */
tcpServer.stop = function (id) {
    let pointer = dxCommon.handleId("tcpServer", id)
    return tcpServerObj.tcpServerStop(pointer)
}

/**
 * TCP SERVER 销毁
 * @returns true/false
 */
tcpServer.delete = function (id) {
    let pointer = dxCommon.handleId("tcpServer", id)
    return tcpServerObj.tcpServerDelete(pointer)
}

/**
 * TCP SERVER 扫描当前连接的客户端
 * @returns true/false
 */
tcpServer.scan = function (id) {
    let pointer = dxCommon.handleId("tcpServer", id)
    return tcpServerObj.tcpServerScanClient(pointer)
}

/**
 * TCP SERVER 根据clientId断开指定客户端链接
 * @returns true/false
 */
tcpServer.disconnectClient = function (id, clientId) {
    let pointer = dxCommon.handleId("tcpServer", id)
    return tcpServerObj.tcpServerDisconnectClient(pointer, clientId)
}

/**
 * 判断tcp消息队列是否为空
 * @returns true/false
 */
tcpServer.msgIsEmpty = function () {
    return tcpServerObj.msgIsEmpty()
}

/**
 * 从tcp消息队列中读取数据
 * @returns json
 */
tcpServer.msgReceive = function () {
    let msgObj = JSON.parse(tcpServerObj.msgReceive())
    let hexString = msgObj.data;
    var byteString = hexString.match(/.{1,2}/g);
    var byteArray = byteString.map(function(byte) {
        return parseInt(byte, 16);
    });
    var buffer = new Uint8Array(byteArray).buffer;
    msgObj.data = buffer
    return msgObj;
}


export default tcpServer;