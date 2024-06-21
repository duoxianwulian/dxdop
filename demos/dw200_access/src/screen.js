import dxui from '../dxmodules/dxUi.js'
import mainView from './view/mainView.js'
import passwordView from './view/passwordView.js'
import popWin from './view/popWin.js'
// import wpc from '../dxmodules/dxWpc.js'
import log from '../dxmodules/dxLogger.js'
import pwm from '../dxmodules/dxPwm.js'
import config from '../dxmodules/dxConfig.js'
import std from '../dxmodules/dxStd.js'
import dxNet from '../dxmodules/dxNet.js'
import queueCenter from './queueCenter.js'
import utils from './common/utils/utils.js'
import driver from './driver.js'
import center from '../dxmodules/dxEventCenter.js'

const screen = {}

// 系统当前时间戳
let currentTimeMillis = new Date().getTime()
let passwordArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
// 键盘密码记录
let password = ""
// 密码线段
let linePoints = [[0, 0]]
let linePointsHor = (function () {
    let arr = [[0, 0]]
    for (let i = 1; i <= 14; i++) {
        if (i <= 4) {
            arr.push([480 / 4 * i, 0])
        } else if (i <= 7) {
            arr.push([480, 320 / 3 * (i - 4)])
        } else if (i <= 11) {
            arr.push([480 - 480 / 4 * (i - 7), 320])
        } else if (i <= 14) {
            arr.push([0, 320 - 320 / 3 * (i - 11)])
        }
    }
    return arr
})();
let linePointsVer = (function () {
    let arr = [[0, 0]]
    for (let i = 1; i <= 14; i++) {
        if (i <= 3) {
            arr.push([320 / 3 * i, 0])
        } else if (i <= 7) {
            arr.push([320, 480 / 4 * (i - 3)])
        } else if (i <= 10) {
            arr.push([320 - 320 / 3 * (i - 7), 480])
        } else if (i <= 14) {
            arr.push([0, 480 - 480 / 4 * (i - 10)])
        }
    }
    return arr
})();

// 当前是否处于密码界面
let isInPassword = false

// ui上下文
let context = {}

screen.init = function () {
    let dir = config.get('uiInfo.rotation')
    if (![0, 1, 2, 3].includes(dir)) {
        dir = 1
    }
    dxui.init({ orientation: dir }, context);
    mainView.init(context)
    passwordView.init(context)
    popWin.init(context)
    dxui.loadMain(mainView.screen_main)

    // 初始化用户配置
    let devname = config.get("sysInfo.devname")
    mainView.screen_label_company.text(utils.isEmpty(devname) ? "苏州酷豆物联sdfsdfsdfsfdsfsdf" : devname)
    mainView.bottom_sn.text(config.get("uiInfo.sn_show") != 1 ? ' ' : "SN: " + config.get("sysInfo.sn"))
    mainView.screen_btn_unlocking_label.text(config.get("uiInfo.language") == "EN" ? "OPEN" : "开锁")
    showStatusBar(config.get("uiInfo.statusBar") === 0 ? 0 : 1)
    let sn_show = utils.isEmpty(config.get("uiInfo.sn_show")) ? 1 : config.get("uiInfo.sn_show")
    showSn(sn_show)

    screen.onEvent()
    rotate(dir)
    setFont({
        fontPath: config.get("uiInfo.defaultFont"),
        color: config.get("uiInfo.defaultFontColor")
    })
    setBg(config.get("uiInfo.rotation" + dir + "BgImage", ""))
}

screen.initService = function () {
    // wpc.register('displayResults', displayResults)
    // wpc.register('rotate', rotate)
    // wpc.register('setFont', setFont)
    // wpc.register('setBg', setBg)
    // wpc.register('setDevName', setDevName)
    // wpc.register('warning', warning)
    // wpc.register('showMsg', showMsg)
    // wpc.register('showPic', showPic)
    // wpc.register('netStatusChange', netStatusChange)
    // wpc.register('mqttConnectedChange', mqttConnectedChange)
    // wpc.register('showStatusBar', showStatusBar)
    // wpc.register('showSn', showSn)
    // wpc.register('showIp', showIp)
    center.on('displayResults', function (data) {
        displayResults(data)
    }, 'screen')
    center.on('rotate', function (data) {
        rotate(data)
    }, 'screen')
    center.on('setFont', function (data) {
        setFont(data)
    }, 'screen')
    center.on('setBg', function (data) {
        setBg(data)
    }, 'screen')
    center.on('setDevName', function (data) {
        setDevName(data)
    }, 'screen')
    center.on('warning', function (data) {
        warning(data)
    }, 'screen')
    center.on('showMsg', function (data) {
        showMsg(data)
    }, 'screen')
    center.on('showPic', function (data) {
        showPic(data)
    }, 'screen')
    center.on('netStatusChange', function (data) {
        netStatusChange(data)
    }, 'screen')
    center.on('displayResults', function (data) {
        displayResults(data)
    }, 'screen')
    center.on('mqttConnectedChange', function (data) {
        mqttConnectedChange(data)
    }, 'screen')
    center.on('showStatusBar', function (data) {
        showStatusBar(data)
    }, 'screen')
    center.on('showSn', function (data) {
        showSn(data)
    }, 'screen')
    center.on('showIp', function (data) {
        showIp(data)
    }, 'screen')
}

