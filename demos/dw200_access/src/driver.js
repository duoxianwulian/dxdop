import dxPwm from '../dxmodules/dxPwm.js'
import std from '../dxmodules/dxStd.js'
import dxNet from '../dxmodules/dxNet.js'
import dxGpio from '../dxmodules/dxGpio.js'
import dxCode from '../dxmodules/dxCode.js'
import center from '../dxmodules/dxEventCenter.js'
import dxNfc from '../dxmodules/dxNfc.js'
import dxAlsaplay from '../dxmodules/dxAlsaplay.js'
import dxGpioKey from '../dxmodules/dxGpioKey.js'
import dxMqtt from '../dxmodules/dxMqtt.js'
import dxNtp from '../dxmodules/dxNtp.js'
import dxMap from '../dxmodules/dxMap.js'
import config from '../dxmodules/dxConfig.js'
import common from '../dxmodules/dxCommon.js'
// import wpc from '../dxmodules/dxWpc.js'
import dxUart from '../dxmodules/dxUart.js'
import watchdog from '../dxmodules/dxWatchdog.js'
import mqttService from './service/mqttService.js'
import utils from './common/utils/utils.js'
import uartBleService from './service/uartBleService.js'
import queueCenter from './queueCenter.js'
import sqlite from './service/sqliteService.js'

