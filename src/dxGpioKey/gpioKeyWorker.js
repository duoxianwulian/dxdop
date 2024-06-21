//build:20240524
//用于简化gpioKey组件微光通信协议的使用，把gpioKey封装在这个worker里，使用者只需要订阅eventcenter的事件就可以监听gpioKey
import log from './dxLogger.js'
import gpioKey from './dxGpioKey.js'
import * as os from "os";

function run() {
    gpioKey.worker.beforeLoop()
    log.info('gpioKey start......')
    while (true) {
        try {
            gpioKey.worker.loop()
        } catch (error) {
            log.error(error, error.stack)
        }
        os.sleep(10)
    }
}

try {
    run()
} catch (error) {
    log.error(error, error.stack)
}