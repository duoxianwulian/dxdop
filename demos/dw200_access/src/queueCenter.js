import dxQueue from '../dxmodules/dxQueue.js'
import dxMap from '../dxmodules/dxMap.js'
import log from '../dxmodules/dxLogger.js'

const queueCenter = {}
// 获取服务线程队列，队列内容是形如{ topic: topic, data: data }的JSON字符串
const queue = dxQueue.get("__SERVICE_THREAD_QUEUE");
// map中key为事件类型，即topic，value是"Y"
const map = dxMap.get("__SERVICE_THREAD_MAP");

/**
 * 向队列添加事件
 * @param {*} topic 事件类型，即要执行的service方法名称，用于标记事件，防止服务线程同时执行一种类型事件
 * @param {*} data 事件数据
 */
queueCenter.push = function (topic, data) {
    queue.push(JSON.stringify({ topic: topic, data: data }))
}

// 从队列取出事件，同类型（topic）事件同步处理，非同类型事件异步处理
queueCenter.pop = function () {
    try {
        let raw = queue.pop()
        if (raw == null || raw == undefined) {
            return
        }
        let rawJson = JSON.parse(raw)
        if (map.get(rawJson.topic) == "Y") {
            // 如果取出的事件正在别的服务线程中运行，则再push回队列
            queue.push(raw)
            return
        } else {
            map.put(rawJson.topic, "Y")
            return rawJson
        }
    } catch (error) {
        log.error(error, error.stack)
    }
    return
}

// 事件完成需要通知queueCenter，使得同类型事件下次可以继续执行
queueCenter.finish = function (topic) {
    map.del(topic)
}


export default queueCenter
