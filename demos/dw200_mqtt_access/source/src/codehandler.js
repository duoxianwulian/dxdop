//扫描结果处理
import logger from '../dxmodules/dxLogger.js'
import driver from './driver.js'
import config from '../dxmodules/dxConfig.js'
import common from '../dxmodules/dxCommon.js'
import std from '../dxmodules/dxStd.js'
import mqtt from './mqtthandler.js'
const vg = {}
vg.invoke = function (pack) {
    if (!pack || pack.length < 0) {
        return
    }
    driver.pwm.press()
    logger.info('code: ', pack)
    if (pack.startsWith('___VBAR_CONFIG_V1.1.0___')) {
        try {
            setConfig(pack)
        } catch (error) {
            logger.error(error)
            driver.pwm.fail()
        }
        return
    }
    driver.pwm.success()
    mqtt.accessOnline('code', pack)// 透传
}
function setConfig(pack) {//扫描配置
    const start = '___VBAR_CONFIG_V1.1.0___'.length
    const end = pack.indexOf('--')
    pack = pack.substring(start, end).replaceAll('=', ':')
    const obj = std.parseExtJSON(pack)
    if (obj.hasOwnProperty('update_flag') || obj.hasOwnProperty('update_flg')) {//升级的单独线程处理
        std.setTimeout(function(){
            driver.ota.update(obj)
        },10)
        return
    }
    //只要一次需要重启就不会变化
    const results = []
    results.push(applyConfig(obj, 'net.', ['ip_mode', 'net_type', 'macaddr', 'ip', 'mask', 'gateway', 'dns'], true))
    results.push(applyConfig(obj, 'sys.', ['sn_show', 'ver_show', 'boot_music', 'devname', 'volume', 'net_show','ntpgmt'], true))
    results.push(applyConfig(obj, 'mqtt.', ['mqttaddr', 'mqttusername', 'mqttpassword'], true))
    const reboot = results.reduce((acc, cur) => acc || cur, false)//只需要有一个结果是true，就需要重启
    driver.pwm.success()
    if (reboot) {
        common.asyncReboot(2)
    }
}
function applyConfig(obj, pre, items, isReboot) {
    let reboot = false;
    for (const item of items) {
        if (obj.hasOwnProperty(item)) {
            config.setAndSave(pre + item, obj[item])
            reboot = true;
        }
    }
    return isReboot ? reboot : false;//有一些无需考虑重启，直接返回false
}
export default vg