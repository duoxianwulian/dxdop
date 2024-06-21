import log from '../../dxmodules/dxLogger.js'
import config from '../../dxmodules/dxConfig.js'
import dxNet from '../../dxmodules/dxNet.js'
import queueCenter from '../queueCenter.js'
import driver from '../driver.js'
import utils from '../common/utils/utils.js'
import common from '../../dxmodules/dxCommon.js'
import std from '../../dxmodules/dxStd.js'
import sqliteService from "./sqliteService.js";
import dxMap from '../../dxmodules/dxMap.js'
let sqliteFuncs = sqliteService.getFunction()

const mqttService = {}

// 配置查询
mqttService.getConfig = function (raw) {
    log.info("{mqttService} [getConfig] req:" + JSON.stringify(raw))
    let data = JSON.parse(raw.payload).data
    let configAll = config.getAll()
    let res = {}
    // 配置分组
    for (const key in configAll) {
        const value = configAll[key];
        const keys = key.split(".")
        if (keys.length == 2) {
            if (!res[keys[0]]) {
                res[keys[0]] = {}
            }
            res[keys[0]][keys[1]] = value
        } else {
            res[keys[0]] = value
        }
    }
    // 查询蓝牙配置
    let bleInfo = driver.uartBle.getConfig()
    res["bleInfo"] = bleInfo

    if (utils.isEmpty(data) || typeof data != "string") {
        // 查询全部
        reply(raw, res)
        return
    }
    let keys = data.split(".")
    let search = {}
    if (keys.length == 2) {
        if (res[keys[0]]) {
            search[keys[0]] = {}
            search[keys[0]][keys[1]] = res[keys[0]][keys[1]]
        }
    } else {
        search[keys[0]] = res[keys[0]]
    }
    reply(raw, search)
}

// 配置修改
mqttService.setConfig = function (raw) {
    log.info("{mqttService} [setConfig] req:" + JSON.stringify(raw))
    let data = JSON.parse(raw.payload).data
    if (!data || typeof data != 'object') {
        reply(raw, "data should not be empty", CODE.E_100)
        return
    }
    let res = mqttService.configVerifyAndSave(data)
    if (typeof res != 'boolean') {
        reply(raw, res, CODE.E_100)
        return
    }
    if (res) {
        reply(raw)
    } else {
        reply(raw, "unknown failure", CODE.E_100)
        return
    }
}

// 查询权限
mqttService.getPermission = function (raw) {
    log.info("{mqttService} [getPermission] req:" + JSON.stringify(raw))
    let data = JSON.parse(raw.payload).data
    if (!data || typeof data != 'object') {
        reply(raw, "data should not be empty", CODE.E_100)
        return
    }
    if (typeof data.page != 'number') {
        data.page = 0
    }
    if (typeof data.size != 'number' || data.size > 200) {
        data.size = 10
    }
    try {
        let res = sqliteFuncs.permissionFindAll(data.page, data.size, data.code, data.type, data.id);
        reply(raw, res)
    } catch (error) {
        log.error(error, error.stack)
        reply(raw, error, CODE.E_100)
        return
    }
}

// 添加权限
mqttService.insertPermission = function (raw) {
    log.info("{mqttService} [insertPermission] req:" + JSON.stringify(raw))
    let data = JSON.parse(raw.payload).data
    if (!Array.isArray(data)) {
        reply(raw, "data shoulde be an array", CODE.E_100)
        return
    }
    // 校验
    for (let i = 0; i < data.length; i++) {
        let record = data[i];
        if (utils.isEmpty(record.id) || utils.isEmpty(record.type) || utils.isEmpty(record.code) || typeof record.time != 'object') {
            reply(raw, "id,type,code,time shoulde not be empty", CODE.E_100)
            return
        }
        if (![0, 1, 2, 3].includes(record.time.type)) {
            reply(raw, "time's type is not supported", CODE.E_100)
            return
        }
        if (record.time.type != 0 && (typeof record.time.range != 'object' || typeof record.time.range.beginTime != 'number' || typeof record.time.range.endTime != 'number')) {
            reply(raw, "time's range format error", CODE.E_100)
            return
        }
        if (record.time.type == 2 && (typeof record.time.beginTime != 'number' || typeof record.time.endTime != 'number')) {
            reply(raw, "time format error", CODE.E_100)
            return
        }
        if (record.time.type == 3 && typeof record.time.weekPeriodTime != 'object') {
            reply(raw, "time format error", CODE.E_100)
            return
        }
        if (typeof record.extra != 'object') {
            reply(raw, "extra format error", CODE.E_100)
            return
        }
        if (record.type == 200) {
            // 卡类型
            record.code = record.code.toLowerCase()
        }
        data[i] = {
            id: record.id,
            type: record.type,
            code: record.code,
            index: record.index,
            extra: utils.isEmpty(record.extra) ? JSON.stringify({}) : JSON.stringify(record.extra),
            timeType: record.time.type,
            beginTime: record.time.type == 0 ? 0 : record.time.range.beginTime,
            endTime: record.time.type == 0 ? 0 : record.time.range.endTime,
            repeatBeginTime: record.time.type != 2 ? 0 : record.time.beginTime,
            repeatEndTime: record.time.type != 2 ? 0 : record.time.endTime,
            period: record.time.type != 3 ? 0 : JSON.stringify(record.time.weekPeriodTime)
        }
    }
    // 入库
    try {
        let res = sqliteFuncs.permisisonInsert(data)
        if (res == 0) {
            reply(raw, data.map(data => data.id))
        } else {
            reply(raw, "insert fail", CODE.E_100)
            return
        }
    } catch (error) {
        log.error(error, error.stack)
        reply(raw, error, CODE.E_100)
        return
    }
}

