import log from '../../dxmodules/dxLogger.js'
import config from '../../dxmodules/dxConfig.js'
import dxMap from '../../dxmodules/dxMap.js'
import queueCenter from '../queueCenter.js'
import driver from '../driver.js'
import utils from '../common/utils/utils.js'
import mqttService from "./mqttService.js";
import sqliteService from "./sqliteService.js";
let sqliteFuncs = sqliteService.getFunction()

const accessService = {}

// 通行认证逻辑
accessService.access = function (data) {
    // 设备禁用不做任何通行
    //log.info('[accessService] access :' + JSON.stringify(data))
    if (config.get('sysInfo.status') == 2) {
        log.info('设备禁用不做任何通行')
        return
    }
    // 认证结果
    let res = false
    // 是否上报通行记录
    let isReport = true
    // 通行验证
    let type = data.type
    let code = data.code
    //组装 mqtt 上报通信记录报文
    let record = {
        id: "-1",
        type: parseInt(type),
        code: code,
        time: Math.floor(Date.parse(new Date()) / 1000),
        result: 0,
        extra: { "srcData": code },
        error: ""
    }
    if (type == 900) {
        // 远程开门
        res = true
        isReport = false
    } else if (type == 800) {
        // 按键开门
        res = true
    } else {
        //查询是否有这个凭证值的权限
        res = sqliteFuncs.permissionVerifyByCodeAndType(code, type)
        if (res) {
            let permissions = sqliteFuncs.permissionFindAllByCodeAndType(code)
            let permission = permissions.filter(obj => obj.type == type)[0]
            record.id = permission.id
            record.extra = permission.extra
        }
    }
    if (res) {
        record.result = 1
    } else if (config.get("doorInfo.onlinecheck") === 1) {
        // 在线验证 直接上报内容 按照回复结果反馈
        let serialNo = utils.genRandomStr(10)

        driver.mqtt.send({
            topic: "access_device/v1/event/access_online", payload: JSON.stringify(mqttService.mqttReply(serialNo, [record], undefined))
        })
        driver.pwm.warning()

        // 等待在线验证结果
        let payload = driver.mqtt.getOnlinecheck()
        if (payload && payload.serialNo == serialNo && payload.code == '000000') {
            res = true
        }
        isReport = false
    }
    // ui弹窗，蜂鸣且语音播报成功或失败
    if (res) {
        driver.screen.accessSuccess(type)
        driver.pwm.success()
        driver.audio.success()
        // 继电器开门
        driver.gpio.open()
        // 蓝牙回复
        if (type == 600) {
            driver.uartBle.accessSuccess(data.index)
        }
    } else {
        driver.screen.accessFail(type)
        driver.pwm.fail()
        driver.audio.fail()
        // 蓝牙回复
        if (type == 600) {
            driver.uartBle.accessFail(data.index)
        }
    }
    if (isReport) {
        // 通信记录上报
        accessReport(record);
    }
}

// 上报时实通行记录
function accessReport(record) {
    // 存储通行记录，判断上限
    let count = sqliteFuncs.passRecordFindAllCount()
    let configNum = config.get("doorInfo.offlineAccessNum");
    configNum = utils.isEmpty(configNum) ? 2000 : configNum;
    if (configNum > 0) {
        if (parseInt(count[1]) >= configNum) {
            // 达到最大存储数量
            // 删除最远的那条
            sqliteFuncs.passRecordDelLast()
        }
        record.extra = JSON.stringify(record.extra)
        sqliteFuncs.passRecordInsert(record)
    }
    let map = dxMap.get("REPORT")
    let serialNo = utils.genRandomStr(10)
    map.put(serialNo, { time: new Date().getTime(), list: [record.time] })
    driver.mqtt.send({
        topic: "access_device/v1/event/access", payload: JSON.stringify(mqttService.mqttReply(serialNo, [record], mqttService.CODE.S_000))
    })
}

export default accessService
