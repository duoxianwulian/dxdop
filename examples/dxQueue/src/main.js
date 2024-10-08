import queue from '../dxmodules/dxQueue.js'
import std from '../dxmodules/dxStd.js'
import logger from '../dxmodules/dxLogger.js'

// 获取一个队列
const queue1 = queue.get("event___center")

std.setInterval(() => {
    // push数据到队列
    queue1.push("123456")
    // 打印队列长度
    logger.info(queue1.size());
    // pop队列获取数据
    logger.info(queue1.pop());// 123456
}, 1000)
