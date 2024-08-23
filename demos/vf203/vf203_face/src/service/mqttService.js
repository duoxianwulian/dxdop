import config from '../../dxmodules/dxConfig.js'
import log from '../../dxmodules/dxLogger.js'
import common from '../../dxmodules/dxCommon.js'
import utils from '../common/utils/utils.js'
import driver from '../driver.js'
import sqliteService from './sqliteService.js'
import configService from './configService.js'
const mqttService = {}

// =================================权限增删改查=================================
/**
 * 添加权限
 */
mqttService.insertPermission = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    let permissions = []
    for (let i = 0; i < data.length; i++) {
        const permission = data[i];
        if (!permission.id || !permission.userId) {
            return reply(event, "id or userId cannot be empty", CODE.E_100)
        }
        if (!permission.extra) {
            permission.extra = ""
        }
        if (!permission.time) {
            return reply(event, "time and type cannot be empty", CODE.E_100)
        }
        if (permission.time.type != 0 && permission.time.type != 1 && permission.time.type != 2 && permission.time.type != 3) {
            return reply(event, "time type is not supported", CODE.E_100)
        }
        let arr = []
        arr.push(permission.id)
        arr.push(permission.userId)
        arr.push(utils.isEmpty(permission.index) ? 0 : permission.index)
        arr.push(utils.isEmpty(permission.extra) ? JSON.stringify({}) : JSON.stringify(permission.extra))
        arr.push(permission.time.type)
        arr.push(permission.time.type == 0 ? 0 : permission.time.range.beginTime)
        arr.push(permission.time.type == 0 ? 0 : permission.time.range.endTime)
        arr.push(permission.time.type != 2 ? 0 : permission.time.beginTime)
        arr.push(permission.time.type != 2 ? 0 : permission.time.endTime)
        arr.push(permission.time.type != 3 ? 0 : JSON.stringify(permission.time.weekPeriodTime))
        permissions.push(arr)
    }
    let ret = sqliteService.d1_permission.saveAll(permissions)
    if (ret == 0) {
        return reply(event)
    } else {
        return reply(event, "sql error ret:" + ret, CODE.E_100)
    }
}

/**
 * 查询权限
 */
mqttService.getPermission = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    data.page = utils.isEmpty(data.page) ? 0 : data.page
    data.size = utils.isEmpty(data.size) ? 10 : data.size
    let totalCount = sqliteService.d1_permission.count(data)
    let permissions = sqliteService.d1_permission.findAll(data)
    // 构建返回结果
    let content = permissions.map(permission => ({
        id: permission.id,
        userId: permission.userId,
        extra: JSON.parse(permission.extra),
        time: {
            type: permission.timeType,
            beginTime: permission.timeType != 2 ? undefined : permission.repeatBeginTime,
            endTime: permission.timeType != 2 ? undefined : permission.repeatEndTime,
            range: permission.timeType === 0 ? undefined : { beginTime: permission.beginTime, endTime: permission.endTime },
            weekPeriodTime: permission.timeType != 3 ? undefined : JSON.parse(permission.period)
        }
    }))
    return reply(event, {
        content: content,
        page: data.page,
        size: data.size,
        total: totalCount,
        totalPage: Math.ceil(totalCount / data.size),
        count: content.length
    })
}

/**
 * 删除权限
 */
mqttService.delPermission = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    if (data.ids && data.ids.length > 0) {
        let ret = sqliteService.d1_permission.deleteByIdInBatch(data.ids)
        if (ret != 0) {
            return reply(event, "sql error ret:" + ret, CODE.E_100)
        }
    }
    if (data.userIds && data.userIds.length > 0) {
        let ret = sqliteService.d1_permission.deleteByUserIdInBatch(data.userIds)
        if (ret != 0) {
            return reply(event, "sql error ret:" + ret, CODE.E_100)
        }
    }
    return reply(event)
}

/**
 * 清空权限
 */
mqttService.clearPermission = function (event) {
    let ret = sqliteService.d1_permission.deleteAll()
    if (ret == 0) {
        return reply(event)
    } else {
        return reply(event, "sql error ret:" + ret, CODE.E_100)
    }
}

// =================================人员增删改查=================================
/**
 * 添加人员
 */
