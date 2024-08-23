import logger from '../dxmodules/dxLogger.js'
import bus from '../dxmodules/dxEventBus.js'
import std from '../dxmodules/dxStd.js'
import pool from '../dxmodules/dxWorkerPool.js'
import screen from './screen.js'
import driver from './driver.js'
import dxCode from '../dxmodules/dxCode.js'
import dxNfc from '../dxmodules/dxNfc.js'
import dxNet from '../dxmodules/dxNet.js'
import dxUart from '../dxmodules/dxUart.js'

let topics = [dxCode.RECEIVE_MSG, dxNfc.RECEIVE_MSG, dxUart.VG.RECEIVE_MSG, dxNet.STATUS_CHANGE]

function initController() {
    driver.gpio.init()
    driver.alsa.init()
    driver.nfc.init()
    driver.code.init()
    driver.uart485.init()
    driver.net.init()
}

(function () {

    screen.init()

    initController()

    bus.newWorker('controller', '/app/code/src/controller.js')
    
    pool.init('/app/code/src/services.js', bus, topics, 3, 100)
    
    const appVersion = 'dw200_project_template_1.0.0'
    logger.info("=================== version:" + appVersion + " ====================")
    logger.info("欢迎使用！！！")
})();


std.setInterval(() => {
    screen.loop()
}, 5)




