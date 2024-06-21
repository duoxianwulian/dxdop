//build: 20240304
//二维码、条形码的扫描解析，由dxCapturer来取图，由dxDecoder来解析图
//依赖组件：dxDriver，dxCapturer，dxDecoder ,dxMap,dxEventCenter,dxLogger,dxCommon,dxQueue

import dxMap from './dxMap.js'
import dxCapturer from './dxCapturer.js'
import dxDecoder from './dxDecoder.js'
import center from './dxEventCenter.js'
import * as os from "os";
const code = {}
const map = dxMap.get("default")
code.CODE_CONTENT = '__code__Content'

/**
 * 解析条形码、二维码并返回文本内容
 * 文本内容会向eventcenter发送消息，消息的主题是 code.CODE_CONTENT
 * @param {object} capturerOptions 取图组件参数，参考dxCapturer.init，必填
 * @param {object} decoderOptions  解码组件参数，参考dxDecoder.init，必填
 */
code.run = function (capturerOptions, decoderOptions) {
    let worker = '/app/code/dxmodules/codeWorker.js'
    let init = map.get("__code__run_init")
    if (!init) {//确保只初始化一次
        map.put("__code__run_init", { capturer: capturerOptions, decoder: decoderOptions })
        new os.Worker(worker)
    }
}
/**
 * 如果code单独一个线程，可以直接使用run函数，会自动启动一个线程，
 * 如果想加入到其他已有的线程，可以使用以下封装的函数,使用的方法可以参考codeWorker.js
 */
code.worker = {
    oldContent: '',
    lastTimestamp: 0,
    mode: 0, //缺省是间隔模式，也就是扫描到重复的二维码会重复上报，上报的间隔是interval，如果为1表示单次模式，重复的二维码只会上报一次
    interval: 1000,//扫描间隔，只有mode为0的时候才有意义,缺省是1秒
    //在while循环前
    beforeLoop: function (capturerOptions, decoderOptions) {
        dxCapturer.worker.beforeLoop(capturerOptions)
        dxDecoder.worker.beforeLoop(decoderOptions)
    },
    //在while循环里
    loop: function (capturerOptions, decoderOptions) {
        if (!dxCapturer.msgIsEmpty(capturerOptions.id)) {
            let res = dxCapturer.msgReceive(capturerOptions.id);
            dxDecoder.scanImage(decoderOptions.id, res)
        }
        if (!dxDecoder.msgIsEmpty(decoderOptions.id)) {
            let msg = dxDecoder.msgReceive(decoderOptions.id);
            if (msg != undefined && msg != null && msg.length > 0) {
                const now = new Date().getTime()
                if (code.worker.mode == 1) {//单次模式
                    if (msg != code.worker.oldContent) {
                        center.fire(code.CODE_CONTENT, msg)
                        code.worker.lastTimestamp = now
                        code.worker.oldContent = msg
                    }
                } else {//间隔模式 
                    let interval = Math.max(300, code.worker.interval)//最少也是300毫秒
                    if ((now - code.worker.lastTimestamp) > interval || msg != code.worker.oldContent) {//1秒内不发送重复的数据
                        center.fire(code.CODE_CONTENT, msg)
                        code.worker.lastTimestamp = now
                        code.worker.oldContent = msg
                    }
                }
            }
        }
    }
}
export default code;