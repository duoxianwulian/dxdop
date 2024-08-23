import logger from '../../dxmodules/dxLogger.js'
import driver from '../driver.js'
const uart485Service = {}


uart485Service.receive = function (data) {
    logger.info("uart485 : " + JSON.stringify(data))
    driver.alsa.play("/app/code/resource/wav/welcome.wav")
}

export default uart485Service