mqttService.insertUser = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    let persons = []
    for (let i = 0; i < data.length; i++) {
        const person = data[i];
        if (!person.id || !person.name) {
            return reply(event, "id or name cannot be empty", CODE.E_100)
        }
        let arr = []
        arr.push(person.id)
        arr.push(person.name)
        arr.push(!utils.isEmpty(person.extra) ? JSON.stringify(person.extra) : JSON.stringify({}))
        persons.push(arr)
    }
    let ret = sqliteService.d1_person.saveAll(persons)
    if (ret == 0) {
        return reply(event)
    } else {
        return reply(event, "sql error ret:" + ret, CODE.E_100)
    }
}
/**
 * 查询人员
 */
mqttService.getUser = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    data.page = utils.isEmpty(data.page) ? 0 : data.page
    data.size = utils.isEmpty(data.size) ? 10 : data.size
    let totalCount = sqliteService.d1_person.count(data)
    let persons = sqliteService.d1_person.findAll(data)
    return reply(event, {
        content: persons,
        page: data.page,
        size: data.size,
        total: totalCount,
        totalPage: Math.ceil(totalCount / data.size),
        count: persons.length
    })
}

/**
 * 删除人员
 */
mqttService.delUser = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    if (data && data.length > 0) {
        sqliteService.transaction()
        let ret1 = sqliteService.d1_person.deleteByIdInBatch(data)
        let ret2 = sqliteService.d1_permission.deleteByUserIdInBatch(data)
        let ret3 = sqliteService.d1_voucher.deleteByUserIdInBatch(data)
        if (ret1 != 0 || ret2 != 0 || ret3 != 0) {
            sqliteService.rollback()
            return reply(event, "sql error", CODE.E_100)
        }
        sqliteService.commit()
    }
    return reply(event)
}

/**
 * 清空人员
 */
mqttService.clearUser = function (event) {
    let ret = sqliteService.d1_person.deleteAll()
    if (ret == 0) {
        return reply(event)
    } else {
        return reply(event, "sql error ret:" + ret, CODE.E_100)
    }
}

// =================================凭证增删改查=================================
/**
 * 添加凭证
 */
mqttService.insertKey = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    let vouchers = []
    for (let i = 0; i < data.length; i++) {
        const voucher = data[i];
        if (!voucher.id || !voucher.type || !voucher.code || !voucher.userId) {
            return reply(event, "id or type or code or userId cannot be empty", CODE.E_100)
        }
        let arr = []
        arr.push(voucher.id)
        arr.push(voucher.type)
        arr.push(voucher.code)
        arr.push(voucher.userId)
        arr.push(!utils.isEmpty(voucher.extra) ? JSON.stringify(voucher.extra) : JSON.stringify({}))
        vouchers.push(arr)
    }
    let ret = sqliteService.d1_voucher.saveAll(vouchers)
    if (ret == 0) {
        return reply(event)
    } else {
        return reply(event, "sql error ret:" + ret, CODE.E_100)
    }
}

/**
 * 查询凭证
 */
mqttService.getKey = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    data.page = utils.isEmpty(data.page) ? 0 : data.page
    data.size = utils.isEmpty(data.size) ? 10 : data.size
    let totalCount = sqliteService.d1_voucher.count(data)
    let vouchers = sqliteService.d1_voucher.findAll(data)
    return reply(event, {
        content: vouchers,
        page: data.page,
        size: data.size,
        total: totalCount,
        totalPage: Math.ceil(totalCount / data.size),
        count: vouchers.length
    })
}

/**
 * 删除凭证
 */
mqttService.delKey = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    if (data.ids && data.ids.length > 0) {
        let ret = sqliteService.d1_voucher.deleteByIdInBatch(data.ids)
        if (ret != 0) {
            return reply(event, "sql error ret:" + ret, CODE.E_100)
        }
    }
    if (data.userIds && data.userIds.length > 0) {
        let ret = sqliteService.d1_voucher.deleteByUserIdInBatch(data.userIds)
        if (ret != 0) {
            return reply(event, "sql error ret:" + ret, CODE.E_100)
        }
    }
    return reply(event)
}

/**
 * 清空凭证
 */
mqttService.clearKey = function (event) {
    let ret = sqliteService.d1_voucher.deleteAll()
    if (ret == 0) {
        return reply(event)
    } else {
        return reply(event, "sql error ret:" + ret, CODE.E_100)
    }
}

