import dxui from '../../dxmodules/dxUi.js'
const mainView = {}
mainView.init = function (context) {
    dxui.initContext(context)
    /**************************************************创建屏幕*****************************************************/
    let screen_main = dxui.View.build('screen_main', dxui.Utils.LAYER.MAIN)
    mainView.screen_main = screen_main
    screen_main.scroll(false)
    /**************************************************创建背景图片*****************************************************/
    let screen_img = dxui.Image.build('screen_img', screen_main)
    mainView.screen_img = screen_img
    screen_img.source("/app/code/resource/image/background_90.png")
    /**************************************************创建版本号*****************************************************/
    let version = buildLabel('version', screen_main, 12, "dw200_access_v1.0.0")
    mainView.version = version
    version.hide()
    /**************************************************创建时间Label*****************************************************/
    let screen_label_time = buildLabel('screen_label_time', screen_main, 60, "00:00")
    mainView.screen_label_time = screen_label_time
    screen_label_time.align(dxui.Utils.ALIGN.TOP_MID, 120, 30)
    /**************************************************创建DateLabel*****************************************************/
    let screen_label_data = buildLabel('screen_label_data', screen_main, 30, "Sun 00-00")
    mainView.screen_label_data = screen_label_data
    screen_label_data.alignTo(screen_label_time, dxui.Utils.ALIGN.OUT_BOTTOM_MID, 0, 0)
    /**************************************************创建公司名称Label*****************************************************/
    let screen_label_company = buildLabel('screen_label_company', screen_main, 27, "苏州酷豆物联")
    mainView.screen_label_company = screen_label_company
    screen_label_company.setSize(220, 38);
    screen_label_company.longMode(dxui.Utils.LABEL_LONG_MODE.SCROLL_CIRCULAR)
    screen_label_company.alignTo(screen_label_data, dxui.Utils.ALIGN.OUT_BOTTOM_MID, 0, 0)
    /**************************************************创建开锁按钮*****************************************************/
    let screen_btn_unlocking = dxui.Button.build('screen_btn_unlocking', screen_main)
    mainView.screen_btn_unlocking = screen_btn_unlocking
    screen_btn_unlocking.setSize(120, 50)
    screen_btn_unlocking.bgColor(0x000000)
    screen_btn_unlocking.bgOpa(30)
    screen_btn_unlocking.align(dxui.Utils.ALIGN.BOTTOM_MID, 0, -64);
    /**************************************************创建开锁Label*****************************************************/
    let screen_btn_unlocking_label = buildLabel('screen_btn_unlocking_label', screen_btn_unlocking, 30, "开锁")
    mainView.screen_btn_unlocking_label = screen_btn_unlocking_label
    screen_btn_unlocking_label.align(dxui.Utils.ALIGN.CENTER, 0, 0)
    /**************************************************创建上方容器*****************************************************/
    let top_cont = dxui.View.build('top_cont', screen_main)
    mainView.top_cont = top_cont
    clearStyle(top_cont)
    top_cont.setSize(480, 28)
    top_cont.bgOpa(30)
    top_cont.bgColor(0x000000)
    top_cont.flexFlow(dxui.Utils.FLEX_FLOW.ROW)
    top_cont.flexAlign(dxui.Utils.FLEX_ALIGN.END, dxui.Utils.FLEX_ALIGN.CENTER, dxui.Utils.FLEX_ALIGN.CENTER)
    /**************************************************创建网络状态常显示图片*****************************************************/
    let top_net = dxui.Image.build('top_net', top_cont)
    mainView.top_net = top_net
    top_net.source('/app/code/resource/image/eth_disable.png')
    /**************************************************创建mqtt状态常显示图片*****************************************************/
    let top_mqtt = dxui.Image.build('top_mqtt', top_cont)
    mainView.top_mqtt = top_mqtt
    top_mqtt.source('/app/code/resource/image/mqtt_enable.png')
    top_mqtt.hide()
    /**************************************************创建下方容器*****************************************************/
    let bottom_cont = dxui.View.build('bottom_cont', screen_main)
    mainView.bottom_cont = bottom_cont
    clearStyle(bottom_cont)
    bottom_cont.setSize(480, 28)
    bottom_cont.bgOpa(30)
    bottom_cont.bgColor(0x000000)
    bottom_cont.align(dxui.Utils.ALIGN.BOTTOM_MID, 0, 0)
    bottom_cont.flexFlow(dxui.Utils.FLEX_FLOW.ROW)
    bottom_cont.flexAlign(dxui.Utils.FLEX_ALIGN.SPACE_BETWEEN, dxui.Utils.FLEX_ALIGN.CENTER, dxui.Utils.FLEX_ALIGN.CENTER)
    /**************************************************显示设备SN*****************************************************/
    let bottom_sn = buildLabel('bottom_sn', bottom_cont, 19, " ")
    mainView.bottom_sn = bottom_sn
    bottom_sn.longMode(dxui.Utils.LABEL_LONG_MODE.SCROLL_CIRCULAR)
    bottom_sn.setSize(240 - 5, 28);
    bottom_sn.textAlign(dxui.Utils.TEXT_ALIGN.LEFT)
    /**************************************************显示设备ip*****************************************************/
    let bottom_ip = buildLabel('bottom_ip', bottom_cont, 19, " ")
    mainView.bottom_ip = bottom_ip
    bottom_ip.longMode(dxui.Utils.LABEL_LONG_MODE.SCROLL_CIRCULAR)
    bottom_ip.setSize(240 - 5, 28);
    bottom_ip.textAlign(dxui.Utils.TEXT_ALIGN.RIGHT)
}

function buildLabel(id, parent, size, text) {
    let label = dxui.Label.build(id, parent)
    let font60 = dxui.Font.build('/app/code/resource/font/PangMenZhengDaoBiaoTiTi-1.ttf', size, dxui.Utils.FONT_STYLE.NORMAL)
    label.textFont(font60)
    label.textColor(0xFFFFFF)
    label.text(text)
    label.textAlign(dxui.Utils.TEXT_ALIGN.CENTER)
    return label
}

function clearStyle(obj) {
    obj.radius(0)
    obj.padAll(0)
    obj.borderWidth(0)
}
export default mainView