const driver = {}
driver.pwm = {
    init: function () {
        // 初始化蜂鸣
        dxPwm.request(4);
        dxPwm.setPeriodByChannel(4, 366166)
        dxPwm.enable(4, true)
    },
    // 按键音
    press: function () {
        dxPwm.beep({ channel: 4, time: 3, volume: this.getVolume2(), interval: 0 })
    },
    //失败音
    fail: function () {
        dxPwm.beep({ channel: 4, time: 500, volume: this.getVolume3(), interval: 0 })
    },
    //成功音
    success: function () {
        dxPwm.beep({ channel: 4, count: 2, volume: this.getVolume3() })
    },
    //警告音
    warning: function () {
        dxPwm.beep({ channel: 4, volume: this.getVolume3(), interval: 0 })
    },
    // 按键音量
    getVolume2: function () {
        if (utils.isEmpty(this.volume2)) {
            let volume2 = config.get("sysInfo.volume2")
            this.volume2 = utils.isEmpty(volume2) ? 50 : volume2
        }
        return this.volume2
    },
    // 蜂鸣提示音量
    getVolume3: function () {
        if (utils.isEmpty(this.volume3)) {
            let volume3 = config.get("sysInfo.volume3")
            this.volume3 = utils.isEmpty(volume3) ? 50 : volume3
        }
        return this.volume3
    }
}
driver.net = {
    init: function () {
        dxNet.worker.beforeLoop(mqttService.getNetOptions())
    },
    loop: function () {
        dxNet.worker.loop()
    }
}
driver.gpio = {
    init: function () {
        dxGpio.init()
        dxGpio.request(105)
    },
    open: function () {
        // 判断开门模式
        let openMode = config.get("doorInfo.openMode")
        if (utils.isEmpty(openMode)) {
            openMode = 0
        }
        // 常闭不允许开
        if (openMode != 2) {
            dxGpio.setValue(105, 1)
        }
        if (openMode == 0) {
            // 正常模式记录关继电器的时间
            let openTime = config.get("doorInfo.openTime")
            openTime = utils.isEmpty(openTime) ? 2000 : openTime
            let map = dxMap.get("GPIO")
            map.put("relayCloseTime", new Date().getTime() + openTime)
        }
    },
    close: function () {
        let openMode = config.get("doorInfo.openMode")
        // 判断开门模式
        // 常开不允许关
        if (openMode != 1) {
            dxGpio.setValue(105, 0)
        }
    },
    // 循环关继电器
    loop: function () {
        if (utils.isEmpty(this.checkTime) || new Date().getTime() - this.checkTime > 200) {
            // 降低检查频率，间隔200毫秒检查一次
            this.checkTime = new Date().getTime()
            let map = dxMap.get("GPIO")
            let relayCloseTime = map.get("relayCloseTime")
            if (typeof relayCloseTime == 'number' && new Date().getTime() >= relayCloseTime) {
                this.close()
                map.del("relayCloseTime")
            }
        }
    }
}
driver.code = {
    options1: { id: 'capturer1', path: '/dev/video11' },
    options2: { id: 'decoder1', name: "decoder v4", width: 800, height: 600 },
    init: function () {
        dxCode.worker.beforeLoop(this.options1, this.options2)
        dxCode.worker.interval = 2000
    },
    loop: function () {
        dxCode.worker.loop(this.options1, this.options2)
    }
}
driver.nfc = {
    options: { id: 'nfc1', m1: true, psam: false },
    run: function () {
        dxNfc.run()
    },
    init: function () {
        dxNfc.worker.beforeLoop(this.options)
    },
    loop: function () {
        dxNfc.worker.loop(this.options)
    }
}
driver.audio = {
    init: function () {
        dxAlsaplay.init()
        // 语音播报音量
        let volume = config.get("sysInfo.volume")
        if (utils.isEmpty(volume)) {
            volume = 6
        }
        dxAlsaplay.setVolume(volume)
    },
    // 获取/设置音量，范围（[0,6]）
    volume: function (volume) {
        if (volume && typeof volume == 'number') {
            dxAlsaplay.setVolume(volume)
        } else {
            return dxAlsaplay.getVolume()
        }
    },
    fail: function () {
        dxAlsaplay.play(config.get("uiInfo.language") == "EN" ? '/app/code/resource/wav/mj_f_eng.wav' : '/app/code/resource/wav/mj_f.wav')
    },
    success: function () {
        dxAlsaplay.play(config.get("uiInfo.language") == "EN" ? '/app/code/resource/wav/mj_s_eng.wav' : '/app/code/resource/wav/mj_s.wav')
    }
}
driver.gpiokey = {
    init: function () {
        dxGpioKey.worker.beforeLoop()
    },
    sensorChanged: function (value) {
        let map1 = dxMap.get("GPIO")
        let relayCloseTime = map1.get("relayCloseTime") || 0
        if (value == 1 && new Date().getTime() > parseInt(relayCloseTime)) {
            // gpio 在关的情况在打开门磁代表非法开门上报
            driver.mqtt.alarm(2, value)
        }
        driver.mqtt.alarm(0, value)
        let map = dxMap.get("GPIOKEY")
        if (value == 0) {
            map.del("alarmOpenTimeoutTime")
        } else if (value == 1) {
            // 记录开门超时时间
            let openTimeout = config.get("doorInfo.openTimeout") * 1000
            openTimeout = utils.isEmpty(openTimeout) ? 10000 : openTimeout
            map.put("alarmOpenTimeoutTime", new Date().getTime() + openTimeout)
        }
    },
    loop: function () {
        dxGpioKey.worker.loop()
        if (utils.isEmpty(this.checkTime) || new Date().getTime() - this.checkTime > 200) {
            // 降低检查频率，间隔200毫秒检查一次
            this.checkTime = new Date().getTime()
            let map = dxMap.get("GPIOKEY")
            let alarmOpenTimeoutTime = map.get("alarmOpenTimeoutTime")
            if (typeof alarmOpenTimeoutTime == 'number' && new Date().getTime() >= alarmOpenTimeoutTime) {
                driver.mqtt.alarm(3)
                map.del("alarmOpenTimeoutTime")
            }
        }
    },
}
driver.ntp = {
    enable: true,
    init: function () {
        // ntp状态
        let ntp = config.get("netInfo.ntp")
        this.enable = (utils.isEmpty(ntp) || ntp == 1) ? true : false
        if (this.enable) {
            // 目前只支持间隔对时
            let ntpInterval = config.get("netInfo.ntpInterval")
            let ntpAddr = config.get("netInfo.ntpAddr")
            // 秒转分钟
            ntpInterval = typeof ntpInterval == 'number' ? ntpInterval / 60 : undefined
            dxNtp.beforeLoop(utils.isEmpty(ntpAddr) ? undefined : ntpAddr, ntpInterval)
        }
    },
    loop: function () {
        if (this.enable) {
            dxNtp.loop()
        }
    }
}
driver.screen = {
    accessFail: function (type) {
        center.fire('displayResults', { type: type, flag: false })
        // wpc.invoke('screen', 'displayResults', { type: type, flag: false })
    },
    accessSuccess: function (type) {
        center.fire('displayResults', { type: type, flag: true })
        // wpc.invoke('screen', 'displayResults', { type: type, flag: true })
    },
    rotate: function (dir) {
        center.fire('rotate', dir)
        // wpc.invoke('screen', 'rotate', dir)
    },
    // eg:{fontPath:'/a.ttf',color:'0x000000'}
    setFont: function (param) {
        center.fire('setFont', param)
        // wpc.invoke('screen', 'setFont', param)
    },
    setBg: function (path) {
        center.fire('path', path)
        // wpc.invoke('screen', 'path', path)
    },
    // eg:{msg:'',time:1000}
    showMsg: function (param) {
        center.fire('showMsg', param)
        // wpc.invoke('screen', 'showMsg', param)
    },
    warning: function (param) {
        center.fire('warning', param)
        // wpc.invoke('screen', 'warning', param)
    },
    // eg:{time:1000,path:'/a.png'}
    showPic: function (param) {
        center.fire('showPic', param)
        // wpc.invoke('screen', 'showPic', param)
    },
    netStatusChange: function (data) {
        // wpc.invoke('screen', 'netStatusChange', data)
        center.fire('netStatusChange', data)
        let param = dxNet.getModeByCard(data.type).param
        if (param.ip) {
            config.set('netInfo.ip', param.ip)
        }
        if (param.gateway) {
            config.set('netInfo.gateway', param.gateway)
        }
        if (param.netmask) {
            config.set('netInfo.subnetMask', param.netmask)
        }
        if (param.dns0) {
            config.set('netInfo.dns', param.dns0)
        }
        config.save()
    },
    mqttConnectedChange: function (data) {
        center.fire('mqttConnectedChange', data)
        // wpc.invoke('screen', 'mqttConnectedChange', data)
    },
    showStatusBar: function (data) {
        center.fire('showStatusBar', data)
        // wpc.invoke('screen', 'showStatusBar', data)
    },
    showSn: function (data) {
        center.fire('showSn', data)
        // wpc.invoke('screen', 'showSn', data)
    },
    showIp: function (data) {
        center.fire('showIp', data)
        // wpc.invoke('screen', 'showIp', data)
    },
    setDevName: function (data) {
        center.fire('setDevName', data)
        // wpc.invoke('screen', 'setDevName', data)
    }
}
driver.system = {
    init: function () {
    }
}
driver.uartBle = {
    id: 'uartBle',
    init: function () {
        dxUart.runvg({ id: this.id, type: dxUart.TYPE.UART, path: '/dev/ttyS5', result: 0 })
        dxUart.ioctl(1, '921600-8-N-1', this.id)
    },
    send: function (data) {
        dxUart.sendVg(data, this.id)
    },
    accessSuccess: function (index) {
        let pack = { "head": "55aa", "cmd": "0f", "result": "00", "dlen": 1, "data": index }
        this.send("55aa0f000100" + index + this.genCrc(pack))
    },
    accessFail: function (index) {
        let pack = { "head": "55aa", "cmd": "0f", "result": "90", "dlen": 1, "data": index }
        this.send("55aa0f900100" + index + this.genCrc(pack))
    },
    getConfig: function () {
        let pack = { "head": "55aa", "cmd": "60", "result": "00", "dlen": 6, "data": "7e01000200fe" }
        this.send("55aa6000" + common.decimalToLittleEndianHex(pack.dlen, 2) + pack.data + this.genCrc(pack))
        return driver.sync.request("uartBle.getConfig", 2000)
    },
    getConfigReply: function (data) {
        driver.sync.response("uartBle.getConfig", data)
    },
    setConfig: function (param) {
        uartBleService.setBleConfig(param)
        // 设置成功返回true
        return driver.sync.request("uartBle.setConfig", 2000)
    },
    setConfigReply: function (data) {
        driver.sync.response("uartBle.setConfig", data)
    },
    /**
     * 生成蓝牙串口的校验字，和一般校验字计算不一样
     * @param {*} pack eg:{ "head": "55aa", "cmd": "0f", "result": "90", "dlen": 1, "data": "01" }
     * @returns 
     */
    genCrc: function (pack) {
        let bcc = 0;
        let dlen = pack.dlen - 1;//去掉index
        bcc ^= 0x55;
        bcc ^= 0xaa;
        bcc ^= parseInt(pack.cmd, 16);
        bcc ^= pack.result ? parseInt(pack.result, 16) : 0;
        bcc ^= (dlen & 0xff);
        bcc ^= (dlen & 0xff00) >> 8;
        for (let i = 0; i < pack.dlen; i++) {
            bcc ^= pack.data[i];
        }
        return bcc.toString(16).padStart(2, '0');
    }
}
driver.sync = {
    // 异步转同步小实现
    request: function (topic, timeout) {
        let map = dxMap.get("SYNC")
        let count = 0
        let data = map.get(topic)
        while (utils.isEmpty(data) && count * 10 < timeout) {
            data = map.get(topic)
            std.sleep(10)
            count += 1
        }
        let res = map.get(topic)
        map.del(topic)
        return res
    },
    response: function (topic, data) {
        let map = dxMap.get("SYNC")
        map.put(topic, data)
    }
}
driver.mqtt = {
    id: "mqtt1",
    init: function () {
        let options = mqttService.getOptions()
        options.id = this.id
        dxMqtt.run(options)
    },
    connect: function (data) {
        if (utils.isEmpty(this.connectTime)) {
            this.connectTime = 0
        }
        if (data == "connected" && new Date().getTime() - this.connectTime > 10000) {
            // 屏蔽过多的上报
            this.connectTime = new Date().getTime()
            queueCenter.push("report");
        }
        driver.screen.mqttConnectedChange(data)
    },
    send: function (data) {
        dxMqtt.send(data.topic, data.payload, this.id)
    },
    alarm: function (type, value) {
        this.send({ topic: "access_device/v1/event/alarm", payload: JSON.stringify(mqttService.mqttReply(utils.genRandomStr(10), { type: type, value: value }, mqttService.CODE.S_000)) })
    },
    getOnlinecheck: function () {
        let timeout = config.get("doorInfo.timeout")
        timeout = utils.isEmpty(timeout) ? 2000 : timeout
        let language = config.get('uiInfo.language')
        driver.screen.warning({ msg: language == "EN" ? 'Online verification, please wait' : '在线核验中,请稍候', time: timeout, flag: 'warning' })
        return driver.sync.request("mqtt.getOnlinecheck", timeout)
    },
    getOnlinecheckReply: function (data) {
        driver.sync.response("mqtt.getOnlinecheck", data)
    },
    heartbeat: function () {
        if (utils.isEmpty(this.heart_en)) {
            let heart_en = config.get('sysInfo.heart_en')
            this.heart_en = utils.isEmpty(heart_en) ? 0 : heart_en
            let heart_time = config.get('sysInfo.heart_time')
            this.heart_time = utils.isEmpty(heart_time) ? 60 * 1000 : heart_time * 1000
        }
        if (utils.isEmpty(this.lastHeartbeat)) {
            this.lastHeartbeat = 0
        }
        if (this.heart_en === 1 && (new Date().getTime() - this.lastHeartbeat >= this.heart_time)) {
            this.lastHeartbeat = new Date().getTime()
            this.send({ topic: "access_device/v1/event/heartbeat", payload: JSON.stringify(mqttService.mqttReply(utils.genRandomStr(10), config.get('sysInfo.heart_data'), mqttService.CODE.S_000)) })
        }
    }
}
driver.config = {
    init: function () {
        let mac = common.getUuid2mac(19)
        let uuid = common.getSn(19)
        if (!config.get('sysInfo.mac') && mac) {
            config.set('sysInfo.mac', mac)
        }
        if (!config.get('sysInfo.uuid') && uuid) {
            config.set('sysInfo.uuid', uuid)
        }
        //如果 sn 为空先用设备 uuid
        if (!config.get('sysInfo.sn') && uuid) {
            config.set('sysInfo.sn', uuid)
        }
        if (!config.get('mqttInfo.clientId') && uuid) {
            config.set('mqttInfo.clientId', uuid)
        }
        config.save()
    }
}
driver.watchdog = {
    init: function () {
        watchdog.open(1 | 2)
        watchdog.enable(1)
        watchdog.start(20000)
    },
    loop: function () {
        watchdog.loop(1)
    },
    feed: function (flag, timeout) {
        if (utils.isEmpty(this.feedTime) || new Date().getTime() - this.feedTime > 2000) {
            // 降低喂狗频率，间隔2秒喂一次
            this.feedTime = new Date().getTime()
            watchdog.feed(flag, timeout)
        }
    }
}
// driver初始化静态组件
driver.init = function () {
    // 配置文件先初始化，因为后面的组件初始化中可能要用到配置文件
    this.config.init()
    std.sleep(100)
    this.gpio.init()
    std.sleep(100)
    this.watchdog.init()
    std.sleep(100)
    this.mqtt.init()
    std.sleep(100)
    this.uartBle.init()
    std.sleep(100)
    this.pwm.init()
    std.sleep(100)
    //初始化 sqlite
    sqlite.init('/app/data/db/app.db')
    std.sleep(100)

}
// driver初始化事务相关
driver.initService = function () {
    this.net.init()
    std.sleep(100)
    this.code.init()
    std.sleep(100)
    this.nfc.init()
    std.sleep(100)
    this.gpiokey.init()
    std.sleep(100)
    this.audio.init()
    std.sleep(100)
    this.ntp.init()
    std.sleep(100)
}
// 监听center事务相关队列，并放到事务中去
driver.loop = function () {
    this.net.loop()
    this.code.loop()
    this.nfc.loop()
    this.gpiokey.loop()
    this.ntp.loop()
    this.gpio.loop()
    // 心跳
    driver.mqtt.heartbeat()
}
export default driver
