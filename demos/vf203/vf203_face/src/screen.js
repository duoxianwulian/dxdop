import * as os from "os"
import config from '../dxmodules/dxConfig.js'
import dxui from '../dxmodules/dxUi.js'
import mainView from './view/mainView.js'
import passwordView from './view/passwordView.js'
import menuView from './view/menuView.js'
import registerView from './view/registerView.js'
import viewUtils from './view/viewUtils.js'
import utils from './common/utils/utils.js'
import driver from "./driver.js"
const screen = {}

// ui上下文
let context = {}

screen.init = function () {
    dxui.init({ orientation: 1 }, context);
    // 初始化所有组件
    mainView.init()
    passwordView.init()
    menuView.init()
    registerView.init()
    // 注册事件
    eventRegister()
    dxui.loadMain(mainView.screenMain)
}

// 注册事件，所有涉及业务的ui事件
function eventRegister() {
    // 密码按键回调
    passwordView.keys.on(dxui.Utils.ENUM.LV_EVENT_PRESSED, passwordCb)
    // 进入人脸主页时开启人脸检测，否则关闭人脸检测
    mainView.menuFaceBtn.on(dxui.Utils.ENUM.LV_EVENT_VALUE_CHANGED, () => {
        let flag = mainView.menuFaceBtn.obj.hasState(dxui.Utils.STATE.CHECKED)
        driver.face.status(flag)
    })
    // 人员注册->开始注册按钮
    registerView.regBtn.on(dxui.Utils.EVENT.CLICK, () => {
        if (registerView.regInput.input.text().length == 0) {
            viewUtils.popNote("请先填写用户ID", 0xE12E2E)
            registerView.regInput.box1.setBorderColor(0xE12E2E)
        } else {
            driver.face.mode(1)
            driver.face.status(true)
            registerView.panel.hide()
            registerView.top.bgOpa(0)
        }
    })
    // 人员注册->删除人员按钮
    registerView.delBtn.on(dxui.Utils.EVENT.CLICK, () => {
        if (registerView.delInput.input.text().length == 0) {
            viewUtils.popNote("请先填写用户ID", 0xE12E2E)
            registerView.delInput.box1.setBorderColor(0xE12E2E)
        } else {
            let ret = driver.face.delete(registerView.delInput.input.text())
            if (ret) {
                viewUtils.popNote("删除成功", 0x46B146)
            } else {
                viewUtils.popNote("删除失败", 0xE12E2E)
            }
        }
    })
    // 人员注册界面返回，关闭注册模式，切换人脸识别模式
    registerView.screenMain.on(dxui.Utils.ENUM.LV_EVENT_SCREEN_UNLOADED, () => {
        driver.face.mode(0)
        driver.face.status(false)
        registerView.panel.show()
        registerView.top.bgOpa(100)
    })
    // 配置->清空人脸信息
    if (config.get("sysInfo.faceRecgEnable") != 1) {
        registerView.clearBtn.disable(true)
    }
    // 人员注册->清空人脸按钮
    registerView.clearBtn.on(dxui.Utils.EVENT.CLICK, () => {
        let ret = driver.face.clean()
        if (ret) {
            viewUtils.popNote("清空成功", 0x46B146)
        } else {
            viewUtils.popNote("清空失败", 0xE12E2E)
        }
    })
}

function passwordCb() {
    let btnData = passwordView.keys.clickedButton()
    if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(btnData.text)) {
        passwordView.input.lvTextareaAddText(btnData.text)
        return
    } else if (btnData.text == "确认") {
    } else if (btnData.text == "取消") {
    }
    dxui.loadMain(mainView.screenMain)
}

// 人脸注册结果：成功true/失败false
screen.regResult = function (flag) {
    if (flag) {
        dxui.loadMain(menuView.screenMain)
    } else {
        registerView.panel.show()
        registerView.top.bgOpa(100)
    }
}

// ui 是否处于人脸注册模式
screen.regStatus = function () {
    return registerView.panel.isHide()
}

// ui 人员ID获取
screen.getPersonID = function () {
    return registerView.regInput.input.text()
}

screen.popNote = function (...args) {
    viewUtils.popNote(...args)
}

screen.ethStatus = function (flag) {
    if (flag) {
        mainView.eth.show()
    } else {
        mainView.eth.hide()
    }
}

screen.mqttStatus = function (flag) {
    if (flag) {
        mainView.mqtt.show()
    } else {
        mainView.mqtt.hide()
    }
}

let timer
screen.track = function (points) {
    mainView.trackBox.setPoints(points, points.length)
    mainView.trackBox.show()
    if (timer) {
        os.clearTimeout(timer)
        timer = null
    }
    timer = os.setTimeout(() => {
        mainView.trackBox.hide()
    }, 1000)
}

screen.exit = function () {
    // 清除弹出通知
    viewUtils.clearPopNote()
    // 删除所有注册方法
    for (const key in dxui.all) {
        if (Object.hasOwnProperty.call(dxui.all, key) && dxui.all[key].ClassId) {
            dxui.all[key].removeEventCb()
        }
    }
}

screen.loop = function () {
    return dxui.handler()
}

export default screen
