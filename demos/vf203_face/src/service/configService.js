import utils from '../common/utils/utils.js'
import config from '../../dxmodules/dxConfig.js'
const configService = {}
// 匹配以点分十进制形式表示的 IP 地址，例如：192.168.0.1。
const ipCheck = v => /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v)
//正整数
const regpCheck = v => /^[1-9]\d*$/.test(v)
//非负整数
const regnCheck = v => /^([1-9]\d*|0{1})$/.test(v)
/**
 * 所有支持的配置项的检验规则以及设置成功后的回调
 * rule：校验规则，返回true校验成功，false校验失败
 * callback：配置修改触发回调
 */
const supported = {
    netInfo: {
        // 1:动态,0:静态
        dhcp: { rule: v => [0, 1].includes(v) },
        ip: { rule: ipCheck },
        gateway: { rule: ipCheck },
        dns: { rule: v => !v.split(",").some(ip => !ipCheck(ip)) },
        subnetMask: { rule: ipCheck },
        netMac: { rule: v => typeof v == 'string' },
        // 0：关闭 1：间隔同步
        ntp: { rule: v => [0, 1].includes(v) },
        ntpAddr: { rule: v => typeof v == 'string' },
        ntpInterval: { rule: regpCheck },
    },
    mqttInfo: {
        mqttAddr: { rule: ipCheck },
        clientId: { rule: v => typeof v == 'string' },
        mqttName: { rule: v => typeof v == 'string' },
        password: { rule: v => typeof v == 'string' },
        qos: { rule: v => [0, 1, 2].includes(v) },
        prefix: { rule: v => typeof v == 'string' },
    },
    uiInfo: {
        rotation: { rule: v => [0, 1, 2, 3].includes(v) },
        statusBar: { rule: v => [0, 1].includes(v) },
        horBgImage: { rule: v => typeof v == 'string' },
        verBgImage: { rule: v => typeof v == 'string' },
        //sn是否隐藏 1 显示 0 隐藏
        sn_show: { rule: v => [0, 1].includes(v) },
        //ip是否隐藏 1 显示 0 隐藏
        ip_show: { rule: v => [0, 1].includes(v) },
    },
    doorInfo: {
        openMode: { rule: v => [0, 1, 2].includes(v) },
        openTime: { rule: regpCheck },
        openTimeout: { rule: regpCheck },
        onlinecheck: { rule: v => [0, 1].includes(v) },
        timeout: { rule: regpCheck },
        offlineAccessNum: { rule: regpCheck },
    },
    sysInfo: {
        //语音音量
        appVersion :{rule: v => typeof v == 'string'},
        volume: { rule: regnCheck },
        heart_time: { rule: regpCheck },
        heart_en: { rule: v => [0, 1].includes(v) },
        heart_data: { rule: v => typeof v == 'string' },
    }
}
// 需要重启的配置
const needReboot = ["netInfo", "mqttInfo",
    "sysInfo.volume", "sysInfo.heart_time", "sysInfo.heart_en"]
configService.needReboot = needReboot

/**
 * 配置json校验并保存
 * @param {object} data 配置json对象
 * @returns true(校验并保存成功)/string(错误信息)
 */
configService.configVerifyAndSave = function (data) {
    let isReboot = false
    for (const key in data) {
        if (!supported[key]) {
            return key + " not supported"
        }
        const item = data[key];
        if (typeof item != 'object') {
            // 必须是一个组
            continue
        }
        if (needReboot.includes(key)) {
            isReboot = true
        }
        for (const subKey in item) {
            let option = supported[key][subKey]
            if (utils.isEmpty(option)) {
                return subKey + " not supported"
            }
            const value = item[subKey];
            if (needReboot.includes(key + "." + subKey)) {
                isReboot = true
            }
            if (!option.rule || option.rule(value)) {
                // 没有校验规则默认校验通过
                config.set(key + "." + subKey, value)
                if (option.callback) {
                    // 执行配置设置回调
                    option.callback(value)
                }
            } else {
                return value + " check failure"
            }
        }
    }
    config.save()
    // 检查需要重启的配置，3秒后重启
    if (isReboot) {
        common.asyncReboot(3)
    }
    return true
}
export default configService