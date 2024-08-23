import * as os from "os"
import log from '../dxmodules/dxLogger.js'
import screen from './screen.js'
import driver from './driver.js'
const intercept = {}

// 线程数据拦截规则，主要是拦截消息给主线程提供业务处理能力
intercept.intercept = function (data) {
    // 拦截这里拥有的方法
    if (!intercept[data.topic]) {
        return false
    }
    // 拦截数据处理
    intercept[data.topic](data.data)
    return true
}

// ui网络状态更新
intercept.netStatus = function (data) {
    if (data.type == 1 && data.connected) {
        screen.ethStatus(true)
    } else {
        screen.ethStatus(false)
    }
}

// ui mqtt连接状态更新
intercept.mqttStatus = function (data) {
    if (data == "connected") {
        screen.mqttStatus(true)
    } else {
        screen.mqttStatus(false)
    }
}

// ui 人脸追踪框更新
intercept.track = function (data) {
    if (data.rect_smooth) {
        data.rect_smooth = data.rect_smooth.map(v => parseInt(v))
        let x1 = data.rect_smooth[0]
        let y1 = data.rect_smooth[1]
        let x2 = data.rect_smooth[2]
        let y2 = data.rect_smooth[3]
        let points = [[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]]
        screen.track(points)
    }
}

// ui 弹出通知
intercept.popNote = function (data) {
    screen.popNote(data.msg, data.bgColor, data.textColor)
}

// 人脸注册
let lock = false
let beginReg = false
intercept.feature = function (data) {
    if (!screen.regStatus()) {
        // 不在人脸模式
        return
    }
    if (beginReg) {
        let ret = driver.face.reg(screen.getPersonID(), data);
        if (ret) {
            driver.alsa.ttsPlay("注册成功")
            screen.popNote("注册成功！", 0x46B146)
        } else {
            driver.alsa.ttsPlay("注册失败")
            screen.popNote("注册失败！", 0xE12E2E)
        }
        screen.regResult(ret)
        driver.face.mode(0)
        driver.face.status(false)
        lock = false
        beginReg = false
        return
    }
    if (lock) {
        return
    }
    if (data.source == "real-time") {
        driver.alsa.ttsPlay("检测到人脸")
        screen.popNote("请保持不动，2秒后自动注册！")
        lock = true
        os.setTimeout(() => {
            beginReg = true
        }, 2000);
    } else if (data.source == "picture") {
        // TODO,照片注册,未实现
    }
}


export default intercept