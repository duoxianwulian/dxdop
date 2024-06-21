//build:20240524
//用于简化mqtt组件微光通信协议的使用，把mqtt封装在这个worker里，使用者只需要订阅eventcenter的事件就可以监听mqtt
import log from './dxLogger.js'
import net from './dxNet.js'
import mqtt from './dxMqtt.js'
import dxMap from './dxMap.js'
import * as os from "os";
import center from './dxEventCenter.js'
const map = dxMap.get('default')
const id = "{{id}}"
const options = map.get("__mqtt__run_init" + id)

function run() {
    mqtt.init(options.mqttAddr, options.clientId, options.username, options.password, options.prefix, options.qos, options.willTopic, options.willMessage, options.id)
    log.info('mqtt start......,id =', id)
    while (true) {
        try {
            if (mqtt.isConnected(options.id) && net.getStatus().connected) {
                _fireChange(true)
                if (options.subs) {
                    mqtt.subscribes(options.subs, options.qos, options.id)
                }
                while (true) {
                    // 连接成功后进入消息监听
                    if (!mqtt.isConnected(options.id) || !net.getStatus().connected) {
                        // 未连接跳出循环重新连接
                        _fireChange(false)
                        break
                    }
                    if (!mqtt.msgIsEmpty()) {
                        let msg = mqtt.receive()
                        center.fire(mqtt.RECEIVE_MSG + options.id, msg)
                    }
                    os.sleep(10)
                }
            } else {
                // 重连
                mqtt.reconnect(options.willTopic, options.willMessage, options.id)
                os.sleep(1000)//重连后等待1秒
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

function _fireChange(status) {
    if (status) {
        map.put(mqtt.CONNECTED_CURRENT + options.id, 'connected')
        center.fire(mqtt.CONNECTED_CHANGED + options.id, 'connected')
    } else {
        map.put(mqtt.CONNECTED_CURRENT + options.id, 'disconnected')
        center.fire(mqtt.CONNECTED_CHANGED + options.id, 'disconnected')
    }
}
