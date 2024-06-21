import dxui from '../../dxmodules/dxUi.js'
const popWin = {}
popWin.init = function (context) {
    dxui.initContext(context)
    /**************************************************创建顶层控件*****************************************************/
    let center_background = dxui.View.build('center_background', dxui.Utils.LAYER.TOP)
    popWin.center_background = center_background
    center_background.scroll(false)
    clearStyle(center_background)
    center_background.setSize(480, 320)
    center_background.bgColor(0x000000)
    center_background.bgOpa(50)
    center_background.hide()
    /**************************************************弹窗*****************************************************/
    let center_cont = dxui.View.build('center_cont', center_background)
    popWin.center_cont = center_cont
    clearStyle(center_cont)
    center_cont.setSize(288, 192);
    center_cont.radius(25)
    center_cont.align(dxui.Utils.ALIGN.CENTER, 0, 0)
    /**************************************************弹窗label*****************************************************/
    let center_label = buildLabel('center_label', center_cont, 30, "这是一个弹窗--这是一个弹窗--这是一个弹窗--")
    popWin.center_label = center_label
    center_cont.update()
    center_label.width(center_cont.width())
    center_label.longMode(dxui.Utils.LABEL_LONG_MODE.SCROLL_CIRCULAR)
    center_label.align(dxui.Utils.ALIGN.CENTER, 0, 0);
    /**************************************************弹窗上部图片*****************************************************/
    let center_img = dxui.Image.build('center_img', center_background)
    popWin.center_img = center_img
    center_img.source('/app/code/resource/image/hint_true.png')
    center_img.alignTo(center_cont, dxui.Utils.ALIGN.OUT_TOP_MID, 0, 60);
    /**************************************************弹窗下部图片*****************************************************/
    let center_bottom_view = dxui.View.build('center_bottom_view', center_cont)
    popWin.center_bottom_view = center_bottom_view
    clearStyle(center_bottom_view)
    center_bottom_view.bgColor(0x000000)
    center_bottom_view.radius(10)
    center_bottom_view.setSize(278, 20);
    center_bottom_view.align(dxui.Utils.ALIGN.BOTTOM_MID, 0, -20);
    /**************************************************展示图片*****************************************************/
    let showPic = dxui.Image.build('showPic', center_background)
    popWin.showPic = showPic
    showPic.source('/app/code/resource/image/pic0.png')
    showPic.hide()
}
function clearStyle(obj) {
    obj.radius(0)
    obj.padAll(0)
    obj.borderWidth(0)
}
function buildLabel(id, parent, size, text) {
    let label = dxui.Label.build(id, parent)
    let font60 = dxui.Font.build('/app/code/resource/font/PangMenZhengDaoBiaoTiTi-1.ttf', size, dxui.Utils.FONT_STYLE.NORMAL)
    label.textFont(font60)
    label.textColor(0x000000)
    label.text(text)
    label.textAlign(dxui.Utils.TEXT_ALIGN.CENTER)
    return label
}

export default popWin