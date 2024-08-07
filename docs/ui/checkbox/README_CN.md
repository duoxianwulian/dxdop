# Checkbox（复选框）

## 概述
复选框 (Checkbox) 控件是由“勾选框”（tick box）和标签（label）组成的。当 Chackbox 被点击时，勾选框会进行切换。


### 坐标

坐标设置是基于父元素的相对位置，参数1为X轴，参数2为Y轴
```js
keys.setPos(50, 130)
```

### 尺寸

“勾选框”是一个使用所有典型背景样式属性的正方形，默认情况下，复选框的大小基于内部字体的高度调整的。


## 样式

实际上复选框的可调整样式并不太多，虽然利用setSize也可以调整尺寸，但是有效的可视大小并不会因为size的变化而变化。常用样式属性，基本就是利用 padColumn 来调整“勾选框”（tick box）和 “标签”（label）直接的距离


## 文本

复选框有个独特的文本属性。利用 text(String) 来设置文本内容，利用 textFont(font) 来设置字体样式及大小。


## 事件

- 为复选框赋值

```js
Checkbox.select(true)
```
- 获取复选框的状态

```js
let isSelect = Checkbox.isSelect()
```


## 代码示例

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
labelStyle.padColumn(10)


// 创建按钮控件
let Checkbox = ui.Checkbox.build(mainView.id + 'Checkbox', mainView)
Checkbox.setPos(150, 60)
// 将样式绑定到按钮上
Checkbox.addStyle(labelStyle)

// 设置文本内容
Checkbox.text("复选")
// 对复选框赋值
Checkbox.select(true)
// 创建字体
let label1_font = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 20, ui.Utils.FONT_STYLE.NORMAL)
// 设置文本字体
Checkbox.textFont(label1_font)

// 加载屏幕
ui.loadMain(mainView)
```