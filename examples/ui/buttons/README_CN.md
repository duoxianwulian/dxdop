# Button matrix（矩阵按钮）

## 概述
矩阵按钮(Button matrix)控件是一种在行和列中显示多个按钮的轻量级实现方式。按钮不是实际创建出来的，而是实时绘制出来的，所以是轻量级的，因为这样一个按钮仅使用 8 个字节的内存，而不是普通 Button 控件那样：~100-150 字节再加上 Label 控件的内存占用。


### 坐标

坐标设置是基于父元素的相对位置，参数1为X轴，参数2为Y轴
```js
keys.setPos(50, 130)
```

### 尺寸

尺寸设置参数1为元素宽度，参数2为高度
```js
keys.setSize(50, 130)
```
## 样式
按钮样式适用于框架内提供的样式集，具体查看 style，但是需要特殊标识一下，样式绑定位置，默认为绑定在键盘上，加入ui.Utils.STYLE_PART.ITEMS字段，就是对内部子项起作用
```js
keys.addStyle(boxStyle)
keys.addStyle(btnStyle, ui.Utils.STYLE_PART.ITEMS)
```
以上为全部元素统一设置，如果需要单独对元素进行设置，就需要调用js方法，lvDrawRectReset和lvDrawLabelReset，lvDrawRectReset是设置元素样式，lvDrawLabelReset是设置元素文本样式
```js
keys.obj.addEventCb((e) => {
    let dsc = e.lvEventGetDrawPartDsc()
    if (dsc.class_p == keys.obj.ClassP && dsc.type == ui.Utils.ENUM.LV_BTNMATRIX_DRAW_PART_BTN) {
        // 根据按钮id筛选特定按钮，id为按钮序号，序号从0开始
        if (dsc.id == 11) {
            // 修改背景颜色和按钮圆角
            ui.Utils.GG.NativeDraw.lvDrawRectReset(dsc.rect_dsc, { bg_color: 0x2196F3， radius: 30 })
            // 修改文字颜色
            ui.Utils.GG.NativeDraw.lvDrawLabelReset(dsc.label_dsc, { color: 0xFFFFFF })
        } else {
            ui.Utils.GG.NativeDraw.lvDrawRectReset(dsc.rect_dsc, { bg_color: 0xE0E0E0 })
        }
    }
}, ui.Utils.ENUM.LV_EVENT_DRAW_PART_BEGIN)
```

## 事件
按键组对多数事件都是支持的，上面单个样式设置，应用的就是绘制事件。

- 点击事件绑定
```js
keys.on(ui.Utils.EVENT.CLICK, () => {})
```
了解更多事件详情，请转到 Events（事件）

## 代码示例

![alt text](buttons.png)
```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js"
import log from '../dxmodules/dxLogger.js';

// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 1 }, context);

// 创建屏幕
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// 创建键盘集合
let boxStyle = ui.Style.build()
// 向集合添加属性
boxStyle.padAll(25)
boxStyle.padColumn(20)
boxStyle.padRow(20)
// 创建按钮集合
let btnStyle = ui.Style.build()
// 向集合添加属性
btnStyle.radius(10)
btnStyle.bgColor(0xE0E0E0)
btnStyle.textColor(0x000000)

// 创建按钮组
let keys = ui.Buttons.build(mainView.id + 'keys', mainView)
// 设置键盘组大小
keys.setSize(mainView.width(), mainView.height() - 60)
// 键盘位置
keys.setPos(0, 60)
// 键盘按钮集合
keys.data(["0", "1", "2", "3", "4", "\n",
    "5", "6", "7", "8", "9", "\n",
    "取消", "确认", ""])
// 将样式绑定到按钮上
keys.addStyle(boxStyle) // 设置键盘整体样式
keys.addStyle(btnStyle, ui.Utils.STYLE_PART.ITEMS) //设置键盘按钮样式
// 设置特定按钮样式
keys.obj.addEventCb((e) => {
    let dsc = e.lvEventGetDrawPartDsc()
    if (dsc.class_p == keys.obj.ClassP && dsc.type == ui.Utils.ENUM.LV_BTNMATRIX_DRAW_PART_BTN) {
        // 根据按钮id筛选特定按钮，id为按钮序号，序号从0开始
        if (dsc.id == 11) {
            // 修改背景颜色
            ui.Utils.GG.NativeDraw.lvDrawRectReset(dsc.rect_dsc, { bg_color: 0x2196F3, radius: 10 })
            // 修改文字颜色
            ui.Utils.GG.NativeDraw.lvDrawLabelReset(dsc.label_dsc, { color: 0xFFFFFF })
        } else {
            ui.Utils.GG.NativeDraw.lvDrawRectReset(dsc.rect_dsc, { bg_color: 0xE0E0E0 })
        }
    }
}, ui.Utils.ENUM.LV_EVENT_DRAW_PART_BEGIN)


// 设置字体
let font14 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 14, ui.Utils.FONT_STYLE.NORMAL)
// 绑定字体
keys.textFont(font14)
// 按钮点击事件 id为序号，text为按钮文本
keys.on(ui.Utils.EVENT.CLICK, () => {
    let clickBtn = keys.clickedButton()
    log.info("========== id:" + clickBtn.id + " =========== text:" + clickBtn.text)
})
// 加载屏幕
ui.loadMain(mainView)
```