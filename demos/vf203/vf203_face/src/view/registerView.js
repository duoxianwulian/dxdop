import dxui from '../../dxmodules/dxUi.js'
import viewUtils from './viewUtils.js'
import menuView from './menuView.js'
const registerView = {}
registerView.init = function () {
    /**************************************************创建屏幕*****************************************************/
    let screenMain = dxui.View.build('registerView', dxui.Utils.LAYER.MAIN)
    registerView.screenMain = screenMain
    screenMain.scroll(false)
    screenMain.bgOpa(0)

    // 上边栏
    let top = viewUtils.top(screenMain)
    registerView.top = top

    // 通用面板
    let panel = viewUtils.panel(screenMain)
    registerView.panel = panel
    panel.padTop(50)
    panel.padBottom(50)
    panel.flexFlow(dxui.Utils.FLEX_FLOW.COLUMN)
    panel.flexAlign(dxui.Utils.FLEX_ALIGN.START, dxui.Utils.FLEX_ALIGN.CENTER, dxui.Utils.FLEX_ALIGN.CENTER)

    // 上边栏2（透明）
    let topCont = dxui.View.build(top.id + 'topCont', top)
    viewUtils._clearStyle(topCont)
    topCont.setSize(panel.width(), 50)
    topCont.alignTo(panel, dxui.Utils.ALIGN.OUT_TOP_MID, 0, -30)
    topCont.bgOpa(0)

    // 返回图标容器
    let backBox = dxui.View.build(topCont.id + 'backBox', topCont)
    viewUtils._clearStyle(backBox)
    registerView.backBox = backBox
    backBox.setSize(50, 50)
    backBox.bgOpa(0)

    // 返回图标
    let backIcon = dxui.Image.build(backBox.id + 'backIcon', backBox)
    backIcon.source('/app/code/resource/image/back.png')
    backIcon.align(dxui.Utils.ALIGN.CENTER, 0, 0)

    // 标题
    let title = dxui.Label.build(topCont.id + 'title', topCont)
    title.text("人员注册")
    title.textColor(0xffffff)
    title.textFont(viewUtils.font32)
    title.align(dxui.Utils.ALIGN.CENTER, 0, 0)
    viewUtils.crumbsEnter(registerView, "人员注册", panel)

    // 配置
    let regInput = viewUtils.addInput(screenMain, panel, "注册人员ID", "要注册的人员ID", true, false)
    registerView.regInput = regInput
    let regBtn = viewUtils.addButton(panel, "开始注册")
    registerView.regBtn = regBtn
    viewUtils.addLine(panel)
    let advance = viewUtils.addConfig(panel, "高级选项", null, false)
    let advancePanel = advancePanelCreate()
    advance.on(dxui.Utils.EVENT.CLICK, () => {
        viewUtils.crumbsEnter(registerView, "高级选项", advancePanel)
        title.text("高级选项")
    })

    // 面包屑返回
    backBox.on(dxui.Utils.EVENT.CLICK, () => {
        let t = viewUtils.crumbsOut(registerView)
        title.text(t)
        if (!t) {
            dxui.loadMain(menuView.screenMain)
            viewUtils.crumbsEnter(registerView, "人员注册", panel)
        }
    })
}

// 高级选项
function advancePanelCreate() {
    // 通用面板
    let screenMain = registerView.screenMain
    let panel = viewUtils.panel(screenMain, "advance")
    panel.padTop(50)
    panel.padBottom(50)
    panel.flexFlow(dxui.Utils.FLEX_FLOW.COLUMN)
    panel.flexAlign(dxui.Utils.FLEX_ALIGN.START, dxui.Utils.FLEX_ALIGN.CENTER, dxui.Utils.FLEX_ALIGN.CENTER)
    panel.hide()
    let delInput = viewUtils.addInput(screenMain, panel, "删除人员ID", "要删除的人员ID", true, false)
    registerView.delInput = delInput
    let delBtn = viewUtils.addButton(panel, "删除人员")
    registerView.delBtn = delBtn
    viewUtils.addLine(panel)
    let clearBtn = viewUtils.addButton(panel, "清空注册人员人脸信息")
    registerView.clearBtn = clearBtn
    return panel
}

export default registerView