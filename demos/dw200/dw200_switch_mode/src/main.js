import logger from '../dxmodules/dxLogger.js'
import code from '../dxmodules/dxCode.js'
import center from '../dxmodules/dxEventBus.js'
import common from '../dxmodules/dxCommon.js'
import std from '../dxmodules/dxStd.js'

logger.info("start...")
center.newWorker('code', '/app/code/src/codeservice.js')
center.on(code.RECEIVE_MSG, function (data) {
    let str = common.utf8HexToStr(common.arrayBufferToHexString(data))
    logger.info(str)
    if (str == 'app') {
        logger.info('switch app mode')
        common.setMode(1)
    } else if (str == 'debug') {
        logger.info('switch debug mode')
        common.setMode(2)
    }
})

std.setInterval(() => {

}, 5)