// =================================密钥增删改查=================================
/**
 * 添加密钥
 */
mqttService.insertSecurity = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    let securities = []
    for (let i = 0; i < data.length; i++) {
        const security = data[i];
        let arr = []
        arr.push(security.id)
        arr.push(security.type)
        arr.push(security.key)
        arr.push(security.value)
        arr.push(security.startTime)
        arr.push(security.endTime)
        securities.push(arr)
    }
    let ret = sqliteService.d1_security.saveAll(securities)
    if (ret == 0) {
        return reply(event)
    } else {
        return reply(event, "sql error ret:" + ret, CODE.E_100)
    }
}

/**
 * 查询密钥
 */
mqttService.getSecurity = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    data.page = utils.isEmpty(data.page) ? 0 : data.page
    data.size = utils.isEmpty(data.size) ? 10 : data.size
    let totalCount = sqliteService.d1_security.count(data)
    let securities = sqliteService.d1_security.findAll(data)
    return reply(event, {
        content: securities,
        page: data.page,
        size: data.size,
        total: totalCount,
        totalPage: Math.ceil(totalCount / data.size),
        count: securities.length
    })
}

/**
 * 删除密钥
 */
mqttService.delSecurity = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    if (data.ids && data.ids.length > 0) {
        let ret = sqliteService.d1_security.deleteByIdInBatch(data.ids)
        if (ret != 0) {
            return reply(event, "sql error ret:" + ret, CODE.E_100)
        }
    }
    return reply(event)
}

/**
 * 清空密钥
 */
mqttService.clearSecurity = function (event) {
    let ret = sqliteService.d1_security.deleteAll()
    if (ret == 0) {
        return reply(event)
    } else {
        return reply(event, "sql error ret:" + ret, CODE.E_100)
    }
}

/**
 * 远程控制
 */
mqttService.control = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    switch (data.command) {
        case 0:
            //重启
            reply(event)
            common.asyncReboot(1)
            return
        case 1:
            //远程开门
            driver.gpio.open(1)
            driver.gpio.open(2)
            break
        case 2:
            //启用
            config.setAndSave("sysInfo.status", "1", 'sysInfo')
            break
        case 3:
            //禁用
            config.setAndSave("sysInfo.status", "2", 'sysInfo')
            break
        case 4:
            //重置
            common.systemBrief("rm -rf /app/data/config/*")
            common.systemBrief("rm -rf /app/data/db/*")
            reply(event)
            common.asyncReboot(1)
            return
        case 5:
            //播放语音
            if (!utils.isEmpty(payload.extra.wav)) {
                driver.alsa.play("/app/code/resource/wav/" + payload.extra.wav)
            }
            break
        case 6:
            // 6：屏幕展示图片
            // TODO
            break
        case 7:
            // 7：屏幕展示文字
            // TODO
            break
        default:
            break
    }
    return reply(event)
}

//查询配置
mqttService.getConfig = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
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
    if (utils.isEmpty(data) || typeof data != "string" || data == "") {
        // 查询全部
        return reply(event, res)
    }
    // 单条件查询"data": "mqttInfo.clientId"
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
    return reply(event, search)
}

// 修改配置
mqttService.setConfig = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    if (!data || typeof data != 'object') {
        return reply(event, "data should not be empty", CODE.E_100)
    }
    let res = configService.configVerifyAndSave(data)
    if (typeof res != 'boolean') {
        // 返回错误信息
        return reply(event, res, CODE.E_100)
    }
    if (res) {
        return reply(event)
    } else {
        return reply(event, "unknown failure", CODE.E_100)
    }
}

/**
 * 升级固件
 */
