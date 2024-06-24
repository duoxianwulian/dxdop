import log from '../dxmodules/dxLogger.js'
import std from '../dxmodules/dxStd.js'
import center from '../dxmodules/dxEventCenter.js'
import mainview from './view/mainview.js'
import driver from './driver.js'
import config from '../dxmodules/dxConfig.js'
import common from '../dxmodules/dxCommon.js'
(function () {//init
    config.init()
    center.init()
    driver.initMain()
    std.Worker('/app/code/src/service.js')
    mainview.init()
})();

std.setInterval(() => {
    try {
        common.logMem(log)
        center.getEvent()
        mainview.loop()
        driver.watchdog.loop()
        std.sleep(5)
    } catch (err) {
        log.error(err)
    }
}, 5)