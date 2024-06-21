//build:20240606
//用于简化face组件微光通信协议的使用，把face封装在这个worker里，使用者只需要订阅eventcenter的事件就可以监听face
import log from './dxLogger.js'
import face from './dxFace.js'
import * as os from "os";

function run() {
    face.worker.beforeLoop()
    log.info('face start......')
    while (true) {
        try {
            face.worker.loop()
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