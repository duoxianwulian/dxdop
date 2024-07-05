# Button（按钮）

## 概述
按钮控件具备屏幕基础控件的属性，比如坐标，父对象，样式，例如点击等事件。但是
- 不可滚动
- 拥有默认的宽高

注意和一般意义上的按钮有所不同，本框架的按钮允许添加子元素，且本身不具备文本属性，按钮上的说明文字或者icon，需要以子元素的方式添加到按钮中。


### 坐标

坐标设置是基于父元素的相对位置，参数1为X轴，参数2为Y轴
```js
button.setPos(50, 130)
```


### 尺寸

尺寸设置参数1为元素宽度，参数2为高度
```js
button.setSize(50, 130)
```

## 样式
按钮样式适用于框架内提供的样式集，具体查看 style

## 事件
目前按钮支持三种点击方式
- 点击，点击按钮抬起时候执行方法，不会判读接触屏幕时间长短
```js
button.on(ui.Utils.EVENT.CLICK, () => {})
```
- 长按，接触屏幕时间必须超过400毫秒才能执行方法
```js
button.on(ui.Utils.EVENT.LONG_PRESSED, () => {})
```
- 短按，抬起时间超过400毫秒就不执行方法
```js
button.on(ui.Utils.EVENT.SHORT_PRESSED, () => {})
```


## 代码示例
![alt text](btn.png)
```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js"

// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 1 }, context);

// 创建屏幕
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// 创建样式集合
let labelStyle = ui.Style.build()
// 向集合添加属性
labelStyle.radius(10)
labelStyle.bgOpa(100)
labelStyle.bgColor(0x2196F3)

let greenBg = ui.Style.build()
greenBg.bgColor(0x219600)

// 创建按钮控件
let button1 = ui.Button.build(mainView.id + 'button1', mainView)
button1.setPos(150, 60)
button1.setSize(150, 60)
// 将样式绑定到按钮上
button1.addStyle(labelStyle)

// 创建按钮控件
let button2 = ui.Button.build(mainView.id + 'button2', mainView)
button2.setPos(150, 200)
button2.setSize(150, 60)
// 将样式绑定到按钮上
button2.addStyle(labelStyle)
button2.addStyle(greenBg)

// 创建文本控件
let label1 = ui.Label.build(mainView.id + 'label1', button1)
// 设置文本内容
label1.text("CLICK")
// 设置文本颜色
label1.textColor(0xffffff)
// 元素基于父元素上下左右居中
label1.align(ui.Utils.ALIGN.CENTER, 0, 0)
// 创建字体
let label1_font = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 18, ui.Utils.FONT_STYLE.NORMAL)
// 设置文本字体
label1.textFont(label1_font)

// 创建文本控件
let label2 = ui.Label.build(mainView.id + 'label2', button2)
// 设置文本内容
label2.text("LONG_PRESSED")
// 设置文本颜色
label2.textColor(0xffffff)
// 元素基于父元素上下左右居中
label2.align(ui.Utils.ALIGN.CENTER, 0, 0)
// 创建字体
let label2_font = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 14, ui.Utils.FONT_STYLE.NORMAL)
// 设置文本字体
label2.textFont(label2_font)

let aa = ["#ffff80", "#ffff00", "#ff8000" ,"#ff0000" ,"#800000"]
let flag = 0
button1.on(ui.Utils.EVENT.CLICK, () => {
    flag++;
    button1.bgColor(aa[flag%5])
})
button2.on(ui.Utils.EVENT.LONG_PRESSED, () => {
    flag++;
    button2.bgColor(aa[flag%5])
})

// 加载屏幕
ui.loadMain(mainView)
```