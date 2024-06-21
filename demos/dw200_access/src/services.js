import log from '../dxmodules/dxLogger.js'
import std from '../dxmodules/dxStd.js'
import queueCenter from './queueCenter.js'
import mqttService from './service/mqttService.js'
import uartBleService from './service/uartBleService.js'
import accessService from './service/accessService.js'
import gpioKeyService from './service/gpioKeyService.js'
import nfcService from './service/nfcService.js'
import codeService from './service/codeService.js'
import driver from './driver.js'
import * as os from "os"

// 当前线程号
let threadNum
let service = {}

function run() {
    Object.assign(service, mqttService);
    Object.assign(service, uartBleService);
    Object.assign(service, accessService);
    Object.assign(service, gpioKeyService);
    Object.assign(service, nfcService);
    Object.assign(service, codeService);

    while (true) {
        try {
            // 允许300秒喂狗一次
            driver.watchdog.feed("service" + threadNum, 300)
            let raw = queueCenter.pop()
            if (raw == undefined || raw == null) {
                continue
            } else {
                //log.info("线程 " + threadNum + " 抢到事件:" + raw.topic)
                if (service[raw.topic]) {
                    service[raw.topic](raw.data)
                } else {
                    log.error("未实现该事件:" + raw.topic)
                }
                queueCenter.finish(raw.topic)
            }
        } catch (error) {
            log.error(error, error.stack)
        }
        std.sleep(10)
    }
}

os.Worker.parent.onmessage = (e) => {
    threadNum = e.data
    try {
        run()
    } catch (error) {
        log.error(error, error.stack)
    }
}