import logger from "../../dxmodules/dxLogger.js"
import bus from "../../dxmodules/dxEventBus.js"
const cardService = {}

/**
 * 处理刷卡动作
 * @param {object} data 卡片信息
 */
cardService.nfc = function (data) {
    logger.info("Card : " + JSON.stringify(data))
    bus.fire('nfc', data)
}

export default cardService
