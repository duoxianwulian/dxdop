import watchdog from "../dxmodules/dxWatchdog.js";
import gpio from "../dxmodules/dxGpio.js"
import std from "../dxmodules/dxStd.js"
import logger from '../dxmodules/dxLogger.js'

// id
const id = 'watchdog'

// 使用看门狗需要先初始化gpio
gpio.init()

// 开启软硬件看门狗
watchdog.open(1 | 2, id)

// 创建狗
let dog1 = 1
// 开启狗
logger.info(watchdog.enable(dog1, id));// true

// 超时时间ms，如果不喂狗，则超时自动重启
logger.info(watchdog.start(5000, id));// true

// 定时器喂狗，每秒喂一次
std.setInterval(() => {
    logger.info(watchdog.restart(dog1, id));
}, 1000)

