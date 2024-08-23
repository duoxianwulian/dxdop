import logger from '../../dxmodules/dxLogger.js'
import driver from '../driver.js'
import * as os from "os"
const uart485Service = {}


uart485Service.receive = function (data) {
    logger.info("uart485 : " + JSON.stringify(data))
    driver.gpio.setValue(driver.gpio.RELAY1, 1)
    driver.gpio.setValue(driver.gpio.RELAY2, 1)
    driver.gpio.setValue(driver.gpio.RELAY3, 1)
    driver.gpio.setValue(driver.gpio.RELAY4, 1)
    driver.gpio.setValue(driver.gpio.CARD_LED, 1)
    driver.gpio.setValue(driver.gpio.WORK_LED, 1)
    driver.gpio.setValue(driver.gpio.NET_LED, 1)
    os.sleep(2000)
    driver.gpio.setValue(driver.gpio.RELAY1, 0)
    driver.gpio.setValue(driver.gpio.RELAY2, 0)
    driver.gpio.setValue(driver.gpio.RELAY3, 0)
    driver.gpio.setValue(driver.gpio.RELAY4, 0)
    driver.gpio.setValue(driver.gpio.CARD_LED, 0)
    driver.gpio.setValue(driver.gpio.WORK_LED, 0)
    driver.gpio.setValue(driver.gpio.NET_LED, 0)
}

export default uart485Service
