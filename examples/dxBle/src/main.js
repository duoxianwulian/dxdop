import std from '../dxmodules/dxStd.js'
import dxBle from '../dxmodules/dxBle.js'
import logger from '../dxmodules/dxLogger.js'
import bus from '../dxmodules/dxEventBus.js'
import common from '../dxmodules/dxCommon.js'
import * as os from "os"

let BLE_485 = "/dev/ttyS5"
let id = 'ble1'

bus.on(dxBle.VG.RECEIVE_MSG + id, function (data) {
    logger.debug(data)
    logger.debug(common.hexToString(data.data))
    
}, id)

dxBle.run({ id: id, type: 3, path: BLE_485, result: 0, bleName: "dw200A" })

os.sleep(1000)

dxBle.setBleConfig({ name: "dw200C" }, id)

let res = dxBle.getBleConfig(id)
logger.debug("bleConfig: " + JSON.stringify(res))


std.setInterval(() => {
}, 10)