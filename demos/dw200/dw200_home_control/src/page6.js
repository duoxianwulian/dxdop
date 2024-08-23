import ui from "../dxmodules/dxUi.js";
import page5 from './page5.js';
import viewUtils from './viewUtils.js'

const pageView = {}
const pageID = 'page6'
let theView;
const page6Func = {}
let theIndex = 4;

pageView.init = function () {

  theView = ui.View.build(pageID, ui.Utils.LAYER.MAIN)
  theView.padAll(0)
  theView.borderWidth(0)
  theView.bgColor(0x000000)
  theView.setPos(0, 0)
  theView.setSize(480, 320)

  // 创建样式集合
  let buttonStyle = ui.Style.build()
  // 向集合添加属性
  buttonStyle.radius(100)
  buttonStyle.bgColor(0x666666)
  buttonStyle.bgOpa(60)
  buttonStyle.borderWidth(0)
  // 创建样式集合
  let labelStyle = ui.Style.build()
  labelStyle.bgOpa(0)
  labelStyle.textAlign(2)
  labelStyle.textColor(0xFFFFFF)

  // 创建按钮控件
  let button3 = ui.Button.build(pageID + 'button3', theView)
  button3.setSize(100, 100)
  button3.setPos(50, 110)

  // 创建按钮控件
  let button4 = ui.Button.build(pageID + 'button4', theView)
  button4.setSize(100, 100)
  button4.setPos(190, 110)

  // 创建按钮控件
  let button5 = ui.Button.build(pageID + 'button5', theView)
  button5.setSize(100, 100)
  button5.setPos(330, 110)

  // 创建按钮控件
  let button6 = ui.Button.build(pageID + 'button6', theView)
  button6.setSize(50, 50)
  button6.setPos(420, 10)
  button6.radius(100)
  button6.bgColor(0xff0000)

  // 将样式绑定到按钮上
  button3.addStyle(buttonStyle)
  button4.addStyle(buttonStyle)
  button5.addStyle(buttonStyle)

  let img1 = ui.Image.build(pageID + 'button2img1', button5)
  img1.source("/app/code/resource/image/cold.png")
  // 元素基于父元素上下左右居中
  img1.align(ui.Utils.ALIGN.CENTER, 0, 0)

  let img3 = ui.Image.build(pageID + 'button3img', button3)
  img3.source("/app/code/resource/image/icon5.png")

  // 元素基于父元素上下左右居中
  img3.align(ui.Utils.ALIGN.CENTER, 0, 0)

  let img4 = ui.Image.build(pageID + 'button4img', button4)
  img4.source("/app/code/resource/image/icon6.png")
  // 元素基于父元素上下左右居中
  img4.align(ui.Utils.ALIGN.CENTER, 0, 0)

  let img6 = ui.Image.build(pageID + 'button6img', button6)
  img6.source("/app/code/resource/image/close.png")
  // 元素基于父元素上下左右居中
  img6.align(ui.Utils.ALIGN.CENTER, 0, 0)

  let label1 = ui.Label.build(pageID + 'label1', theView)
  label1.text("送风")
  label1.setPos(50, 240)
  label1.setSize(100, 40)
  let label2 = ui.Label.build(pageID + 'label2', theView)
  label2.text("制热")
  label2.setPos(190, 240)
  label2.setSize(100, 40)
  let label3 = ui.Label.build(pageID + 'label3', theView)
  label3.text("制冷")
  label3.setPos(330, 240)
  label3.setSize(100, 40)

  // // 设置文本字体
  label1.textFont(viewUtils.font28)
  label2.textFont(viewUtils.font28)
  label3.textFont(viewUtils.font28)

  label1.addStyle(labelStyle)
  label2.addStyle(labelStyle)
  label3.addStyle(labelStyle)

  page6Func.changeState = function (index) {
    theIndex = index
    switch (index) {
      case 3:
        button3.bgColor(0x0099FF)
        button4.bgColor(0x666666)
        button5.bgColor(0x666666)
        break;
      case 4:
        button3.bgColor(0x666666)
        button4.bgColor(0x0099FF)
        button5.bgColor(0x666666)
        break;
      case 5:
        button3.bgColor(0x666666)
        button4.bgColor(0x666666)
        button5.bgColor(0x0099FF)
        break;
    }
  }
  button3.on(ui.Utils.EVENT.CLICK, () => {
    page6Func.changeState(3)
  })
  button4.on(ui.Utils.EVENT.CLICK, () => {
    page6Func.changeState(4)
  })
  button5.on(ui.Utils.EVENT.CLICK, () => {
    page6Func.changeState(5)
  })
  button6.on(ui.Utils.EVENT.CLICK, () => {
    page5.load(true)
  })
}
pageView.load = function (index) {
  page6Func.changeState(index)
  // 加载屏幕
  ui.loadMain(theView)
}

export default pageView