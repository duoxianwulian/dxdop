
import * as os from "os";
import log from '../dxmodules/dxLogger.js'
import utils from './common/utils/utils.js'
const server = {}

// controller线程对象，注意：线程对象不销毁，线程一直保持运行状态
let con_worker
// 空闲线程池，记录线程对象
let idleWorkers = []
// 忙碌线程，记录正在执行的topic和线程对象的映射，且记录时间戳
let busyWorkers = {}
// 等待队列，存储即将分发给service的消息
let waitQueue = []

/**
 * 启动server服务
 * @param {string} controllerWorker controller线程地址，必填
 * @param {string} serviceWorker service线程地址，必填
 * @param {function} intercept 线程数据拦截规则，非必填，返回true则拦截成功
 * @param {number} serviceNum service线程数量，非必填（缺省3）
 */
server.run = function (controllerWorker, serviceWorker, intercept, serviceNum = 3) {
    log.info("[server.run]: 启动server服务...")
    try {
        // 创建一个controller线程
        con_worker = new os.Worker(controllerWorker);
        // 创建controller监听
        con_worker.onmessage = function (e) {
            // 对线程数据进行拦截
            if (intercept && intercept(e.data)) {
                return
            }
            // 把将要给service的消息先放到等待队列
            waitQueue.push(e)
        }
        // 创建多个service线程
        for (let i = 0; i < serviceNum; i++) {
            let ser_worker = new os.Worker(serviceWorker)
            idleWorkers.push(ser_worker)
            // 创建service监听
            ser_worker.onmessage = function (e) {
                // 对线程数据进行拦截
                if (intercept && intercept(e.data)) {
                    return
                }
                let worker = busyWorkers[e.data.finish].worker
                if (!worker) {
                    log.error(e.data.finish, "任务不存在，不需要finish")
                    return
                }
                // log.info(e.data.finish, "执行完毕")
                // 将线程放回空闲线程池中
                idleWorkers.push(worker)
                delete busyWorkers[e.data.finish]
            }
        }
        // 处理等待队列
        let queueTimer = utils.setInterval(() => {
            if (!idleWorkers) {
                utils.clearInterval(queueTimer)
                return
            }
            // 判断是否有消息需要分发
            if (waitQueue.length == 0) {
                return
            }
            for (let i = 0; i < waitQueue.length; i++) {
                const event = waitQueue[i];
                if (busyWorkers[event.data.topic]) {
                    log.error(event.data.topic, "同类型的任务正在执行，等待中...")
                    return
                }
                // 判断空闲线程
                if (idleWorkers.length == 0) {
                    log.error("当前无空闲service线程，等待中...")
                    return
                }
                let idleWorker = idleWorkers.shift()
                log.info("[server.run] 处理来自controller的任务:", JSON.stringify(event.data))
                busyWorkers[event.data.topic] = { worker: idleWorker, time: new Date().getTime() }
                idleWorker.postMessage(event.data)
                // 删除消息
                waitQueue.splice(i, 1);
            }

        }, 1000, true)
        // 处理超时消息
        let timeoutTimer = utils.setInterval(() => {
            if (!idleWorkers) {
                utils.clearInterval(timeoutTimer)
                return
            }
            for (const topic in busyWorkers) {
                const time = busyWorkers[topic].time;
                let timeout = new Date().getTime() - time
                if (timeout > 10000) {
                    // service处理超时10秒
                    log.error("service执行超时 " + timeout + " ms，请检查方法：", topic)
                }
            }
        }, 1000, true)
    } catch (error) {
        log.error(error, error.stack)
    }
}

/**
 * 子线程发送数据给父线程
 * @param {any} data 
 */
server.send = function (data) {
    try {
        let parent = os.Worker.parent;
        if (!parent) {
            log.error("server.send can only be used in workers!")
        }
        parent.postMessage(data)
    } catch (error) {
        log.error(error, error.stack)
    }
}

/**
 * 子线程监听父线程数据
 * @param {function} callback 
 */
server.listener = function (callback) {
    try {
        let parent = os.Worker.parent;
        if (!parent) {
            log.error("server.listener can only be used in workers!")
        }
        parent.onmessage = function (e) {
            // { topic: topic, data: data }
            callback(e.data)
        }
    } catch (error) {
        log.error(error, error.stack)
    }
}

/**
 * controller线程使用，分发topic事件
 * @param {string} topic 
 * @param {string} data 
 */
server.execute = function (topic, data) {
    server.send({ topic: topic, data: data })
}

/**
 * service线程使用，每个topic执行完需要调用finish释放service线程
 * @param {string} topic 
 */
server.finish = function (topic) {
    server.send({ finish: topic })
}

/**
 * 停止server服务，结束所有子线程
 */
server.exit = function () {
    log.info("停止server服务...")
    // 销毁所有线程和数据
    con_worker = undefined
    idleWorkers = undefined
    busyWorkers = undefined
}

export default server