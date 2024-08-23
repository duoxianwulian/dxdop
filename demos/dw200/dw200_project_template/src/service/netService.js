import logger from "../../dxmodules/dxLogger.js"
const netService = {}

/**
 * 网络状态变化
 * @param {object} data 
 */
netService.netStatusChanged = function (data) {
    logger.info("net : " + JSON.stringify(data))
}

export default netService