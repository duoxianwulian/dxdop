import dxui from '../../dxmodules/dxUi.js'
import viewUtils from './viewUtils.js'
import menuView from './menuView.js'
import passwordView from './passwordView.js'
import utils from '../common/utils/utils.js'
const mainView = {}
mainView.init = function () {
    /**************************************************创建屏幕*****************************************************/
    let screenMain = dxui.View.build('mainView', dxui.Utils.LAYER.MAIN)
    mainView.screenMain = screenMain
    screenMain.scroll(false)
    screenMain.bgOpa(0)
    screenMain.on(dxui.Utils.EVENT.CLICK, homeClick)
    screenMain.on(dxui.Utils.ENUM.LV_EVENT_SCREEN_LOADED, () => {
        // 更新页面时间
        mainView.timer = utils.setInterval(() => {
            let t = utils.getDateTime();
            mainView.date.text(`${t.day} ${t.monthTextEn} ${t.year} ${t.hours}:${t.minutes}:${t.seconds}`)
        }, 1000, true)
    })
    screenMain.on(dxui.Utils.ENUM.LV_EVENT_SCREEN_UNLOADED, () => {
        utils.clearInterval(mainView.timer)
    })

    // 人脸追踪框
    let trackBox = dxui.Line.build(screenMain.id + 'trackBox', screenMain)
    mainView.trackBox = trackBox
    trackBox.lineColor(0x3F85FF)
    trackBox.lineWidth(8)
    trackBox.hide()

    // 上边栏
    let top = viewUtils.top(screenMain)
    mainView.top = top

    // 菜单框
    let menu = viewUtils.menu(screenMain)
    mainView.menu = menu

    // 上边栏2（透明）
    let topCont = dxui.View.build(top.id + 'topCont', top)
    mainView.topCont = topCont
    viewUtils._clearStyle(topCont)
    topCont.setSize(menu.width(), 50)
    topCont.alignTo(menu, dxui.Utils.ALIGN.OUT_TOP_MID, 0, -30)
    topCont.bgOpa(0)
    topCont.flexFlow(dxui.Utils.FLEX_FLOW.ROW)
    topCont.flexAlign(dxui.Utils.FLEX_ALIGN.SPACE_BETWEEN, dxui.Utils.FLEX_ALIGN.CENTER, dxui.Utils.FLEX_ALIGN.CENTER)

    // 日期
    let date = dxui.Label.build(topCont.id + 'date', topCont)
    mainView.date = date
    date.text("22 April 2020 15:36")
    date.textColor(0xffffff)
    date.textFont(viewUtils.font24)
    date.padLeft(10)
    date.update()

    // 图标集合
    let icons = dxui.View.build(topCont.id + 'icons', topCont)
    viewUtils._clearStyle(icons)
    icons.setSize(menu.width() - date.width(), 50)
    icons.bgOpa(0)
    icons.flexFlow(dxui.Utils.FLEX_FLOW.ROW)
    icons.flexAlign(dxui.Utils.FLEX_ALIGN.END, dxui.Utils.FLEX_ALIGN.CENTER, dxui.Utils.FLEX_ALIGN.CENTER)
    icons.padRight(10)

    let eth = dxui.Image.build(icons.id + "eth", icons)
    mainView.eth = eth
    eth.source('/app/code/resource/image/eth_enable.png')
    eth.hide()
    let mqtt = dxui.Image.build(icons.id + "mqtt", icons)
    mainView.mqtt = mqtt
    mqtt.source('/app/code/resource/image/mqtt_enable.png')
    mqtt.hide()
    // let tcp = dxui.Image.build(icons.id + "tcp", icons)
    // tcp.source('/app/code/resource/image/tcp_enable.png')
    // let bt = dxui.Image.build(icons.id + "bt", icons)
    // bt.source('/app/code/resource/image/bt_enable.png')
    // let wifi = dxui.Image.build(icons.id + "wifi", icons)
    // wifi.source('/app/code/resource/image/wifi_enable.png')

    // 菜单按钮
    let w1 = menu.width() - 100
    let h1 = menu.height() / 3 - 100
    // 人脸
    let menuFaceBtn = dxui.Button.build(menu.id + 'menuFaceBtn', menu)
    menuFaceBtn.obj.lvObjAddFlag(dxui.Utils.GG.NativeEnum.LV_OBJ_FLAG_CHECKABLE);
    mainView.menuFaceBtn = menuFaceBtn
    viewUtils.menuItemBtnStyle(menuFaceBtn, '/app/code/resource/image/home.png', "人脸主页", viewUtils.font36, 0xE12E2E, 0xD32C2C, w1, h1, 100, 75)
    menuFaceBtn.on(dxui.Utils.EVENT.VALUE_CHANGED, toggleHome)
    // 密码
    let menuPwdBtn = dxui.Button.build(menu.id + 'menuPwdBtn', menu)
    mainView.menuPwdBtn = menuPwdBtn
    viewUtils.menuItemBtnStyle(menuPwdBtn, '/app/code/resource/image/password.png', "密码通行", viewUtils.font36, 0x46B146, 0x3DA13D, w1, h1, 100, 75)
    mainView.menuPwdBtn.on(dxui.Utils.EVENT.CLICK, () => dxui.loadMain(passwordView.screenMain))
    // 功能
    let menuFuncsBtn = dxui.Button.build(menu.id + 'menuFuncsBtn', menu)
    mainView.menuFuncsBtn = menuFuncsBtn
    viewUtils.menuItemBtnStyle(menuFuncsBtn, '/app/code/resource/image/settings.png', "功能菜单", viewUtils.font36, 0x4C55C4, 0x464EB1, w1, h1, 100, 75)
    mainView.menuFuncsBtn.on(dxui.Utils.EVENT.CLICK, () => dxui.loadMain(menuView.screenMain))

    // 下边栏
    let bottomCont = dxui.View.build(screenMain.id + 'bottomCont', screenMain)
    mainView.bottomCont = bottomCont
    viewUtils._clearStyle(bottomCont)
    bottomCont.setSize(menu.width(), 50)
    bottomCont.alignTo(menu, dxui.Utils.ALIGN.OUT_BOTTOM_MID, 0, 30)
    bottomCont.radius(20)
    viewUtils.shadowStyle(bottomCont)
    bottomCont.textFont(viewUtils.font20)
    bottomCont.flexFlow(dxui.Utils.FLEX_FLOW.ROW)
    bottomCont.flexAlign(dxui.Utils.FLEX_ALIGN.SPACE_BETWEEN, dxui.Utils.FLEX_ALIGN.CENTER, dxui.Utils.FLEX_ALIGN.CENTER)

    // sn
    let sn = dxui.Label.build(bottomCont.id + 'sn', bottomCont)
    sn.text("SN:GDSKJLKNOSN64456651")
    sn.padLeft(10)

    // ip
    let ip = dxui.Label.build(bottomCont.id + 'ip', bottomCont)
    ip.text("IP:192.168.120.178")
    ip.padRight(10)
}

