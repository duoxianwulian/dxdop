import * as os from "os";
import logger from '../dxmodules/dxLogger.js'
import center from '../dxmodules/dxEventCenter.js'
function callback(data) {
    logger.info("worker2:" + data)
}
center.on('topic_1_to_worker2', callback,'worker2')
while (true) {
    center.getEvent()
    os.sleep(10)
}