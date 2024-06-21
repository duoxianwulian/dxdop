import log from '../dxmodules/dxLogger.js'
import std from '../dxmodules/dxStd.js'
import queueCenter from './queueCenter.js'
import driver from './driver.js'
import dxNet from '../dxmodules/dxNet.js'
import dxCode from '../dxmodules/dxCode.js'
import dxNfc from '../dxmodules/dxNfc.js'
import dxGpioKey from '../dxmodules/dxGpioKey.js'
import dxMqtt from '../dxmodules/dxMqtt.js'
import dxUart from '../dxmodules/dxUart.js'
import center from '../dxmodules/dxEventCenter.js'
import config from '../dxmodules/dxConfig.js'

function run() {
    // driver初始化center事务相关组件
    driver.initService()

    center.on(dxMqtt.CONNECTED_CHANGED + driver.mqtt.id, function (data) {
        driver.mqtt.connect(data)
    }, 'service')
    center.on(dxNet.STATUS_CHANGE, function (data) {
        driver.screen.netStatusChange(data)
    }, 'service')
    center.on(dxCode.CODE_CONTENT, function (data) {
        queueCenter.push("code", data);
    }, 'service')
    center.on(dxNfc.RECEIVE_MSG + driver.nfc.options.id, function (data) {
        queueCenter.push("nfc", data);
    }, 'service')
    center.on(dxGpioKey.RECEIVE_MSG, function (data) {
        queueCenter.push("key" + data.code, data);
    }, 'service')
    center.on(dxMqtt.RECEIVE_MSG + driver.mqtt.id, function (data) {
        let payload = JSON.parse(data.payload)
        if (payload.uuid != config.get('sysInfo.sn')) {
            log.error('uuid校验失败')
            return
        }
        queueCenter.push(data.topic.match(/[^/]+$/)[0], data);
    }, 'service')
    center.on(dxUart.VG.RECEIVE_MSG + driver.uartBle.id, function (data) {
        queueCenter.push("cmd" + data.cmd, data);
    }, 'service')

    while (true) {
        try {
            // 允许300秒喂狗一次
            driver.watchdog.feed("controller", 300)
            // 监听center事务
            center.getEvent()
            // 监听事务相关组件队列，和wpc相关方法
            driver.loop()
        } catch (error) {
            log.error(error, error.stack)
        }
        std.sleep(1)
    }
}

try {
    run()
} catch (error) {
    log.error(error, error.stack)
}