// 注册事件
screen.onEvent = function () {
    // 注册开锁事件
    mainView.screen_btn_unlocking.on(dxui.Utils.EVENT.CLICK, () => {
        dxui.loadMain(passwordView.screen_password)
        isInPassword = true
        driver.pwm.press()
    })
    // 注册密码键盘事件
    passwordView.password_btnm.on(dxui.Utils.EVENT.CLICK, () => {
        let txt = passwordView.password_btnm.clickedButton().text;
        log.info("点击的按键：" + txt);
        // 最多输入14位
        if (password.length >= 14) {
            password = ""
        }
        if (passwordArray.includes(txt)) {
            password += txt
            log.info("输入的密码: " + password);
        } else if (txt == "确认" || txt == "CFM") {
            if (!password) {
                password = "-1"
            }
            // 密码校验
            queueCenter.push("access", { type: 400, code: password });
            password = ""
            isInPassword = false
            dxui.loadMain(mainView.screen_main)
        } else if (txt == "取消" || txt == "CL") {
            password = ""
            isInPassword = false
            dxui.loadMain(mainView.screen_main)
        }
        let passwordLen = password.length
        if (passwordLen == 0) {
            passwordView.password_line.hide()
        } else {
            passwordView.password_line.show()
        }
        passwordView.password_line.setPoints(linePoints, passwordLen + 1);
        driver.pwm.press()
    })
}

// 记录打开密码界面的时间
let openPasswordTime = currentTimeMillis
// 比对旧密码，是否有点击界面造成密码更改
let oldPassword = ""
// 判断密码无操作返回主界面
function packToHome() {
    if (isInPassword) {
        if (oldPassword == password) {
            if (currentTimeMillis - openPasswordTime > 10000) {
                // 密码无操作10秒，跳回主界面
                isInPassword = false
                password = ""
                oldPassword = ""
                passwordView.password_line.hide()
                dxui.loadMain(mainView.screen_main)
            }
        } else {
            openPasswordTime = currentTimeMillis
            oldPassword = password
        }
    } else {
        openPasswordTime = currentTimeMillis
    }
}

/**
 * 显示弹窗
 * @param {*} param param.flag:true|false成功|失败；param.type:类型
 * @returns 
 */
function displayResults(param) {
    if (!param) {
        return
    }
    let res = "失败"
    // 除非language为EN,否则默认中文
    let isEn = config.get("uiInfo.language") == "EN"
    if (isEn) {
        res = param.flag ? "success" : "fail"
    } else {
        res = param.flag ? "成功" : "失败"
    }
    let msg = ""
    switch (parseInt(param.type)) {
        case 100:
        case 101:
        case 103:
            msg = (isEn ? "code " : "扫码通行")
            break;
        case 200:
            msg = (isEn ? "card " : "刷卡通行")
            break;
        case 400:
            msg = (isEn ? "password " : "密码通行")
            break;
        case 500:
            msg = (isEn ? "online verification" : "在线验证")
            break;
        case 600:
            msg = (isEn ? "bluetooth " : "蓝牙通行")
            break;
        case 800:
            msg = (isEn ? "push button " : "按键通行")
            break;
        case 900:
            msg = (isEn ? "remote " : "远程开门")
            break;
        default:
            break;
    }
    msg += res
    popResult(param.flag, msg, 2000)
}

function showMsg(param) {
    if (!param) {
        return
    }
    let msg = param.msg
    let time = param.time
    popResult(null, msg, time)
}
function warning(param) {
    if (!param) {
        return
    }
    let msg = param.msg
    let time = param.time
    popResult(param.flag, msg, time)
}


function showPic(param) {
    if (!param) {
        return
    }
    let time = param.time
    let path = param.path
    popResult(null, null, time, path)
}


function netStatusChange(data) {
    if (data.connected) {
        mainView.top_net.source('/app/code/resource/image/eth_enable.png')
        let ip_show = utils.isEmpty(config.get('uiInfo.ip_show')) ? 1 : config.get('uiInfo.ip_show')
        mainView.bottom_ip.text(ip_show != 1 ? ' ' : "IP: " + dxNet.getModeByCard(dxNet.TYPE.ETHERNET).param.ip)
    } else {
        mainView.top_net.source('/app/code/resource/image/eth_disable.png')
        mainView.bottom_ip.text(" ")
    }
}

