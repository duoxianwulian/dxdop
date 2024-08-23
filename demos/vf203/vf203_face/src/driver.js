import * as os from "os"
import capturer from '../dxmodules/dxCapturer.js'
import log from '../dxmodules/dxLogger.js'
import std from '../dxmodules/dxStd.js'
import pwm from '../dxmodules/dxPwm.js'
import net from '../dxmodules/dxNet.js'
import common from '../dxmodules/dxCommon.js'
import config from '../dxmodules/dxConfig.js'
import ntp from '../dxmodules/dxNtp.js'
import utils from './common/utils/utils.js'
import mqtt from '../dxmodules/dxMqtt.js'
import gpio from '../dxmodules/dxGpio.js'
import face from '../dxmodules/dxFace.js'
import alsa from '../dxmodules/dxAlsa.js'
import webserver from '../dxmodules/dxWebserver.js'
import mqttService from './service/mqttService.js'
import sqliteService from './service/sqliteService.js'
const driver = {}

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

driver.sqlite = {
    init: function () {
        std.ensurePathExists('/app/data/db/')
        sqliteService.init('/app/data/db/app.db')
    }
}

driver.gpio = {
    RELAY1: 44,
    RELAY2: 84,
    init: function () {
        gpio.init()
        // 继电器1
        gpio.request(this.RELAY1)
        // 继电器2
        gpio.request(this.RELAY2)
    },
    open: function (which) {
        // 判断开门模式
        let openMode = config.get("doorInfo.openMode")
        // 缺省正常模式
        openMode = (utils.isEmpty(openMode) || openMode == "") ? 0 : openMode
        // 常闭不允许开
        if (openMode == 2) {
            log.info("常闭模式不允许开门")
            return
        } else if (openMode == 0) {
            // 正常模式
            let openTime = config.get("doorInfo.openTime")
            openTime = (utils.isEmpty(openTime) || openTime == "") ? 2000 : openTime
            switch (which) {
                case 1:
                    gpio.setValue(this.RELAY1, 1)
                    break;
                case 2:
                    gpio.setValue(this.RELAY2, 1)
                    break;
                default:
                    break;
            }
            os.setTimeout(() => {
                driver.gpio.close(1)
                driver.gpio.close(2)
            }, openTime);
        }
    },
    close: function (which) {
        // 判断开门模式
        let openMode = config.get("doorInfo.openMode")
        // 缺省正常模式
        openMode = (utils.isEmpty(openMode) || openMode == "") ? 0 : openMode
        // 常开不允许关
        if (openMode == 1) {
            log.info("常开模式不允许关门")
            return
        }
        switch (which) {
            case 1:
                gpio.setValue(this.RELAY1, 0)
                break;
            case 2:
                gpio.setValue(this.RELAY2, 0)
                break;
            default:
                break;
        }
    }
}


driver.alsa = {
    init: function () {
        // 音频初始化
        alsa.init()
    },
    play: function (src) {
        // 播放指定路径下的音频
        alsa.play(src)
    },
    ttsPlay: function (text) {
        alsa.ttsPlay(text)
    },
    volume: function (volume) {
        if (utils.isEmpty(volume) || typeof volume != 'number') {
            return alsa.getVolume()
        } else {
            alsa.setVolume(volume)
        }
    }
}

driver.pwm = {
    init: function () {
        // 初始化红外
        pwm.request(4);
        pwm.setPeriodByChannel(4, 366166)
        pwm.enable(4, true);
        this.luminance(100)
    },
    // 调节亮度,0-100
    luminance: function (value) {
        if (value < 0 || value > 100) {
            log.error("[driver.pwm]: value should be between 0 and 100")
            return
        }
        pwm.setDutyByChannel(4, 366166 * value / 255)
    },
}

driver.net = {
    init: function () {
        let dns = "218.4.4.4,218.2.2.2".split(",")
        net.worker.beforeLoop({
            type: 1, dhcp: net.DHCP.DYNAMIC, ip: null, gateway: "192.168.60.1", netmask: "255.255.255.0", dns0: dns[0], dns1: dns[1], macAddr: common.getUuid2mac()
        })
    },
    loop: function () {
        net.worker.loop()
    }
}

