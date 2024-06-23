import logger from '../dxmodules/dxLogger.js'
import code from '../dxmodules/dxCode.js'
import center from '../dxmodules/dxEventCenter.js'
import std from '../dxmodules/dxStd.js'

//摄像头组件句柄 id
const capturerId = 'capturer1'

//解码组件句柄 id
const decoderId = 'decoder1'

//初始化事务中心
center.init()

//订阅摄像头解码器处理结束后的二维码数据
center.on(code.CODE_CONTENT, function (data) {
    logger.info("二维码内容为:", data)
}, "service")


//初始化摄像头参数
let options1 = { id: capturerId, path: "/dev/video11" }

//初始化解码器参数
let options2 = { id: decoderId, name: "decoder v4", width: 800, height: 600 }

//启动
code.worker.beforeLoop(options1, options2)

std.setInterval(() => {
    code.worker.loop(options1, options2)
    center.getEvent()

}, 20)


