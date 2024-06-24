//Implementation of the MQTT protocol
import logger from '../dxmodules/dxLogger.js'
import driver from './driver.js'
import config from '../dxmodules/dxConfig.js'
import common from '../dxmodules/dxCommon.js'
import std from '../dxmodules/dxStd.js'
import center from '../dxmodules/dxEventCenter.js'
import ntp from '../dxmodules/dxNtp.js'
const vg = {}
vg.invoke = function (pack) {
    if (!pack) {
        return
    }
    logger.info(pack)
    let topic = pack.topic
    if (!topic) {
        return
    }
    if (topic.endsWith('/getConfig')) {
        getConfig(pack)
    } else if (topic.endsWith('/setConfig')) {
        setConfig(pack)
    } else if (topic.endsWith('/control')) {
        control(pack)
    } else if (topic.endsWith('/upgradeFirmware')) {
        upgrade(pack)
    }
}
function upgrade(pack) {
    let topic = 'access_device/v1/cmd/upgradeFirmware_reply'
    const payloado = getPayload(pack)
    if (!payloado || !payloado.data || !payloado.data.hasOwnProperty('url')) {
        return
    }
    let obj = {}
    obj.update_flag = 0
    obj.update_addr = payloado.data.url
    obj.update_md5 = payloado.data.md5
    obj.from = 'mqtt'
    obj.success = buildReply(topic, {}, payloado.serialNo, true)
    obj.fail = buildReply(topic, {}, payloado.serialNo, false)
    std.setTimeout(function () {
        driver.ota.update(obj)
    }, 10)
}
function control(pack) {
    let topic = 'access_device/v1/cmd/control_reply'
    const payloado = getPayload(pack)
    logger.info(payloado)
    if (!payloado || !payloado.data || !payloado.data.hasOwnProperty('command')) {
        return
    }
    const command = payloado.data.command
    if (command === 0) {//reboot
        reply(topic, {}, payloado.serialNo, true)
        driver.pwm.success()
        common.asyncReboot(2)
    } else if (command === 1) {//remote open door
        std.setTimeout(function () {
            driver.gpio.toggle(payloado.data.extra.timeout || 2000)
            reply(topic, {}, payloado.serialNo, true)
        }, 10)
    } else if (command === 5) {//play wav
        if (!payloado.data.extra.wav || !std.exist('/app/code/resource/wav/' + payloado.data.extra.wav)) {
            driver.pwm.fail()
            reply(topic, {}, payloado.serialNo, false)
        } else {
            driver.audio.play(payloado.data.extra.wav)
            reply(topic, {}, payloado.serialNo, true)
        }
    } else if (command === 6) {//show image
        if (!payloado.data.extra.image || !std.exist('/app/code/resource/image/' + payloado.data.extra.image)) {
            driver.pwm.fail()
            reply(topic, {}, payloado.serialNo, false)
        } else {
            center.fire('ui', payloado.data)
            reply(topic, {}, payloado.serialNo, true)
        }
    }
}
function getConfig(pack) {
    let topic = 'access_device/v1/cmd/getConfig_reply'
    const payloado = getPayload(pack)
    if (!payloado) {
        return
    }
    if (!payloado.data) {
        reply(topic, config.getAll(), payloado.serialNo, true)
    } else {
        const res = {}
        res[payloado.data] = config.get(payloado.data)
        reply(topic, res, payloado.serialNo, true)
    }
}
function setConfig(pack) {
    const topic = 'access_device/v1/cmd/setConfig_reply'
    const payloado = getPayload(pack)
    if (payloado && payloado.data) {
        Object.keys(payloado.data).forEach(key => {
            config.setAndSave(key, payloado.data[key])
            if (key === 'sys.ntpgmt') {
                ntp.updateGmt(payloado.data[key])
            }
        });
        reply(topic, {}, payloado.serialNo, true)
        common.asyncReboot(2)
    }
}
function getPayload(pack) {
    const payload = pack.payload
    if (!payload) {
        driver.pwm.fail()
        return
    }
    return JSON.parse(payload)
}
vg.accessOnline = function (type, code, pin) {
    if (type === 'phone') {
        type = 901
    } else if (type === 'id') {
        type = 902
    } else if (type === 'code') {
        type = 100
    }
    const data = {}
    if (type) {
        data.type = type
    }
    if (code) {
        data.code = code
    } if (pin) {
        data.pin = pin
    }
    send('access_device/v1/event/access_online', data)
}
function send(topic, data) {
    const timestamp = new Date().getTime()
    driver.mqtt.send({
        topic: topic, payload: JSON.stringify({
            serialNo: ('' + timestamp),
            uuid: common.getSn(),
            time: Math.floor(timestamp / 1000),
            data: data
        })
    })
}
function reply(topic, data, serialNo, success) {
    driver.mqtt.send(buildReply(topic, data, serialNo, success))
}
function buildReply(topic, data, serialNo, success) {
    const timestamp = new Date().getTime()
    return {
        topic: topic, payload: JSON.stringify({
            serialNo: serialNo,
            uuid: common.getSn(),
            time: Math.floor(timestamp / 1000),
            code: success ? '000000' : '300000',
            data: data
        })
    }
}
export default vg