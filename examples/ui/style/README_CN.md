# 样式

## 概述
"Styles" 用于设置对象的外观。lvgl中的样式受到CSS的启发。简而言之，概念如下：

- 样式是一个 lv_style_t 变量，它可以保存诸如边框宽度、文字颜色等属性。类似于CSS中的 class。

- 样式可以分配给对象以改变它们的外观。在分配时，可以指定目标部分（CSS中的伪元素）和目标状态（伪类）。例如，当滑块处于按下状态时，可以为其添加 style_blue。

- 一个样式可以被任意数量的对象使用。

- 样式可以被级联，这意味着可以将多个样式分配给一个对象，每个样式可以具有不同的属性。因此，并非所有的属性都必须在一个样式中指定。

- 最近添加的样式具有更高的优先级。这意味着，如果一个属性在两个样式中都指定了，对象中最新的样式将被使用。

- 一些属性（例如文字颜色）可以从父级继承，如果没有在对象中指定的话。

- 对象也可以具有优先级比“正常”样式更高的本地样式。

- 与CSS不同（在CSS中，伪类描述不同的状态，例如 :focus ），在LVGL中，属性分配给了给定的状态。

- 当对象更改状态时，可以应用过渡效果。

## 样式属性
|  属性名   | api  | 参数  | 例  |
|  ------  | ----  | ----  | ----  |
| 坐标  | setPos | (Left, Top)<br>参数1为X轴坐标，参数2为Y轴坐标 | setPos(150, 130) |
| 尺寸  | setSize | (Width, Height)<br>参数1为元素宽度，参数2为元素高度 | setSize(140, 60) |
| 内间距  | padAll | (Number) | padAll(10) |
| 内间距上  | padTop | (Number) | padTop(10) |
| 内间距下  | padBottom | (Number) | padBottom(10) |
| 内间距左  | padLeft | (Number) | padLeft(10) |
| 内间距右  | padRight | (Number) | padRight(10) |
| 边框宽度  | borderWidth | (Number) | borderWidth(3) |
| 圆角  | radius | (Number) | radius(5) |
| 背景透明度  | bgOpa | (Number)<br>参数为0~100的整数，0为全透明 | bgOpa(100) |
| 背景颜色  | bgColor | (String 或 Number)<br>参数为字符串类型的HEX色值或者16进制数字 | bgColor(0x2196F3) |
| 元素透明度  | opa | (Number)<br>参数为0~100的整数，0为全透明 | opa(100) |
| 字体颜色  | textColor | (String 或 Number)<br>参数为字符串类型的HEX色值或者16进制数字 | textColor('#2196F3') |
| 文字对齐方式  | textAlign | (Number)<br>0: "AUTO"(根据语言环境自动切换左右对齐),<br>1: "LEFT"(左对齐),<br>2: "CENTER"(居中对齐),<br>3: "RIGHT"(右对齐) | textAlign(0) |
| 设置渐变色  | bgGradColor | (Number)<br>参数为16进制数字 | bgGradColor(0x2196F3) |
| 渐变色方向  | bgGradDir | (String)<br>VER: 垂直方向,<br>HOR: 水平方向,<br>NONE: 取消渐变显示 | bgGradDir(ui.Utils.GRAD.VER) |
| 渐变色开始位置  | bgMainStop | (Number)<br>参数为0~255之间的数字，0代表开始，128是中心点，255是元素末尾 | bgMainStop(0) |
| 渐变色结束位置  | bgGradStop | (Number)<br>参数为0~255之间的数字，0代表开始，128是中心点，255是元素末尾 | bgGradStop(255) |


### 代码示例
```js
// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 1 }, context);

// 创建屏幕
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// 创建样式集合
let labelStyle = ui.Style.build()
// 向集合添加属性
labelStyle.borderWidth(1)
labelStyle.radius(20)
labelStyle.bgOpa(100)
labelStyle.bgColor(0x2196F3)

let greenBg = ui.Style.build()
greenBg.bgColor(0x219600)

// 创建按钮控件
let button1 = ui.Button.build(mainView.id + 'button1', mainView)
button1.setPos(50, 130)
button1.setSize(100, 60)
// 将样式绑定到按钮上
button1.addStyle(labelStyle)

// 创建按钮控件
let button2 = ui.Button.build(mainView.id + 'button2', mainView)
button2.setPos(300, 130)
button2.setSize(100, 60)
// 将样式绑定到按钮上
button2.addStyle(labelStyle)
button2.addStyle(greenBg)

// 加载屏幕
ui.loadMain(mainView)
```