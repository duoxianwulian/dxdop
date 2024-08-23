import ui from "../dxmodules/dxUi.js";
import page4 from './page4.js';
import page6 from './page6.js';
import viewUtils from './viewUtils.js';

const pageView = {}
const pageID = 'page5'
let theView;
const page5Func = {}

pageView.init = function () {

  let theState = false

  theView = ui.View.build(pageID, ui.Utils.LAYER.MAIN)
  theView.padAll(0)
  theView.borderWidth(0)
  theView.bgColor(0x000000)
  theView.setPos(0, 0)
  theView.setSize(480, 320)

  // 创建样式集合
  let buttonStyle = ui.Style.build()
  // 向集合添加属性
  buttonStyle.radius(20)
  buttonStyle.bgOpa(100)
  buttonStyle.bgColor(0x666666)
  buttonStyle.textColor(0xffffff)
  buttonStyle.borderWidth(0)

  let offStyle = ui.Style.build()
  offStyle.opa(50)
  let onStyle = ui.Style.build()
  onStyle.opa(100)

  // 创建样式集合
  let labelStyle = ui.Style.build()
  labelStyle.borderWidth(0)

  let label1 = ui.Label.build(pageID + 'label1', theView)
  // 设置文本内容
  label1.text("19°")
  label1.setSize(280, 50)
  label1.setPos(100, 20)
  label1.textAlign(2)
  label1.textColor(0xFFFFFF)

  let label3 = ui.Label.build(pageID + 'label3', theView)
  // 设置文本内容
  label3.text("状态")
  label3.setSize(280, 50)
  label3.setPos(100, 120)
  label3.textAlign(2)
  label3.textColor(0xFFFFFF)
  label3.addStyle(offStyle)

  // 创建按钮控件
  let button2 = ui.Button.build(pageID + 'button2', theView)
  button2.setSize(180, 40)
  button2.setPos(150, 120)
  button2.padAll(0)
  button2.bgColor(0x000000)
  button2.borderWidth(0)

  // 创建按钮控件
  let button3 = ui.Button.build(pageID + 'button3', theView)
  button3.setSize(80, 80)
  button3.setPos(210, 190)
  button3.radius(100)


  // 创建按钮控件
  let button4 = ui.Button.build(pageID + 'button4', theView)
  button4.setSize(80, 80)
  button4.setPos(340, 190)
  button4.radius(100)

  // 创建按钮控件
  let button5 = ui.Button.build(pageID + 'button5', theView)
  button5.setSize(80, 80)
  button5.radius(100)
  button5.setPos(60, 190)
  button5.borderWidth(1)
  button5.radius(100)
  button5.setBorderColor(0xaaaaaa)

  // 创建按钮控件
  let button6 = ui.Button.build(pageID + 'button6', theView)
  button6.setSize(40, 40)
  button6.setPos(20, 10)
  button6.bgColor(0x000000)

  // 将样式绑定到按钮上
  button3.addStyle(buttonStyle)
  button4.addStyle(buttonStyle)
  button5.addStyle(buttonStyle)

  let label2 = ui.Label.build(pageID + 'button2label', button2)
  // 设置文本内容
  label2.text("制冷")
  label2.setPos(80, 0)

  // // 设置文本字体
  label1.textFont(viewUtils.font58)
  label3.textFont(viewUtils.font28)
  label2.textFont(viewUtils.font24Bold)

  let img1 = ui.Image.build(pageID + 'button2img1', button2)
  img1.source("/app/code/resource/image/cold.png")
  img1.setPos(5, 0)
  let img2 = ui.Image.build(pageID + 'button2img2', button2)
  img2.source("/app/code/resource/image/right.png")
  img2.setPos(150, 0)

  let img3 = ui.Image.build(pageID + 'button3img', button3)
  img3.source("/app/code/resource/image/jia.png")

  // 元素基于父元素上下左右居中
  img3.align(ui.Utils.ALIGN.CENTER, 0, 0)

  let img4 = ui.Image.build(pageID + 'button4img', button4)
  img4.source("/app/code/resource/image/jian.png")
  // 元素基于父元素上下左右居中
  img4.align(ui.Utils.ALIGN.CENTER, 0, 0)

  let img5_1 = ui.Image.build(pageID + 'button5img1', button5)
  img5_1.source("/app/code/resource/image/icon_off.png")
  // 元素基于父元素上下左右居中
  img5_1.align(ui.Utils.ALIGN.CENTER, 0, 0)
  let img5_2 = ui.Image.build(pageID + 'button5img2', button5)
  img5_2.source("/app/code/resource/image/icon_on.png")
  // 元素基于父元素上下左右居中
  img5_2.align(ui.Utils.ALIGN.CENTER, 0, 0)

  let img6 = ui.Image.build(pageID + 'button6img', button6)
  img6.source("/app/code/resource/image/left.png")
  // 元素基于父元素上下左右居中
  img6.align(ui.Utils.ALIGN.CENTER, 0, 0)

  page5Func.doOff = function () {
    theState = false
    label1.text("已关")
    button2.hide()
    label3.show()
    button3.addStyle(offStyle)
    button4.addStyle(offStyle)
    img5_2.hide()
    img5_1.show()
    button5.setBorderColor(0xaaaaaa)
    button5.bgColor(0x666666)
    button5.bgOpa(100)
  }
  page5Func.doOn = function () {
    theState = true
    label1.text("19°")
    label3.hide()
    button2.show()
    button3.addStyle(onStyle)
    button4.addStyle(onStyle)
    img5_1.hide()
    img5_2.show()
    button5.setBorderColor(0x2AA415)
    button5.bgColor(0x106d00)
    button5.bgOpa(30)
  }
  page5Func.doOff();
  button5.on(ui.Utils.EVENT.CLICK, () => {
    if (theState) {
      page5Func.doOff();
    } else {
      page5Func.doOn();
    }
  })
  button3.on(ui.Utils.EVENT.CLICK, () => {
    if (theState) {
      let nowNum = label1.text().split('°')[0]
      nowNum++;
      label1.text(nowNum + '°')
    }
  })
  button4.on(ui.Utils.EVENT.CLICK, () => {
    if (theState) {
      let nowNum = label1.text().split('°')[0]
      nowNum--;
      label1.text(nowNum + '°')
    }
  })
  button6.on(ui.Utils.EVENT.CLICK, () => {
    page4.load()
  })
  button2.on(ui.Utils.EVENT.CLICK, () => {
    page6.load(5)
  })
}
pageView.load = function (state) {
  if (state) {
    page5Func.doOn()
  } else {
    page5Func.doOff()
  }
  // 加载屏幕
  ui.loadMain(theView)
}

export default pageView