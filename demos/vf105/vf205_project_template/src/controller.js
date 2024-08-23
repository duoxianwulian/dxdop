import logger from '../dxmodules/dxLogger.js'
import std from '../dxmodules/dxStd.js'
import driver from './driver.js'


function run() {
    std.setInterval(() => {
        try {
            loop()
        } catch (error) {
            logger.error(error)
        }
    }, 5)
}


try {
    run()
} catch (error) {
    logger.error(error)
}


function loop() {
    driver.net.loop()
    driver.face.loop()
}