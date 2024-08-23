import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import main from './page.js'

// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 1 }, context);

main.init()
main.load()


// 刷新ui
let timer = std.setInterval(() => {
    if (ui.handler() < 0) {
        std.clearInterval(timer)
    }
}, 1)

