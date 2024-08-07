import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import page1 from './page1.js'
import { playAudio } from './doplay.js'
import viewUtils from './viewUtils.js'

const pageView = {}
const pageID = 'page3'
let theView;

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
  buttonStyle.radius(10)
  buttonStyle.bgOpa(100)
  buttonStyle.bgColor(0x333333)
  buttonStyle.textColor(0xffffff)
  buttonStyle.borderWidth(0)

  // 创建样式集合
  let labelStyle = ui.Style.build()
  labelStyle.borderWidth(0)

  // 创建按钮控件
  let button1 = ui.Button.build(pageID + 'button1', theView)
  button1.setSize(200, 100)
  button1.setPos(30, 50)
  // 创建按钮控件
  let button2 = ui.Button.build(pageID + 'button2', theView)
  button2.setSize(200, 100)
  button2.setPos(250, 50)
  // 创建按钮控件
  let button3 = ui.Button.build(pageID + 'button3', theView)
  button3.setSize(200, 100)
  button3.setPos(30, 170)
  // 创建按钮控件
  let button4 = ui.Button.build(pageID + 'button4', theView)
  button4.setSize(200, 100)
  button4.setPos(250, 170)

  let viewBtn = ui.View.build(pageID + 'viewBtn', theView)
  viewBtn.setSize(200, 10)
  viewBtn.setPos(140, 300)
  viewBtn.bgColor(0x666666)
  viewBtn.borderWidth(0)

  // 将样式绑定到按钮上
  button1.addStyle(buttonStyle)
  button2.addStyle(buttonStyle)
  button3.addStyle(buttonStyle)
  button4.addStyle(buttonStyle)

  // 创建文本控件
  let label1 = ui.Label.build(pageID + 'button1label', button1)
  // 设置文本内容
  label1.text("晚安")
  label1.setPos(55, 25)
  let label2 = ui.Label.build(pageID + 'button2label', button2)
  // 设置文本内容
  label2.text("窗帘")
  label2.setPos(55, 25)
  let label3 = ui.Label.build(pageID + 'button3label', button3)
  // 设置文本内容
  label3.text("游戏模式")
  label3.setPos(55, 25)
  let label4 = ui.Label.build(pageID + 'button4label', button4)
  // 设置文本内容
  label4.text("我回来了")
  label4.setPos(55, 25)

  // // 设置文本字体
  label1.textFont(viewUtils.font24Bold)
  label2.textFont(viewUtils.font24Bold)
  label3.textFont(viewUtils.font24Bold)
  label4.textFont(viewUtils.font24Bold)

  let img1 = ui.Image.build(pageID + 'button1img', button1)
  img1.source("/app/code/resource/image/icon1.png")
  img1.setPos(10, 25)
  let img2 = ui.Image.build(pageID + 'button2img', button2)
  img2.source("/app/code/resource/image/icon2.png")
  img2.setPos(10, 25)
  let img3 = ui.Image.build(pageID + 'button3img', button3)
  img3.source("/app/code/resource/image/icon3.png")
  img3.setPos(10, 25)
  let img4 = ui.Image.build(pageID + 'button4img', button4)
  img4.source("/app/code/resource/image/icon4.png")
  img4.setPos(10, 25)


  let plate = ui.View.build(pageID + 'view', theView)
  plate.setSize(480, 320)
  plate.setPos(0, 0)
  plate.bgOpa(0)
  plate.borderWidth(0)

  let plateView = ui.View.build(pageID + 'view1', plate)
  plateView.setSize(300, 180)
  plateView.borderWidth(0)

  plateView.align(ui.Utils.ALIGN.CENTER, 0, 0)

  let plateLabel = ui.Label.build(pageID + 'plateLabel', plateView)
  // 设置文本内容
  plateLabel.text("晚安")
  plateLabel.textColor(0xffffff)
  plateLabel.textFont(viewUtils.font28)

  plateLabel.align(ui.Utils.ALIGN.CENTER, 0, 0)

  plate.hide()

  button1.on(ui.Utils.EVENT.CLICK, () => {
    plate.show()
    plateView.bgColor(0x000000)
    plateLabel.textColor(0x999999)
    plateLabel.text('晚安')
    playAudio(1)
    std.setTimeout(() => {
      plate.hide()
    }, 2000)
  })
  let clState = false
  button2.on(ui.Utils.EVENT.CLICK, () => {
    clState = !clState
    let ys = clState ? 0xFFFFCC : 0x666699
    plate.show()
    plateView.bgColor(ys)
    plateLabel.textColor(0x999999)
    plateLabel.text(clState ? '窗帘已打开' : '窗帘已关闭')
    if (clState) {
      playAudio(2)
    } else {
      playAudio(3)
    }
    std.setTimeout(() => {
      plate.hide()
    }, 2000)
  })
  button3.on(ui.Utils.EVENT.CLICK, () => {
    playAudio(4)
    plate.show()
    plateView.bgColor(0x009999)
    plateLabel.textColor(0xffffff)
    plateLabel.text('游戏模式已开')
    std.setTimeout(() => {
      plate.hide()
    }, 2000)
  })
  button4.on(ui.Utils.EVENT.CLICK, () => {
    plate.show()
    plateView.bgColor(0xFF9900)
    plateLabel.textColor(0xffffff)
    plateLabel.text('欢迎回家')
    playAudio(5)
    std.setTimeout(() => {
      plate.hide()
    }, 2000)
  })
  viewBtn.on(ui.Utils.EVENT.CLICK, () => {
    page1.load()
  })
}
pageView.load = function () {
  // 加载屏幕
  ui.loadMain(theView)
}

export default pageView