function mqttConnectedChange(data) {
    if (data == "connected") {
        mainView.top_mqtt.show()
    } else if (data == "disconnected") {
        mainView.top_mqtt.hide()
    }
}

function showStatusBar(data) {
    if (data) {
        mainView.bottom_cont.show()
    } else {
        mainView.bottom_cont.hide()
    }
}

function showSn(data) {
    if (data) {
        mainView.bottom_sn.text("SN: " + config.get('sysInfo.sn'))
    } else {
        mainView.bottom_sn.text(' ')

    }
}

function showIp(data) {
    if (data) {
        mainView.bottom_ip.text("IP: " + config.get('netInfo.ip'))
    } else {
        mainView.bottom_ip.text(" ")
    }
}
function setDevName(data) {
    if (!data) {
        return
    }
    mainView.screen_label_company.text(utils.isEmpty(data) ? "苏州酷豆物联" : data)
    mainView.screen_label_company.longMode(dxui.Utils.LABEL_LONG_MODE.SCROLL_CIRCULAR)
}

// 旋转屏幕
function rotate(dir) {
    if (![0, 1, 2, 3].includes(dir)) {
        return
    }
    let language = config.get("uiInfo.language")
    dxui.init({ orientation: dir }, context);
    if (dir == 0 || dir == 2) {
        // 竖屏
        mainView.screen_img.source("/app/code/resource/image/background.png")
        mainView.top_cont.setSize(320, 28)
        mainView.bottom_cont.setSize(320, 28)
        mainView.bottom_sn.setSize(160 - 5, 28);
        mainView.bottom_ip.setSize(160 - 5, 28);
        passwordView.password_btnm.setSize(320, 480)
        passwordView.password_btnm.data([
            "1", "2", "3", "\n",
            "4", "5", "6", "\n",
            "7", "8", "9", "\n",
            (language == "EN" ? "CL" : "取消"), "0", (language == "EN" ? "CFM" : "确认"), ""
        ]);
        popWin.center_background.setSize(320, 480)
        popWin.center_cont.setSize(192, 192);
        popWin.center_bottom_view.setSize(192 - 10, 20);
        linePoints = linePointsVer
    } else {
        // 横屏
        mainView.screen_img.source("/app/code/resource/image/background_90.png")
        mainView.top_cont.setSize(480, 28)
        mainView.bottom_cont.setSize(480, 28)
        mainView.bottom_sn.setSize(240 - 5, 28);
        mainView.bottom_ip.setSize(240 - 5, 28);
        passwordView.password_btnm.setSize(480, 320)
        passwordView.password_btnm.data([
            "1", "2", "3", "0", "\n",
            "4", "5", "6", (language == "EN" ? "CL" : "取消"), "\n",
            "7", "8", "9", (language == "EN" ? "CFM" : "确认"), ""
        ]);
        popWin.center_background.setSize(480, 320)
        popWin.center_cont.setSize(288, 192);
        popWin.center_bottom_view.setSize(288 - 10, 20);
        linePoints = linePointsHor
    }
    popWin.center_cont.update()
    popWin.center_label.width(popWin.center_cont.width())
    popWin.center_img.alignTo(popWin.center_cont, dxui.Utils.ALIGN.OUT_TOP_MID, 0, 60);
    timeAlign()
}

function setFont(param) {
    if (!param) {
        return
    }
    let fontPath = param.fontPath
    let color = param.color
    let labels = [
        { obj: mainView.version, size: 12, style: dxui.Utils.FONT_STYLE.NORMAL },
        { obj: mainView.screen_label_time, size: 60, style: dxui.Utils.FONT_STYLE.NORMAL },
        { obj: mainView.screen_label_data, size: 30, style: dxui.Utils.FONT_STYLE.NORMAL },
        { obj: mainView.screen_label_company, size: 27, style: dxui.Utils.FONT_STYLE.NORMAL },
        { obj: mainView.screen_btn_unlocking_label, size: 30, style: dxui.Utils.FONT_STYLE.NORMAL },
        { obj: mainView.bottom_sn, size: 19, style: dxui.Utils.FONT_STYLE.NORMAL },
        { obj: mainView.bottom_ip, size: 19, style: dxui.Utils.FONT_STYLE.NORMAL },
        { obj: passwordView.password_btnm, size: 30, style: dxui.Utils.FONT_STYLE.NORMAL },
        { obj: popWin.center_label, size: 30, style: dxui.Utils.FONT_STYLE.NORMAL },
    ]
    for (let i = 0; i < labels.length; i++) {
        if (std.exist(fontPath) && fontPath != '/app/code/resource/font/PangMenZhengDaoBiaoTiTi-1.ttf') {
            labels[i].obj.textFont(dxui.Font.build(fontPath, labels[i].size, labels[i].style))
        }
        if (typeof color == 'string') {
            color = /^0[x|X][\d|a-f|A-F]{6}$/.test(color) ? parseInt(color) : null
        }
        if (color != null && color != undefined) {
            labels[i].obj.textColor(color)
            labels[i].obj.textColor(color, dxui.Utils.STYLE_PART.ITEMS)
        }
    }
}