// 删除权限
mqttService.delPermission = function (raw) {
    log.info("{mqttService} [delPermission] req:" + JSON.stringify(raw))
    let data = JSON.parse(raw.payload).data
    if (!Array.isArray(data)) {
        reply(raw, "data shoulde be an array", CODE.E_100)
        return
    }
    try {
        let res = sqliteFuncs.permisisonDeleteByIdIn(data)
        if (res == 0) {
            reply(raw)
        } else {
            reply(raw, "delete fail", CODE.E_100)
            return
        }
    } catch (error) {
        log.error(error, error.stack)
        reply(raw, error, CODE.E_100)
        return
    }
}

// 清空权限
mqttService.clearPermission = function (raw) {
    log.info("{mqttService} [clearPermission] req:" + JSON.stringify(raw))
    try {
        let res = sqliteFuncs.permissionClear()
        if (res == 0) {
            reply(raw)
        } else {
            reply(raw, "clear fail", CODE.E_100)
            return
        }
    } catch (error) {
        log.error(error, error.stack)
        reply(raw, error, CODE.E_100)
        return
    }
}

// 查询密钥
mqttService.getSecurity = function (raw) {
    log.info("{mqttService} [getSecurity] req:" + JSON.stringify(raw))
    let data = JSON.parse(raw.payload).data
    if (!data || typeof data != 'object') {
        reply(raw, "data should not be empty", CODE.E_100)
        return
    }
    if (typeof data.page != 'number') {
        data.page = 0
    }
    if (typeof data.size != 'number' || data.size > 200) {
        data.size = 10
    }
    try {
        let res = sqliteFuncs.securityFindAll(data.page, data.size, data.key, data.type, data.id)
        reply(raw, res)
    } catch (error) {
        log.error(error, error.stack)
        reply(raw, error, CODE.E_100)
        return
    }
}

// 添加密钥
mqttService.insertSecurity = function (raw) {
    log.info("{mqttService} [insertSecurity] req:" + JSON.stringify(raw))
    let data = JSON.parse(raw.payload).data
    if (!Array.isArray(data)) {
        reply(raw, "data shoulde be an array", CODE.E_100)
        return
    }
    // 校验
    for (let i = 0; i < data.length; i++) {
        let secret = data[i];
        if (utils.isEmpty(secret.id) || utils.isEmpty(secret.type) || utils.isEmpty(secret.key) || utils.isEmpty(secret.value) || typeof secret.startTime != 'number' || typeof secret.endTime != 'number') {
            reply(raw, "id,type,key,value,startTime,endTime shoulde not be empty", CODE.E_100)
            return
        }
    }
    try {
        let res = sqliteFuncs.securityInsert(data)
        if (res == 0) {
            reply(raw)
        } else {
            reply(raw, "clear fail", CODE.E_100)
            return
        }
    } catch (error) {
        log.error(error, error.stack)
        reply(raw, error, CODE.E_100)
        return
    }
}

// 删除密钥
mqttService.delSecurity = function (raw) {
    log.info("{mqttService} [delSecurity] req:" + JSON.stringify(raw))
    let data = JSON.parse(raw.payload).data
    if (!Array.isArray(data)) {
        reply(raw, "data shoulde be an array", CODE.E_100)
        return
    }
    try {
        let res = sqliteFuncs.securityDeleteByIdIn(data)
        if (res == 0) {
            reply(raw)
        } else {
            reply(raw, "delete fail", CODE.E_100)
            return
        }
    } catch (error) {
        log.error(error, error.stack)
        reply(raw, error, CODE.E_100)
        return
    }
}