driver.ntp = {
    loop: function () {
        if (!this.inited) {
            ntp.beforeLoop()
            this.inited = true
        }
        ntp.loop()
    }
}

driver.mqtt = {
    init: function () {
        mqtt.run({ mqttAddr: "tcp://192.168.60.166:1883", clientId: config.get('mqttInfo.clientId'), subs: mqttService.getTopics() })
    },
    send: function (topic, payload) {
        mqtt.send(topic, payload)
    }
}

driver.capturer = {
    options1: { id: "rgb", path: "/dev/video3", width: 1280, height: 720, preview_width: 1020, preview_height: 600, preview_mode: 2, preview_screen_index: 0 },
    options2: { id: "nir", path: "/dev/video0", width: 800, height: 600, preview_width: 150, preview_height: 200, preview_mode: 1, preview_screen_index: 1 },
    init: function () {
        capturer.worker.beforeLoop(this.options1)
        capturer.worker.beforeLoop(this.options2)
    },
    loop: function () {
        capturer.worker.loop(this.options1)
        capturer.worker.loop(this.options2)
    }
}

driver.webserver = {
    init: function () {
        webserver.init('http://0.0.0.0:8060', '/vgapp/webpage')
        // 注册接口
        webserver.rgisterCallback("/login")
        webserver.rgisterCallback("/control")
        webserver.rgisterCallback("/getConfig")
        webserver.rgisterCallback("/setConfig")
        webserver.rgisterCallback("/insertPermission")
        webserver.rgisterCallback("/getPermission")
        webserver.rgisterCallback("/delPermission")
        webserver.rgisterCallback("/clearPermission")
        webserver.rgisterCallback("/insertUser")
        webserver.rgisterCallback("/getUser")
        webserver.rgisterCallback("/delUser")
        webserver.rgisterCallback("/clearUser")
        webserver.rgisterCallback("/insertKey")
        webserver.rgisterCallback("/getKey")
        webserver.rgisterCallback("/delKey")
        webserver.rgisterCallback("/clearKey")
        webserver.rgisterCallback("/findRecords")
        webserver.rgisterCallback("/deleteRecords")
    }
}

driver.face = {
    init: function () {
        let options = {
            dbPath: "/vgmj.db",
            rgbPath: "/dev/video3",
            nirPath: "/dev/video0",
            capturerRgbId: "rgb",
            capturerNirId: "nir",
            score: 0.6,
            mapPath: "/app/path.txt",
            // 保存完整人脸照片路径
            saveFacePath: "/app/code/resource/image/face_whole.jpg",
            // 保存人脸缩略图照片路径
            saveFaceThumbnailPath: "/app/code/resource/image/face_thumb.jpg"
        }
        face.worker.beforeLoop(options)
        this.mode(0)
        this.status(false)
        // 定时器拉屏幕亮度，防止熄屏
        utils.setInterval(() => {
            let displayBrightness = config.get("sysInfo.displayBrightness")
            displayBrightness = (utils.isEmpty(displayBrightness) || displayBrightness == "") ? 100 : displayBrightness
            face.setDisplayBacklight(displayBrightness)
        }, 10 * 1000, true)
    },
    loop: function () {
        face.worker.loop()
    },
    // 0 人脸识别模式；1 人脸注册模式
    mode: function (value) {
        face.setRecgMode(value)
    },
    status: function (flag) {
        face.faceSetEnable(flag)
    },
    reg: function (id, data) {
        return face.addFaceFeatures(id, data);
    },
    clean: function () {
        // 清空人脸，需要在初始化人脸组件之前才能执行，否则报错
        face.faceFeaturesClean()
        common.systemBrief("rm -rf /vgmj.db")
        return !std.exist("/vgmj.db")
    },
    delete: function (userId) {
        return face.deleteFaceFeatures(userId)
    }
}

driver.init = function () {
    driver.config.init()
    driver.sqlite.init()
    driver.gpio.init()
    driver.alsa.init()
    driver.net.init()
    driver.pwm.init()
    driver.capturer.init()
    driver.face.init()
    driver.mqtt.init()
    driver.webserver.init()
}

driver.loop = function () {
    driver.net.loop()
    driver.ntp.loop()
    driver.face.loop()
}

export default driver
