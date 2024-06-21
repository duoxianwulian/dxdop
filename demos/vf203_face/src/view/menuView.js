import dxui from '../../dxmodules/dxUi.js'
import viewUtils from './viewUtils.js'
import mainView from './mainView.js'
import registerView from './registerView.js'
const menuView = {}
menuView.init = function () {
    /**************************************************创建屏幕*****************************************************/
    let screenMain = dxui.View.build('menuView', dxui.Utils.LAYER.MAIN)
    menuView.screenMain = screenMain
    screenMain.scroll(false)
    screenMain.bgOpa(0)
    screenMain.on(dxui.Utils.ENUM.LV_EVENT_SCREEN_UNLOADED, closeSearch)

    // 上边栏
    let top = viewUtils.top(screenMain)
    menuView.top = top

    // 菜单框
    let menu = viewUtils.menu(screenMain)
    menuView.menu = menu

    // 搜索框
    menu.padTop(120)
    let search = dxui.Textarea.build(screenMain.id + 'search', screenMain)
    menuView.search = search
    search.textFont(viewUtils.font24)
    search.width(menu.width() - 100)
    search.setOneLine(true)
    search.radius(50)
    search.padLeft(20)
    search.padRight(20)
    search.obj.lvTextareaSetPlaceholderText("搜索系统设置项")
    search.alignTo(menu, dxui.Utils.ALIGN.OUT_TOP_MID, 0, 100)
    search.on(dxui.Utils.EVENT.CLICK, openSearch)

    // 取消按钮
    let cancel = dxui.View.build(screenMain.id + 'cancel', screenMain)
    menuView.cancel = cancel
    viewUtils._clearStyle(cancel)
    let cancelText = dxui.Label.build(cancel.id + 'cancelText', cancel)
    cancelText.textFont(viewUtils.font24)
    cancelText.textColor(0x3F85FF)
    cancelText.text("取消")
    cancelText.padLeft(10)
    cancelText.update()
    cancel.setSize(cancelText.width(), cancelText.height())
    cancel.hide()
    cancel.on(dxui.Utils.EVENT.CLICK, closeSearch)

    // 搜索列表
    let list = dxui.List.build(menu.id + 'list', menu)
    menuView.list = list
    list.setSize(menu.width(), menu.contentHeight())
    list.textFont(viewUtils.font24)
    // list.addBtn(null, "123")
    list.hide()

    // 上边栏2（透明）
    let topCont = dxui.View.build(top.id + 'topCont', top)
    viewUtils._clearStyle(topCont)
    topCont.setSize(menu.width(), 50)
    topCont.alignTo(menu, dxui.Utils.ALIGN.OUT_TOP_MID, 0, -30)
    topCont.bgOpa(0)

    // 返回图标容器
    let backBox = dxui.View.build(topCont.id + 'backBox', topCont)
    viewUtils._clearStyle(backBox)
    menuView.backBox = backBox
    backBox.setSize(50, 50)
    backBox.bgOpa(0)
    backBox.on(dxui.Utils.EVENT.CLICK, () => dxui.loadMain(mainView.screenMain))

    // 返回图标
    let backIcon = dxui.Image.build(backBox.id + 'backIcon', backBox)
    backIcon.source('/app/code/resource/image/back.png')
    backIcon.align(dxui.Utils.ALIGN.CENTER, 0, 0)

    // 标题
    let title = dxui.Label.build(topCont.id + 'title', topCont)
    title.text("功能菜单")
    title.textColor(0xffffff)
    title.textFont(viewUtils.font32)
    title.align(dxui.Utils.ALIGN.CENTER, 0, 0)

    // 菜单按钮
    let w1 = menu.width() - 100
    let h1 = menu.height() / 5 - 50
    let basic = dxui.Button.build(menu.id + 'basic', menu)
    menuView.basic = basic
    let advance = dxui.Button.build(menu.id + 'advance', menu)
    menuView.advance = advance
    let register = dxui.Button.build(menu.id + 'register', menu)
    menuView.register = register
    register.on(dxui.Utils.EVENT.CLICK, () => {
        dxui.loadMain(registerView.screenMain)
    })
    let sysInfo = dxui.Button.build(menu.id + 'sysInfo', menu)
    menuView.sysInfo = sysInfo
    viewUtils.menuItemBtnStyle(basic, '/app/code/resource/image/basic.png', "基础设置", viewUtils.font28, 0xD1536A, 0xCC2A4A, w1, h1, 100, 75)
    viewUtils.menuItemBtnStyle(advance, '/app/code/resource/image/advance.png', "高级设置", viewUtils.font28, 0xEB4799, 0xE61980, w1, h1, 100, 75)
    viewUtils.menuItemBtnStyle(register, '/app/code/resource/image/register.png', "人员注册", viewUtils.font28, 0x5C9FD6, 0x3387CC, w1, h1, 100, 75)
    viewUtils.menuItemBtnStyle(sysInfo, '/app/code/resource/image/sys_info.png', "系统信息", viewUtils.font28, 0x5AD8B2, 0x31CE9F, w1, h1, 100, 75)
}

function closeSearch() {
    menuView.search.text("")
    menuView.search.width(menuView.menu.width() - 100)
    menuView.cancel.hide()

    menuView.basic.show()
    menuView.advance.show()
    menuView.register.show()
    menuView.sysInfo.show()

    menuView.list.hide()
}

function openSearch() {
    menuView.search.width(menuView.menu.width() - 100 - menuView.cancel.width())
    menuView.cancel.alignTo(menuView.search, dxui.Utils.ALIGN.OUT_RIGHT_MID, 0, 0)
    menuView.cancel.show()

    menuView.basic.hide()
    menuView.advance.hide()
    menuView.register.hide()
    menuView.sysInfo.hide()

    menuView.list.obj.clean()
    menuView.list.show()
}

export default menuView