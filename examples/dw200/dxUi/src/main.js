import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js"

// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 1 }, context);

// 创建屏幕
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// 创建文本控件
let label = ui.Label.build(mainView.id + 'label', mainView)
// 设置文本内容
label.text("22 April 2020 15:36")
// 设置文本颜色
label.textColor(0x000000)
// 创建字体
let font24 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 24, ui.Utils.FONT_STYLE.NORMAL)
// 设置文本字体
label.textFont(font24)

// 加载屏幕
ui.loadMain(mainView)

// 刷新ui
let timer = std.setInterval(() => {
    if (ui.handler() < 0) {
        std.clearInterval(timer)
    }
}, 1)