function homeClick() {
    mainView.menuFaceBtn.clearState(dxui.Utils.STATE.CHECKED)
    mainView.menuFaceBtn.send(dxui.Utils.ENUM.LV_EVENT_VALUE_CHANGED)
    toggleHome()
}

function toggleHome() {
    let flag = mainView.menuFaceBtn.obj.hasState(dxui.Utils.STATE.CHECKED)
    if (flag) {
        mainView.menu.hide()
        mainView.topCont.setSize(mainView.screenMain.width(), 50)
        mainView.topCont.align(dxui.Utils.ALIGN.TOP_MID, 0, 0)

        mainView.bottomCont.setSize(mainView.screenMain.width(), 50)
        mainView.bottomCont.align(dxui.Utils.ALIGN.BOTTOM_MID, 0, 0)
        mainView.bottomCont.radius(0)
        viewUtils.clearShadowStyle(mainView.bottomCont)

        mainView.top.bgOpa(0)
    } else {
        mainView.menu.show()
        mainView.topCont.setSize(mainView.menu.width(), 50)
        mainView.topCont.alignTo(mainView.menu, dxui.Utils.ALIGN.OUT_TOP_MID, 0, -30)

        mainView.bottomCont.setSize(mainView.menu.width(), 50)
        mainView.bottomCont.alignTo(mainView.menu, dxui.Utils.ALIGN.OUT_BOTTOM_MID, 0, 30)
        mainView.bottomCont.radius(20)
        viewUtils.shadowStyle(mainView.bottomCont)

        mainView.top.bgOpa(100)
    }
}



export default mainView