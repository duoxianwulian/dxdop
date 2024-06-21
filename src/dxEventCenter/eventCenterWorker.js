//build:20240228
//事件处理线程，由这个线程来轮询处理相应的事件
import dxMap from './dxMap.js'
import dxQueue from './dxQueue.js'
import * as os from "os";
import logger from './dxLogger.js'

//-------------------------variable--------------------
const queue = dxQueue.get("event___center")
const all = {} //缓存还未处理过的事件
const map = dxMap.get("event___center")
//-------------------------function--------------------
function run() {
    while (true) {
        if (queue.size() > 0) {
            let event = queue.pop()
            if (event) {
                //1. 先从队列里取出一个缓存到all
                cacheEvent(event)
            }
        }
        //2. 遍历清除超时的event,并得到所有当前事件和当前订阅者
        const { current, subs } = clearEvents()
        //3. 遍历all所有的topic，判断map里有对应topic的没有，有就添加到map里
        handleEvents(current, subs)
        os.sleep(10)
    }
}
function cacheEvent(event) {
    const eventJson = JSON.parse(event)
    const topic = eventJson.topic;
    if (!all[topic]) {
        all[topic] = [];
    }
    all[topic].push(eventJson)
}

function clearEvents() {
    const keys = map.keys()
    let current = {}//按topic分的当前事件
    let subs = {}//按topic分的所有订阅者
    for (let k of keys) {
        let pre = 'subs__'
        if (k.startsWith(pre)) {
            const { topic, flag } = getTopicFromKey(k, pre)
            subs[topic] = subs[topic] || []
            subs[topic].push(flag)
        }
        pre = 'current__event__'
        if (k.startsWith(pre)) {
            let v = map.get(k)
            if (v === undefined || v === null) {
                //多线程问题，获取keys的时候这个key还存在，执行到这里的时候key已经被删除了，所以v有可能为null
                continue
            }
            if (timeout(v)) {
                map.del(k)
            } else {
                const { topic, flag } = getTopicFromKey(k, pre)
                current[topic] = ' ';//只需要记录一个空值，主要用key来判断
            }
        }
    }
    return { current, subs }
}

function handleEvents(current, subs) {
    const topics = Object.keys(all)
    for (let topic of topics) {
        let events = all[topic];
        if (events.length > 0) {
            let subscribers = subs[topic];
            if (!subscribers) {//没有订阅者则直接删除
                events.splice(0, 1)
            } else {
                if (!current[topic]) {//只有当前topic被所有的订阅者处理完之后才允许处理下一个topic
                    for (let i = 0; i < subscribers.length; i++) {
                        // 复制出生成多个事件,给每个订阅者发送一个独立的事件
                        let temp = "current__event__" + topic + '___' + subscribers[i];
                        map.put(temp, events[0])
                    }
                    events.splice(0, 1)
                }
            }
        }
    }
}
function getTopicFromKey(key, prefix) {
    const start = prefix.length;
    const end = key.indexOf('___', start)
    const topic = key.substring(start, end)
    const flag = key.substring(end + 3)
    return { topic, flag }
}
function timeout(event) {
    let interval = new Date().getTime() - event.timeout;
    //有一种特殊情况，就是缺省时间是1970，突然矫正时间到当前时间，这个时候event会被误删除
    if (interval > 0 && interval < 1608025702) {
        logger.error("event time out:" + JSON.stringify(event))
        return true; // 事件超时，处理完成
    }
    return false; // 事件未超时或未处理
}
run()