//build:20240524
//用于简化decoder组件的使用，把decoder封装在这个worker里，使用者只需要订阅eventcenter的事件就可以监听decoder
import log from './dxLogger.js'
import decoder from './dxDecoder.js'
import dxMap from './dxMap.js'
import * as os from "os";
const map = dxMap.get('default')
const id = "{{id}}"
const options = map.get("__decoder__run_init" + id)

function run() {
    decoder.worker.beforeLoop(options)
    log.info('decoder start......,id =', options.id)
    while (true) {
        try {
            decoder.worker.loop(options)
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