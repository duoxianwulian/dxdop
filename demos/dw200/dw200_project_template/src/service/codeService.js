import logger from "../../dxmodules/dxLogger.js"
import bus from "../../dxmodules/dxEventBus.js"
import dxCommon from "../../dxmodules/dxCommon.js"
const codeService = {}

/**
 * 处理扫码动作
 * @param {object} data 扫码文本
 */
codeService.code = function (data) {
    let dataHex = Array.from(new Uint8Array(data))
    let qrCode = dxCommon.utf8HexToStr(dxCommon.arrToHex(dataHex))
    logger.info("Code : " + JSON.stringify(qrCode))
    bus.fire('code', qrCode)
}

export default codeService
