import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import page1 from './page1.js'
import page2 from './page2.js'
import page3 from './page3.js'
import page4 from './page4.js'
import page5 from './page5.js'
import page6 from './page6.js'

// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 1 }, context);

page1.init()
page2.init()
page3.init()
page4.init()
page5.init()
page6.init()
page1.load()


// 刷新ui
let timer = std.setInterval(() => {
    if (ui.handler() < 0) {
        std.clearInterval(timer)
    }
}, 1)

