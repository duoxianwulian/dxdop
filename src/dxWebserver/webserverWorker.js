//build:20240524
//用于简化webserver组件的使用，把webserver封装在这个worker里，使用者只需要订阅eventcenter的事件就可以监听webserver
import log from './dxLogger.js'
import webserver from './dxWebserver.js'
import dxMap from './dxMap.js'
import center from './dxEventCenter.js'
import * as os from "os";
const map = dxMap.get('default')
const id = "{{id}}"
const options = map.get("__webserver__run_init" + id)

function run() {
    webserver.init(options.port, options.index, options.id)
    for (let i = 0; i < options.urls.length; i++) {
        const url = options.urls[i];
        // 注册接口
        webserver.rgisterCallback(url, options.id)
    }
    log.info('webserver start......,id =', options.id)
    while (true) {
        try {
            webserver.mongoosePoll(1000)
            if (!webserver.msgIsEmpty()) {
                let data = webserver.msgReceive()
                center.fire(webserver.RECEIVE_MSG + options.id, data)
            }
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