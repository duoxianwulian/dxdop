import log from '../../dxmodules/dxLogger.js'
import queueCenter from '../queueCenter.js'
const nfcService = {}
nfcService.nfc = function (data) {
    // log.info('[nfcService] nfc :' + JSON.stringify(data))
    queueCenter.push("access", { type: 200, code: data.id });
}
export default nfcService
