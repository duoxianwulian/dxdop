import utils from './common/utils/utils.js'
import server from './server.js'
import driver from './driver.js'
import center from '../dxmodules/dxEventCenter.js'
import net from '../dxmodules/dxNet.js'
import log from '../dxmodules/dxLogger.js'
import mqtt from '../dxmodules/dxMqtt.js'
import face from '../dxmodules/dxFace.js'

// 网络
center.on(net.STATUS_CHANGE, function (data) {
    // {"type":1,"status":4,"connected":true}
    // log.debug(data)
    server.execute("netStatus", data)
}, "service")

// mqtt接收消息
center.on(mqtt.RECEIVE_MSG, function (data) {
    // {"topic":"ddddd","payload":"{\n  \"msg\": \"world\"\n}"}
    // log.debug(data)
    server.execute(data.topic.match(/[^/]+$/)[0], data)
}, "service")

// mqtt连接状态变化
center.on(mqtt.CONNECTED_CHANGED, function (data) {
    // connected
    // log.debug(data)
    server.execute("mqttStatus", data)
    if (data == "connected") {
        // mqtt连接上报
        server.execute("report", null)
    }
}, "service")

// 
center.on(face.RECEIVE_MSG, function (data) {
    // {"status":"track","action":"update","color":"16776960","rect_smooth":["0","376","348","858"]}
    // log.debug(JSON.stringify(data))
    server.execute(data.status, data)
}, "service")

utils.setInterval(() => {
    driver.loop()
    center.getEvent()
}, 10)
