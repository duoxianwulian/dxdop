//build:20240228
//事件中心，用于处理线程之间发送事件通知。
//比较适合用于一个线程不断的获取数据，但是处理需要耗时，为了避免影响获取实时的数据，所以把数据以事件的方式发送到其它线程去处理
//组件依赖 dxMap,dxLogger,dxCommon,dxQueue
import dxMap from './dxMap.js'
import dxQueue from './dxQueue.js'
import * as os from "os";
import logger from './dxLogger.js'
//-------------------------variable--------------------
const queue = dxQueue.get("event___center")
const center = {}
const map = dxMap.get("event___center")
/**
 * 事件中心初始化，必须在主线程main.js里发起初始化
 */
center.init = function () {
    let inited = map.get("__init")
    if (!inited) {//确保只初始化一次
        new os.Worker('./eventCenterWorker.js')
        map.put("__init", "inited")
    }
}
center.queue = queue
/**
 * 轮询获取订阅的事件，如果收到事件会自动执行通过on函数订阅事件的回调函数
 */
center.getEvent = function () {
    let subs = Object.keys(this.handlers)
    if (subs.length === 0) {
        return
    }
    let keys = map.keys()
    for (var k of keys) {
        if (subs.includes(k)) {//判断有没有自己订阅的事件
            let event = map.get(k)
            if (this.handlers[k]) {
                try {
                    this.handlers[k](event.data)
                } catch (error) {
                    logger.error('center get event and handle fail' + error + error.stack);
                }
                map.del(k);//消费后就删除
            }
        }
    }
}


/**
 * 触发一个事件，这个事件会加到队列里，不会马上处理，由center来统一调度
 * 同样一个事件可以有多个订阅者，可以同时通知多个订阅者，同一个topic单位时间内只处理一个事件，
 * 只有当前topic被所有的订阅者处理完之后才允许处理同一topic下一个事件
 * 
 * @param {string} topic 事件的标识、主题 
 * @param {*} data 事件附带的数据
 * @param {number} timeout 事件多久没有处理就自动清除，可以不传，缺省是30秒
 */
center.fire = function (topic, data, timeout) {
    if (!topic || (typeof topic) != 'string') {
        throw new Error("The 'topic' should not be null");
    }
    if (timeout && (typeof timeout) != 'number') {
        throw new Error("The 'timeout' should not be timeout");
    }
    let now = new Date().getTime();
    let event = { topic: topic, data: data, timeout: now + (timeout ? timeout * 1000 : 30 * 1000) };
    queue.push(JSON.stringify(event))
}



center.handlers = {}
/**
 * 订阅一个事件，和常规的eventbus不同，需要传递一个flag作为订阅者的标识,同样的主题多个地方订阅一定要确保flag不同
 * @param {string} topic 事件的标识、主题 ，必填
 * @param {function} callback 事件处理的回调函数，必填
 * @param {string} flag 订阅者的标识，必填不能为空
 */
center.on = function (topic, callback, flag) {
    if (!topic || (typeof topic) != 'string') {
        throw new Error("The 'topic' should not be null");
    }
    if (!callback || (typeof callback) != 'function') {
        throw new Error("The 'callback' should be a function");
    }
    if (!flag || (typeof flag) != 'string') {
        throw new Error("The 'flag' parameter must be a non-empty string");
    }
    let topicFlag = topic + '___' + flag
    map.put('subs__' + topicFlag, flag)
    this.handlers["current__event__" + topicFlag] = callback
}

export default center
