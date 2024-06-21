//build: 20240524
//摄像头取图之后利用这个组件来解码，主要用于解析二维码图像
//依赖组件：dxDriver，dxCommon，dxStd，dxMap
import { decoderClass } from './libvbar-m-dxdecoder.so'
import * as os from "os"
import dxCommon from './dxCommon.js'
import std from './dxStd.js'
import dxMap from './dxMap.js'
import center from './dxEventCenter.js'
const decoderObj = new decoderClass();
const map = dxMap.get('default')
const decoder = {}
/**
 * 图形解码模块初始化 
 * @param {object} options 配置参数，大部分可以用默认值
 * @param {string} options.name         必填，自定义解码器名称，随意填
 * @param {number} options.width        必填，图像宽，不同的设备不一样，比如DW200是800
 * @param {number} options.height       必填，图像高，不同的设备不一样，比如DW200是600
 * @param {number} options.widthbytes   非必填，每个像素所占字节数 GREY : 1， YUV : 2，缺省是1
 * @param {object} options.config       非必填，配置项，缺省是{}
 * @param {number} options.max_channels 非必填，最大支持的同步输出channel数量，缺省是10
 * @param {string} id 句柄id，非必填（若初始化多个实例需要传入唯一id）
 */
decoder.init = function (options, id) {
    if (options.name === null || options.name.length < 1) {
        throw new Error("dxDecoder.init: 'name' parameter should not be null or empty")
    }
    if (options.width === undefined || options.width === null) {
        throw new Error("dxDecoder.init: 'width' parameter should not be null")
    }
    if (options.height === undefined || options.height === null) {
        throw new Error("dxDecoder.init: 'height' parameter should not be null")
    }
    _setDefaultOptions(options, 'config', {});
    _setDefaultOptions(options, 'widthbytes', 1);
    _setDefaultOptions(options, 'maxChannels', 10);
    let pointer = decoderObj.init(options.name, options.config, options.width, options.widthbytes, options.height, options.maxChannels);
    if (!pointer) {
        throw new Error("dxDecoder.init: init failed")
    }
    dxCommon.handleId("decoder", id, pointer)
}
/**
 * 判断解码器消息队列是否为空
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns true/false
 */
decoder.cbRegister = function (id) {
    let pointer = dxCommon.handleId("decoder", id)
    return decoderObj.cbRegister(pointer, "decoderOut")
}
/**
 * 二维码识别
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @param {number} image capturer取图指针
 * @returns 二维码内容字符串
 */
decoder.scanImage = function (id, image) {
    let pointer = dxCommon.handleId("decoder", id)
    return decoderObj.scanImage(pointer, image)
}
/**
 * 判断解码器消息队列是否为空
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 */
decoder.msgIsEmpty = function (id) {
    let pointer = dxCommon.handleId("decoder", id)
    return decoderObj.msgIsEmpty(pointer)
}
/**
 * 从解码器消息队列中读取数据
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 */
decoder.msgReceive = function (id) {
    let pointer = dxCommon.handleId("decoder", id)
    return decoderObj.msgReceive(pointer)
}
/**
 * 解码器销毁退出
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 */
decoder.deinit = function (id) {
    let pointer = dxCommon.handleId("decoder", id)
    return decoderObj.deinit(pointer)
}
function _setDefaultOptions(options, key, defaultValue) {
    if (options[key] === undefined || options[key] === null) {
        options[key] = defaultValue;
    }
}

decoder.RECEIVE_MSG = '__decoder__MsgReceive'

/**
 * 用于简化decoder组件的使用，把decoder封装在这个worker里，使用者只需要订阅eventcenter的事件就可以监听decoder
 * @param {object} options decoder组件参数，参考decoder.init，必填
 * @param {string} options.id  句柄id，非必填（若初始化多个实例需要传入唯一id）
 */
decoder.run = function (options) {
    if (options === undefined || options.length === 0) {
        throw new Error("dxdecoder.run:'options' parameter should not be null or empty")
    }
    if (options.id === undefined || options.id === null || typeof options.id !== 'string') {
        // 句柄id
        options.id = ""
    }
    if (options.width === undefined || options.width === null) {
        throw new Error("dxdecoder.run: 'width' should not be null")
    }
    if (options.height === undefined || options.height === null) {
        throw new Error("dxdecoder.run: 'height' should not be null")
    }
    let oldfilepre = '/app/code/dxmodules/decoderWorker'
    let content = std.loadFile(oldfilepre + '.js').replace("{{id}}", options.id)
    let newfile = oldfilepre + options.id + '.js'
    std.saveFile(newfile, content)
    let init = map.get("__decoder__run_init" + options.id)
    if (!init) {//确保只初始化一次
        map.put("__decoder__run_init" + options.id, options)
        new os.Worker(newfile)
    }
}

/**
 * 如果decoder单独一个线程，可以直接使用run函数，会自动启动一个线程，
 * 如果想加入到其他已有的线程，可以使用以下封装的函数
 */
decoder.worker = {
    //在while循环前
    beforeLoop: function (options) {
        decoder.init({ name: options.name, width: options.width, height: options.height }, options.id)
        decoder.cbRegister(options.id)
    },
    //在while循环里
    loop: function (options) {
        if (!decoder.msgIsEmpty(options.id)) {
            let res = decoder.msgReceive(options.id);
            if (options.id === undefined || options.id === null || typeof options.id !== 'string') {
                // 句柄id
                options.id = ""
            }
            center.fire(decoder.RECEIVE_MSG + options.id, res)
        }
    }
}

export default decoder;