mqttService.upgradeFirmware = function (event) {
    let payload = JSON.parse(event.payload)
    let data = payload.data
    if (!data || typeof data != 'object' || typeof data.type != 'number' || typeof data.url != 'string' || typeof data.md5 != 'string') {
        return reply(event, "data's params error", CODE.E_100)
    }
    // 查看包大小（字节数）
    let actualSize = utils.getUrlFileSize(data.url)
    if (data.type == 0) {
        // 本机升级
        // 约束升级包大小区间,2K-2M之间
        const limit = [2 * 1024, 2 * 1024 * 1024]
        if (actualSize < limit[0] || actualSize > limit[1]) {
            return reply(event, "file error", CODE.E_100)
        }
        // 下载升级包
        driver.pwm.warning()
        let ret = utils.waitDownload(data.url, '/app/data/upgrades/APP_1_0.zip', 60 * 1000, data.md5, actualSize)
        if (!ret) {
            return reply(event, "upgrade failure", CODE.E_100)
        } else {
            reply(event)
            // 下载完成，重启
            common.asyncReboot(1)
            return
        }
    } else if (data.type == 10) {
        // 资源升级，默认放到/app/code/usr/路径下
        const usrDataPath = '/app/data/user/'
        if (!std.exist(usrDataPath)) {
            common.systemBrief("mkdir -p " + usrDataPath)
        }
        if (typeof data.extra != "object" && utils.isEmpty(data.extra.fileName)) {
            return reply(event, "the data.extra.fileName error", CODE.E_100)
        } else {
            let ret = utils.waitDownload(data.url, usrDataPath + data.extra.fileName, 60 * 1000, data.md5, actualSize)
            if (!ret) {
                return reply(event, "upgrade failure", CODE.E_100)
            } else {
                return reply(event)
            }
        }
    }
}

/**
 * 在线验证回复
 */
mqttService.access_online_reply = function (event) {
    // 不做处理
}

/**
 * 在线上报回复
 */
mqttService.connect_reply = function (event) {
    // 不做处理
}

/**
 *  通行记录回复
 */
mqttService.access_reply = function (event) {
    // 清空通行记录
    sqliteService.d1_pass_record.deleteAll()
}

/**
 * 连接上报(在线上报/在线后的通行记录上)
 */
mqttService.report = function () {
    // 在线上报
    let payloadReply = mqttReply(utils.genRandomStr(10), {
        sysVersion: config.get("sysInfo.appVersion"),
        appVersion: config.get("sysInfo.appVersion"),
        createTime: config.get("sysInfo.createTime"),
        mac: config.get("sysInfo.mac"),
        clientId: config.get("mqttInfo.clientId"),
        name: config.get("sysInfo.deviceName"),
        type: config.get("netInfo.type"),
        dhcp: config.get("netInfo.dhcp"),
        ip: config.get("netInfo.ip"),
        gateway: config.get("netInfo.gateway"),
        dns: config.get("netInfo.dns"),
        subnetMask: config.get("netInfo.subnetMask"),
        netMac: config.get("netInfo.netMac"),
    }, CODE.S_000)
    driver.mqtt.send("access_device/v1/event/connect", JSON.stringify(payloadReply))

    //通行记录上报
    let res = sqliteService.d1_pass_record.findAll()
    if (res && res.length != 0) {
        driver.mqtt.send("access_device/v1/event/access", JSON.stringify(mqttReply(utils.genRandomStr(10), res, CODE.S_000)))
    }
}

// mqtt请求统一回复
function reply(event, data, code) {
    let topic = getReplyTopic(event)
    let reply = JSON.stringify(mqttReply(JSON.parse(event.payload).serialNo, data, utils.isEmpty(code) ? CODE.S_000 : code))
    driver.mqtt.send(topic, reply)
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

/**
 * 获取回复主题
 */
function getReplyTopic(data) {
    return data.topic.replace("/" + config.get("sn", 'sysInfo'), '') + "_reply";
}

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
mqttService.getTopics = function () {
    let sn = config.get("mqttInfo.clientId")
    const topics = [
        "control", "getConfig", "setConfig", "upgradeFirmware", "test",
        "getPermission", "insertPermission", "delPermission", "clearPermission",
        "getKey", "insertKey", "delKey", "clearKey",
        "getUser", "insertUser", "delUser", "clearUser",
        "getSecurity", "insertSecurity", "delSecurity", "clearSecurity"
    ]
    const eventReplies = ["connect_reply", "alarm_reply", "access_reply", "access_online_reply"]

    let flag = 'access_device/v1/cmd/' + sn + "/"
    let eventFlag = 'access_device/v1/event/' + sn + "/"
    return topics.map(item => flag + item).concat(eventReplies.map(item => eventFlag + item));
}
// 首字母大写
function firstUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export default mqttService