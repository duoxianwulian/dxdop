import log from '../dxmodules/dxLogger.js'
import driver from './driver.js'
import std from '../dxmodules/dxStd.js'
import center from '../dxmodules/dxEventCenter.js'
import mqtthandler from './mqtthandler.js'
import codehandler from './codehandler.js'
const worker = 'service'
function run() {
    driver.initService()
    driver.mqtt.on(center, worker, function (data) { mqtthandler.invoke(data) })
    driver.code.on(center, worker, function (data) { codehandler.invoke(data) })
    
    std.setInterval(() => {
        try {
            driver.loop(center)
            center.getEvent()
            driver.watchdog.feed(worker, 30)
        } catch (error) {
            log.error(error)
        }
    }, 10)
}


try {
    run()
} catch (error) {
    log.error(error)
}