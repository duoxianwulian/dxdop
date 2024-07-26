import logger from '../dxmodules/dxLogger.js'
import std from '../dxmodules/dxStd.js'
import center from '../dxmodules/dxEventCenter.js'
import config from '../dxmodules/dxConfig.js'
import screen from './screen.js'
import driver from './driver.js'
import common from '../dxmodules/dxCommon.js'


(function () {
    // 事务中心初始化
    center.init()
    // 配置文件初始化
    config.init()
    // driver初始化
    driver.init()
    // 屏幕初始化
    screen.init()
    // 启动driver服务线程
    std.Worker('/app/code/src/controller.js')
    // 启动3个服务线程
    for (let i = 0; i < 3; i++) {
        let worker = std.Worker('/app/code/src/services.js')
        worker.postMessage(1);
    }

    const appVersion = 'dw200_access_v1.3.3'
    config.set('sysInfo.appVersion', appVersion)
    // 屏幕显示版本号
    screen.showVersion(appVersion)
    logger.info("=================== version:" + appVersion + " ====================")
})();
let start = new Date().getTime()
let startTime = new Date().getTime()
let minMem = common.getFreemem()
let maxMem = common.getFreemem()
while (true) {
    // let log = "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    // minMem = minMem > common.getFreemem() ? common.getFreemem() : minMem
    // maxMem = maxMem < common.getFreemem() ? common.getFreemem() : maxMem
    // log += "当前剩余内存：" + ((common.getFreemem()) / 1024) + "k(" + common.getFreemem() + ")" + "\tminMem：" + ((minMem) / 1024) + "k" + "\tmaxMem：" + ((maxMem) / 1024) + "k"
    // log += "\n经过的时间：" + ((new Date().getTime() - start) / 1000) + "秒"
    // if (new Date().getTime() - startTime >= 10000) {
    //     startTime = new Date().getTime()
    //     // common.systemBrief("free")
    //     logger.info(log);
    // }


    driver.watchdog.loop()
    if (screen.loop() < 0) {
        break
    }
    std.sleep(1)
}