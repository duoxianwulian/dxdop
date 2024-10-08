import gpioKey from '../dxmodules/dxGpioKey.js'
import logger from '../dxmodules/dxLogger.js'
import std from '../dxmodules/dxStd.js'


//初始化 gpioKey
let res = gpioKey.init()
logger.info('gpioKey初始化:', res)
std.setInterval(() => {
    if (!gpioKey.msgIsEmpty()) {
        let res = gpioKey.msgReceive();
        logger.info('监听到gpioKey数据:',JSON.stringify(res))
       
    }
}, 20)

