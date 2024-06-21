//build: 20240619
//依赖组件:dxCommon,dxStd,dxMap
import { mongooseClass } from './libvbar-m-dxmongoose.so'
import dxCommon from './dxCommon.js'
import * as os from "os"
import std from './dxStd.js'
import dxMap from './dxMap.js'
const map = dxMap.get("default")
const mongooseObj = new mongooseClass();
const webserver = {}

/**
 * 初始化mongoose http server
 * @param {string} port 必填
 * @param {string} index 必填
 * @param {string} id 句柄id，非必填（若初始化多个实例需要传入唯一id）
 */
webserver.init = function (port, index, id) {
    if (!port) {
        throw new Error("port should not be null or empty")
    }
    if (!index) {
        throw new Error("index should not be null or empty")
    }
    let pointer = mongooseObj.init(port, index)
    if (!pointer) {
        throw new Error("webserver.init: init failed")
    }
    dxCommon.handleId("webserver", id, pointer)
}
/**
 * mongoose取消初始化
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns true/false
 */
webserver.deinit = function (id) {
    let pointer = dxCommon.handleId("webserver", id)
    return mongooseObj.deinit(pointer)
}
/**
 * mongoose注册回调，注册映射
 * @param {string} url 映射,必填
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns true/false
 */
webserver.rgisterCallback = function (url, id) {
    if (!url) {
        throw new Error("url should not be null or empty")
    }
    let pointer = dxCommon.handleId("webserver", id)
    return mongooseObj.mongooseHttpRegisterCallback(pointer, url)
}
/**
 * mongoose取消注册回调，取消注册映射
 * @param {string} url 映射,必填
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns true/false
 */
webserver.unRgisterCallback = function (url, id) {
    if (!url) {
        throw new Error("url should not be null or empty")
    }
    let pointer = dxCommon.handleId("webserver", id)
    return mongooseObj.mongooseHttpUnregisterCallback(pointer, url)
}
/**
 * mongoose 事件抓取
 * @param {*} timeout 间隔时间,必填
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns true/false
 */
webserver.mongoosePoll = function (timeout, id) {
    if (!timeout) {
        throw new Error("timeout should not be null or empty")
    }
    let pointer = dxCommon.handleId("webserver", id)
    return mongooseObj.mongoosePoll(pointer, timeout)
}
/**
 * mongoose 服务端响应
 * @param {string} responseBody 要响应的字符串数据,必填
 * @param {number} status 状态码,必填
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns true/false
 */
webserver.mongoosePrintf = function (responseBody, status, id) {
    if (!responseBody) {
        throw new Error("responseBody should not be null or empty")
    }
    if (!status) {
        throw new Error("status should not be null or empty")
    }
    let pointer = dxCommon.handleId("webserver", id)
    return mongooseObj.mongoosePrintf(pointer, responseBody, status)
}
/**
 * mongoose Http服务端响应
 * @param {string} responseBody 要响应的字符串数据,必填
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns true/false
 */
webserver.mongooseHttpPrintf = function (responseBody, id) {
    if (!responseBody) {
        throw new Error("responseBody should not be null or empty")
    }
    let pointer = dxCommon.handleId("webserver", id)
    return mongooseObj.mongooseHttpPrintf(pointer, responseBody)
}
/**
 * mongoose Http服务端JSON格式化数据响应
 * @param {string} responseBody 要响应的字符串数据,必填
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns true/false
 */
webserver.mongooseHttpReponse = function (responseBody, id) {
    if (!responseBody) {
        throw new Error("responseBody should not be null or empty")
    }
    let pointer = dxCommon.handleId("webserver", id)
    return mongooseObj.mongooseHttpReponse(pointer, responseBody)
}
/**
 * mongoose Http服务端JSON格式化数据响应
 * @param {string} responseBody 要响应的字符串数据,必填
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns true/false
 */
webserver.mongooseHttpReply = function (responseBody, id) {
    if (!responseBody) {
        throw new Error("responseBody should not be null or empty")
    }
    let pointer = dxCommon.handleId("webserver", id)
    return mongooseObj.mongooseHttpReply(pointer, responseBody)
}
/**
 * 判断nfc消息队列是否为空
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns true/false
 */
webserver.msgIsEmpty = function (id) {
    let pointer = dxCommon.handleId("webserver", id)
    return mongooseObj.msgIsEmpty(pointer)
}

/**
 * 从nfc消息队列中读取数据
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns json消息对象
 */
webserver.msgReceive = function (id) {
    let pointer = dxCommon.handleId("webserver", id)
    return mongooseObj.msgReceive(pointer)
}

webserver.RECEIVE_MSG = '__webserver__MsgReceive'

/**
 * 用于简化webserver组件的使用，把webserver封装在这个worker里，使用者只需要订阅eventcenter的事件就可以监听webserver
 * @param {object} options webserver组件参数，参考webserver.init，必填
 * @param {string} options.id  句柄id，非必填（若初始化多个实例需要传入唯一id）
 */
webserver.run = function (options) {
    if (options === undefined || options.length === 0) {
        throw new Error("dxWebserver.run:'options' parameter should not be null or empty")
    }
    if (options.id === undefined || options.id === null || typeof options.id !== 'string') {
        // 句柄id
        options.id = ""
    }
    if (options.port === undefined || options.port === null || typeof options.port !== 'string') {
        throw new Error("dxWebserver.run:'port' parameter should not be null or empty")
    }
    if (options.index === undefined || options.index === null || typeof options.index !== 'string') {
        throw new Error("dxWebserver.run:'index' parameter should not be null or empty")
    }
    if (options.urls === undefined || options.urls === null) {
        throw new Error("dxWebserver.run:'urls' parameter should not be null or empty")
    }
    let oldfilepre = '/app/code/dxmodules/webserverWorker'
    let content = std.loadFile(oldfilepre + '.js').replace("{{id}}", options.id)
    let newfile = oldfilepre + options.id + '.js'
    std.saveFile(newfile, content)
    let init = map.get("__webserver__run_init" + options.id)
    if (!init) {//确保只初始化一次
        map.put("__webserver__run_init" + options.id, options)
        new os.Worker(newfile)
    }
}
export default webserver;
