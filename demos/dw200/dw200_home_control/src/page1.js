import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import viewUtils from './viewUtils.js'
import page2 from './page2.js'
import page3 from './page3.js'
import page4 from './page4.js'

const pageView = {}
const pageID = 'page1'
let theView;
let timer;
pageView.init = function () {

  theView = ui.View.build(pageID, ui.Utils.LAYER.MAIN)
  theView.padAll(0)
  theView.borderWidth(0)
  theView.bgColor(0x000000)
  theView.setPos(0, 0)
  theView.setSize(480, 320)

  let img = ui.Image.build(pageID + 'img1', theView)
  img.source("/app/code/resource/image/bg2.png")
  img.setPos(0, 0)

  // 创建文本控件
  let label1 = ui.Label.build(pageID + 'label1', theView)
  let label2 = ui.Label.build(pageID + 'label2', theView)
  let label3 = ui.Label.build(pageID + 'label3', theView)
  // 设置文本内容
  label1.text("26°")
  label1.setPos(270, 60)
  label1.textColor(0xffffff)
  label2.text("湿度 40% \n空气优 10")
  label2.setPos(230, 180)
  label2.textColor(0xdddddd)
  label3.text("北京 昌平区")
  label3.setPos(200, 40)
  label3.textColor(0xdddddd)

  // 设置文本字体
  label1.textFont(viewUtils.font88)
  label2.textFont(viewUtils.font28)
  label3.textFont(viewUtils.font24)

  let view1 = ui.View.build(pageID + 'view1', theView)
  view1.setPos(0, 0)
  view1.setSize(240, 320)
  view1.bgOpa(0)
  view1.borderWidth(0)
  let view2 = ui.View.build(pageID + 'view2', theView)
  view2.setPos(240, 0)
  view2.setSize(240, 320)
  view2.bgOpa(0)
  view2.borderWidth(0)

  
  view1.on(ui.Utils.EVENT.CLICK, () => {
    std.clearTimeout(timer)

    page3.load()
  })
  view2.on(ui.Utils.EVENT.CLICK, () => {
    std.clearTimeout(timer)

    page4.load()
  })
}

pageView.load = function () {
  // 加载屏幕
  ui.loadMain(theView)

  timer = std.setTimeout(() => {

    page2.load()

  }, 5000)
}

export default pageView