// 清空密钥
mqttService.clearSecurity = function (raw) {
    log.info("{mqttService} [clearSecurity] req:" + JSON.stringify(raw))
    try {
        let res = sqliteFuncs.securityClear()
        if (res == 0) {
            reply(raw)
        } else {
            reply(raw, "clear fail", CODE.E_100)
            return
        }
    } catch (error) {
        log.error(error, error.stack)
        reply(raw, error, CODE.E_100)
        return
    }
}

// 远程控制
mqttService.control = function (raw) {
    log.info("{mqttService} [control] req:" + JSON.stringify(raw))
    let data = JSON.parse(raw.payload).data
    if (!data || typeof data != 'object' || typeof data.command != 'number') {
        reply(raw, "data.command should not be empty", CODE.E_100)
        return
    }
    switch (data.command) {
        case 0:
            // 重启
            common.asyncReboot(2)
            break
        case 1:
            // 远程开门
            queueCenter.push("access", { type: 900 });
            break
        case 2:
            // 启用
            config.setAndSave("sysInfo.status", "1")
            break
        case 3:
            // 禁用
            config.setAndSave("sysInfo.status", "2")
            break
        case 4:
            // 重置
            // 删除配置文件和数据库
            common.systemBrief("rm -rf /app/data/config/* && rm -rf /app/data/db/app.db")
            common.asyncReboot(2)
            break
        default:
            reply(raw, "Illegal instruction", CODE.E_100)
            return;
    }
    reply(raw)
}

// 升级固件
mqttService.upgradeFirmware = function (raw) {
    log.info("{mqttService} [upgradeFirmware] req:" + JSON.stringify(raw))
    let data = JSON.parse(raw.payload).data
    if (!data || typeof data != 'object' || typeof data.type != 'number' || typeof data.url != 'string' || typeof data.md5 != 'string') {
        reply(raw, "data's params error", CODE.E_100)
        return
    }
    // 查看包大小（字节数）
    let actualSize = utils.getUrlFileSize(data.url)
    if (data.type == 0) {
        // 本机升级
        // 约束升级包大小区间,2K-2M之间
        const limit = [2 * 1024, 2 * 1024 * 1024]
        if (actualSize < limit[0] || actualSize > limit[1]) {
            reply(raw, "file error", CODE.E_100)
            return
        }
        // 下载升级包
        driver.pwm.warning()
        let ret = utils.waitDownload(data.url, '/app/data/upgrades/APP_1_0.zip', 60 * 1000, data.md5, actualSize)
        if (!ret) {
            reply(raw, "upgrade failure", CODE.E_100)
            return
        } else {
            reply(raw)
            // 下载完成，3秒后重启
            common.asyncReboot(3)
        }
    } else if (data.type == 10) {
        // 资源升级，默认放到/app/code/usr/路径下
        const usrDataPath = '/app/data/user/'
        if (!std.exist(usrDataPath)) {
            common.systemBrief("mkdir -p " + usrDataPath)
        }

        if (typeof data.extra != "object" && utils.isEmpty(data.extra.fileName)) {
            reply(raw, "the data.extra.fileName error", CODE.E_100)
            return
        } else {
            let ret = utils.waitDownload(data.url, usrDataPath + data.extra.fileName, 60 * 1000, data.md5, actualSize)
            if (!ret) {
                reply(raw, "upgrade failure", CODE.E_100)
                return
            } else {
                reply(raw)
            }
        }
    }
}

// 通行记录回复
mqttService.access_reply = function (raw) {
    log.info("{mqttService} [access_reply] req:" + JSON.stringify(raw))
    let payload = JSON.parse(raw.payload)
    let map = dxMap.get("REPORT")
    let data = map.get(payload.serialNo).list
    if (data) {
        sqliteFuncs.passRecordDeleteByTimeIn(data)
        map.del(payload.serialNo)
    }
}

/**
 * 在线验证结果
 */
mqttService.access_online_reply = function (raw) {
    log.info("{mqttService} [access_online_reply] req:" + JSON.stringify(raw))
    driver.mqtt.getOnlinecheckReply(JSON.parse(raw.payload))
}