function setBg(path) {
    if (std.exist(path)) {
        mainView.screen_img.source(path)
    }
}

// 记录关闭弹窗时间
let closePopWinTime = -1
function popResult(flag, msg, time, img) {
    closePopWinTime = currentTimeMillis + time
    popWin.center_label.text(msg)
    popWin.center_label.textAlign(dxui.Utils.TEXT_ALIGN.CENTER)

    if (img && std.exist(img)) {
        popWin.showPic.source(img)
        popWin.showPic.show()
    } else {
        popWin.showPic.hide()
        let fontColor = config.get("uiInfo.defaultFontColor")
        if (typeof fontColor == 'string') {
            fontColor = /^0[x|X][\d|a-f|A-F]{6}$/.test(fontColor) ? parseInt(fontColor) : null
        } else {
            fontColor = null
        }
        popWin.center_img.show()
        if (flag == true) {
            popWin.center_label.textColor((fontColor == null) ? 0x48DB8D : fontColor)
            popWin.center_bottom_view.bgColor(0x48DB8D)
            popWin.center_img.source('/app/code/resource/image/hint_true.png');
        } else if (flag == false) {
            popWin.center_label.textColor((fontColor == null) ? 0xFF5959 : fontColor)
            popWin.center_bottom_view.bgColor(0xFF5959)
            popWin.center_img.source('/app/code/resource/image/hint_false.png');
        } else if (flag == 'warning') {
            popWin.center_label.textColor((fontColor == null) ? 0xfbbc1a : fontColor)
            popWin.center_img.source('/app/code/resource/image/bell.png');
            popWin.center_bottom_view.bgColor(0xfbbc1a)
        } else {
            // 普通弹窗
            popWin.center_label.textColor((fontColor == null) ? 0x000000 : fontColor)
            popWin.center_bottom_view.bgColor(0x000000)
            popWin.center_img.hide()
        }
    }
    popWin.center_background.show()
}

// 定时关闭弹窗
function closePopWin() {
    if (closePopWinTime > 0 && currentTimeMillis >= closePopWinTime) {
        popWin.center_background.hide()
        closePopWinTime = -1
    }
}
// 只有分钟变化才刷新，降低刷新频率
let lastMinute = -1
// 刷新时间日期
function refreshTime(once) {
    let currentDate = new Date(currentTimeMillis);
    // 获取分钟
    let minutes = currentDate.getMinutes();
    if (minutes == lastMinute && !once) {
        return
    }
    lastMinute = minutes

    // 月份从0开始,所以要加1
    let month = currentDate.getMonth() + 1;
    // 获取日期
    let day = currentDate.getDate();
    // 获取小时
    let hours = currentDate.getHours();
    let dayOfWeek = currentDate.getDay();

    month = month.toString(10).padStart(2, '0')
    day = day.toString(10).padStart(2, '0')
    hours = hours.toString(10).padStart(2, '0')
    minutes = minutes.toString(10).padStart(2, '0')

    // 映射星期数字到文本
    let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let dayText = daysOfWeek[dayOfWeek];

    mainView.screen_label_time.text(`${hours}:${minutes}`)
    mainView.screen_label_data.text(`${dayText} ${month}-${day}`)

    timeAlign()
}

// 时间对齐
function timeAlign() {
    mainView.top_cont.update()
    if (mainView.top_cont.width() <= 320) {
        mainView.screen_label_time.align(dxui.Utils.ALIGN.TOP_MID, 0, 90)
    } else {
        mainView.screen_label_time.align(dxui.Utils.ALIGN.TOP_MID, 120, 30)
    }
    mainView.screen_label_data.alignTo(mainView.screen_label_time, dxui.Utils.ALIGN.OUT_BOTTOM_MID, 0, 0)
    mainView.screen_label_company.alignTo(mainView.screen_label_data, dxui.Utils.ALIGN.OUT_BOTTOM_MID, 0, 0)
}

screen.showVersion = function (version) {
    mainView.version.text(version)
    mainView.version.show()
}

screen.loop = function () {
    center.getEvent()
    // 刷新当前时间戳
    currentTimeMillis = new Date().getTime()
    // 判断密码无操作返回主界面
    packToHome()
    // 定时关闭弹窗
    closePopWin()
    // screen线程非组件线程，单独创建worker监听
    // wpc.loop('screen')
    // 刷新时间
    refreshTime()
    screen.initService()
    return dxui.handler()
}

export default screen
