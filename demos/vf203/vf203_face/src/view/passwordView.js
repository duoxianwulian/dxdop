import dxui from '../../dxmodules/dxUi.js'
import viewUtils from './viewUtils.js'
import mainView from './mainView.js'
import utils from '../common/utils/utils.js'
const passwordView = {}
passwordView.init = function () {
    /**************************************************创建屏幕*****************************************************/
    let screenMain = dxui.View.build('passwordView', dxui.Utils.LAYER.MAIN)
    passwordView.screenMain = screenMain
    screenMain.scroll(false)
    screenMain.bgOpa(0)
    screenMain.on(dxui.Utils.ENUM.LV_EVENT_SCREEN_LOADED, () => {
        // 60秒超时返回
        passwordView.timer = utils.setInterval(() => {
            let countdown = parseInt(passwordView.countdown.text())
            countdown--
            if (countdown < 0) {
                dxui.loadMain(mainView.screenMain)
                return
            }
            if (countdown < 10) {
                countdown = "0" + countdown
            }
            passwordView.countdown.text(countdown + "")
        }, 1000)
    })
    screenMain.on(dxui.Utils.ENUM.LV_EVENT_SCREEN_UNLOADED, () => {
        passwordView.input.text("")
        passwordView.input.scrollToX(1)
        passwordView.countdown.text("60")
        utils.clearInterval(passwordView.timer)
    })

    // 上边栏
    let top = viewUtils.top(screenMain)

    // 菜单框
    let menu = viewUtils.menu(screenMain)
    menu.hide()

    // 上边栏2（透明）
    let topCont = dxui.View.build(top.id + 'topCont', top)
    viewUtils._clearStyle(topCont)
    topCont.setSize(menu.width(), 50)
    topCont.alignTo(menu, dxui.Utils.ALIGN.OUT_TOP_MID, 0, -30)
    topCont.bgOpa(0)

    // 返回图标容器
    let backBox = dxui.View.build(topCont.id + 'backBox', topCont)
    viewUtils._clearStyle(backBox)
    passwordView.backBox = backBox
    backBox.setSize(50, 50)
    backBox.bgOpa(0)
    backBox.on(dxui.Utils.EVENT.CLICK, () => dxui.loadMain(mainView.screenMain))

    // 返回图标
    let backIcon = dxui.Image.build(backBox.id + 'backIcon', backBox)
    backIcon.source('/app/code/resource/image/back.png')
    backIcon.align(dxui.Utils.ALIGN.CENTER, 0, 0)

    // 标题
    let title = dxui.Label.build(topCont.id + 'title', topCont)
    title.text("密码通行")
    title.textColor(0xffffff)
    title.textFont(viewUtils.font32)
    title.align(dxui.Utils.ALIGN.CENTER, 0, 0)

    // 输入框
    let input = dxui.Textarea.build(screenMain.id + 'input', screenMain)
    passwordView.input = input
    input.setOneLine(true)
    input.width(250)
    input.radius(50)
    input.textFont(viewUtils.font32)
    input.setMaxLength(32)
    input.setPasswordMode(true)
    input.setAlign(dxui.Utils.TEXT_ALIGN.CENTER)
    input.alignTo(topCont, dxui.Utils.ALIGN.OUT_BOTTOM_MID, 0, 100)

    // 倒计时
    let countdown = dxui.Label.build(screenMain.id + 'countdown', screenMain)
    passwordView.countdown = countdown
    countdown.alignTo(topCont, dxui.Utils.ALIGN.OUT_BOTTOM_MID, 0, 50)
    countdown.textFont(viewUtils.font32)
    countdown.textColor(0xffffff)
    countdown.text("60")

    // 密码按钮
    let keys = dxui.Buttons.build(screenMain.id + 'keys', screenMain)
    passwordView.keys = keys
    keys.setSize(screenMain.width(), screenMain.height() - top.height())
    keys.align(dxui.Utils.ALIGN.BOTTOM_MID, 0, 0)
    keys.data(["1", "2", "3", "\n",
        "4", "5", "6", "\n",
        "7", "8", "9", "\n",
        "取消", "0", "确认", ""])
    keys.padAll(25, dxui.Utils.ENUM._LV_STYLE_STATE_CMP_SAME)
    keys.obj.lvObjSetStylePadGap(20, dxui.Utils.ENUM._LV_STYLE_STATE_CMP_SAME)
    keys.radius(20, dxui.Utils.STYLE_PART.ITEMS)
    keys.bgColor(0x437fc9, dxui.Utils.STYLE_PART.ITEMS)
    keys.textColor(0xFFFFFF, dxui.Utils.STYLE_PART.ITEMS)
    keys.textFont(viewUtils.font36)
}
export default passwordView