//-----------------------private-------------------------
// mqtt请求统一回复
function reply(raw, data, code) {
    let topicReply = raw.topic.replace("/" + config.get("sysInfo.sn"), '') + "_reply"
    let payloadReply = JSON.stringify(mqttReply(JSON.parse(raw.payload).serialNo, data, (code == null || code == undefined) ? CODE.S_000 : code))
    driver.mqtt.send({ topic: topicReply, payload: payloadReply })
}

// mqtt回复格式构建
function mqttReply(serialNo, data, code) {
    return {
        serialNo: serialNo,
        uuid: config.get("sysInfo.sn"),
        sign: '',
        code: code,
        data: data,
        time: Math.floor(Date.parse(new Date()) / 1000)
    }
}
mqttService.mqttReply = mqttReply

const CODE = {
    // 成功
    S_000: "000000",
    // 未知错误
    E_100: "100000",
    // 设备已被禁用	
    E_101: "100001",
    // 设备正忙，请稍后再试	
    E_102: "100002",
    // 签名检验失败	
    E_103: "100003",
    // 超时错误
    E_104: "100004",
    // 设备离线	
    E_105: "100005",
}
mqttService.CODE = CODE

// 获取所有订阅的topic
function getTopics() {
    let sn = config.get("sysInfo.sn")
    const topics = [
        "control", "getConfig", "setConfig", "upgradeFirmware", "test",
        "getPermission", "insertPermission", "delPermission", "clearPermission",
        "getUser", "insertUser", "delUser", "clearUser",
        "getKey", "insertKey", "delKey", "clearKey",
        "getSecurity", "insertSecurity", "delSecurity", "clearSecurity"
    ]
    const eventReplies = ["connect_reply", "alarm_reply", "access_reply", "access_online_reply"]

    let flag = 'access_device/v1/cmd/' + sn + "/"
    let eventFlag = 'access_device/v1/event/' + sn + "/"
    return topics.map(item => flag + item).concat(eventReplies.map(item => eventFlag + item));
}

// 获取net连接配置
mqttService.getNetOptions = function () {
    let dhcp = config.get("netInfo.dhcp")
    dhcp = utils.isEmpty(dhcp) ? dxNet.DHCP.DYNAMIC : (dhcp + 1)
    let dns = config.get("netInfo.dns")
    dns = utils.isEmpty(dns) ? [null, null] : dns.split(",")
    let ip = config.get("netInfo.ip")
    if (utils.isEmpty(ip)) {
        // 如果ip未设置，则使用动态ip
        dhcp = dxNet.DHCP.DYNAMIC
    }
    let options = {
        type: dxNet.TYPE.ETHERNET,
        dhcp: dhcp,
        ip: ip,
        gateway: config.get("netInfo.gateway"),
        netmask: config.get("netInfo.subnetMask"),
        dns0: dns[0],
        dns1: dns[1],
        macAddr: common.getUuid2mac(),
    }
    return options
}

// 获取mqtt连接配置
mqttService.getOptions = function () {
    let qos = config.get("mqttInfo.qos")
    qos = utils.isEmpty(qos) ? 2 : qos
    let options = {
        mqttAddr: "tcp://" + config.get("mqttInfo.mqttAddr"),
        clientId: config.get("mqttInfo.clientId"),
        username: config.get("mqttInfo.mqttName") || 'admin',
        password: config.get("mqttInfo.password") || 'password',
        prefix: config.get("mqttInfo.prefix"),
        qos: qos,
        // 订阅
        subs: getTopics(),
        // 遗嘱
        willTopic: 'access_device/v1/event/offline',
        willMessage: JSON.stringify({
            serialNo: utils.genRandomStr(10),
            uuid: config.get("sysInfo.sn"),
            sign: "",
            time: Math.floor(new Date().getTime() / 1000)
        })
    }
    return options
}

// 匹配以点分十进制形式表示的 IP 地址，例如：192.168.0.1。
const ipCheck = v => /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v)
// 匹配 192.168.0.1:8080 格式
const ipCheckWithPort = v => /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\:\d{1,5}$/.test(v);
// 正整数
const regpCheck = v => /^[1-9]\d*$/.test(v)
// 非负整数
const regnCheck = v => /^([1-9]\d*|0{1})$/.test(v)
// 所有支持的配置项的检验规则以及设置成功后的回调
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
        mqttAddr: { rule: ipCheckWithPort },
        clientId: { rule: v => typeof v == 'string' },
        mqttName: { rule: v => typeof v == 'string' },
        password: { rule: v => typeof v == 'string' },
        qos: { rule: v => [0, 1, 2].includes(v) },
        prefix: { rule: v => typeof v == 'string' },
    },
    bleInfo: {
        mac: { rule: v => /^[0-9|a-f|A-F]{12}$/.test(v), callback: v => driver.uartBle.setConfig({ mac: v }) },
        name: { rule: v => typeof v == 'string', callback: v => driver.uartBle.setConfig({ name: v }) },
    },
    uiInfo: {
        rotation: { rule: v => [0, 1, 2, 3].includes(v), callback: rotationCb },
        statusBar: { rule: v => [0, 1].includes(v), callback: v => driver.screen.showStatusBar(v) },
        language: { rule: v => v == 'EN' || v == 'CH' },
        horBgImage: { rule: v => typeof v == 'string' },
        verBgImage: { rule: v => typeof v == 'string' },
        //sn是否隐藏 1 显示 0 隐藏
        sn_show: { rule: v => [0, 1].includes(v), callback: v => driver.screen.showSn(v) },
        //ip是否隐藏 1 显示 0 隐藏
        ip_show: { rule: v => [0, 1].includes(v), callback: v => driver.screen.showIp(v) },
    },
    doorInfo: {
        openMode: { rule: v => [0, 1, 2].includes(v), callback: openModeCb },
        openTime: { rule: regpCheck },
        openTimeout: { rule: regpCheck },
        onlinecheck: { rule: v => [0, 1].includes(v) },
        timeout: { rule: regpCheck },
        offlineAccessNum: { rule: regpCheck },
    },
    sysInfo: {
        //语音音量
        volume: { rule: regnCheck },
        //按键音量
        volume2: { rule: regnCheck },
        //蜂鸣音量
        volume3: { rule: regnCheck },
        heart_time: { rule: regpCheck },
        heart_en: { rule: v => [0, 1].includes(v) },
        heart_data: { rule: v => typeof v == 'string' },
        devname: { rule: v => typeof v == 'string', callback: v => driver.screen.setDevName(v) },
        com_passwd: { rule: regnCheck },
    }
}
// 需要重启的配置
const needReboot = ["netInfo", "mqttInfo", "sysInfo.volume", "sysInfo.volume2", "sysInfo.volume3", "sysInfo.heart_time", "sysInfo.heart_en", 'uiInfo.language']

// 统一用户配置校验方法
function configVerifyAndSave(data) {
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
                // 没有校验规则，或者校验通过
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
mqttService.configVerifyAndSave = configVerifyAndSave

// 开门模式修改回调
function rotationCb(value) {
    driver.screen.rotate(value)
}

// 开门模式修改回调
function openModeCb(value) {
    if (value == 1) {
        driver.gpio.open()
    } else {
        driver.gpio.close()
    }
}

/**
 * 连接上报(在线上报/在线后的通行记录上报)
 */
mqttService.report = function () {
    let bleInfo = driver.uartBle.getConfig()
    // 在线上报
    let payloadReply = JSON.stringify(mqttReply(utils.genRandomStr(10), {
        sysVersion: config.get("sysInfo.appVersion"),
        appVersion: config.get("sysInfo.appVersion"),
        createTime: config.get("sysInfo.createTime"),
        btMac: bleInfo.mac,
        mac: config.get("sysInfo.mac"),
        clientId: config.get("mqttInfo.clientId"),
        name: config.get("sysInfo.deviceName") || '酷豆物联',
        type: config.get("netInfo.type") || 1,
        dhcp: config.get("netInfo.dhcp") || 1,
        ip: config.get("netInfo.ip"),
        gateway: config.get("netInfo.gateway"),
        dns: config.get("netInfo.dns"),
        subnetMask: config.get("netInfo.subnetMask"),
        netMac: config.get("netInfo.netMac"),
    }, CODE.S_000))
    driver.mqtt.send({ topic: "access_device/v1/event/connect", payload: payloadReply })

    //通行记录上报
    let res = sqliteFuncs.passRecordFindAll()
    if (res && res.length != 0) {
        let reportCount = config.get('sysInfo.reportCount') || 500; // 定义每批处理的大小
        for (let i = 0; i < res.length; i += reportCount) {
            let batch = res.slice(i, i + reportCount);
            let serialNo = utils.genRandomStr(10)
            let map = dxMap.get("REPORT")
            let list = batch.map(obj => obj.time);
            map.put(serialNo, { list: list, time: new Date().getTime() })
            driver.mqtt.send({ topic: "access_device/v1/event/access", payload: JSON.stringify(mqttReply(serialNo, batch, CODE.S_000)) })
        }

    }

}

export default mqttService
