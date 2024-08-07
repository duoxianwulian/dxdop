# Drop-down list（下拉列表）

## 概述

下拉列表允许用户从选项列表中选择一个值。

下拉列表的选项表默认是关闭的，其中的选项可以是单个值或预定义文本。 当单击下拉列表后，其将创建一个列表，用户可以从中选择一个选项。 当用户选择了一个值后，该列表将被删除，下次点击会再重新生成。

## Parts and Styles（部分和样式）

下拉组件由以下元素组成：“按钮”和“列表”（都与按钮和列表控件无关，也就是并不是按钮和列表控件）

### Button（按钮）

- LV_PART_MAIN 按钮的背景。 对其上面的文本使用典型的背景属性和文本属性。

- LV_PART_INDICATOR 通常是一个箭头符号，可以是图像或文本(LV_SYMBOL)。

按钮在打开时，会设置为 LV_STATE_CHECKED 状态。

### List（列表）

- LV_PART_MAIN 列表本身。 使用典型的背景属性。可通过设置 max_height 限制列表的高度。

- LV_PART_SCROLLBAR 列表滚动条的背景、边框、阴影属性和宽度（对于它自己的宽度）以及右侧间距的右侧填充。

- LV_PART_SELECTED 指的是当前按下、选中或按下+选中的选项。 也是使用典型的背景属性。

列表在打开或关闭时会隐藏或显示。若要向其添加样式，请使用 getList() 获取列表对象

### Symbol（符号）

可以使用 setSymbol(url) 将符号（通常是箭头）添加到下拉列表中。

## Direction（方向）

列表可以在任何一侧创建（展开）。 默认是 LV_DIR_BOTTOM （底部展开），可以通过函数 lv_dropdown_set_dir(dropdown, LV_DIR_LEFT) 修改展开方向。

如果列表在指定的展开方向超出的屏幕（父对象）的范围，其会自动进行调整展开方向。

## Manually open/close（手动打开或关闭）

要手动打开或关闭下拉列表，可以使用 lv_dropdown_open/close(dropdown) 函数。


## 事件

现已封装的支持事件包括 setOptions() [设置选项内容]、getList() [获取下拉列表]、setSelected() [设置选中项序号]、getSelected() [获取选中项序号]、setSymbol() [设置图标] 等，以上函数可以直接调用。例

```js
Dropdown.setSelected(3) // 设置选中项为序号为 3 的列表项
```

## 代码示例

![alt text](dropdown.png)

```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";

// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 1 }, context);

// 创建屏幕
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// 创建样式集合
let theStyle = ui.Style.build()
// 向集合添加属性
theStyle.padTop(10)
theStyle.padBottom(10)


// 创建按钮控件
let Dropdown = ui.Dropdown.build(mainView.id + 'Dropdown', mainView)

Dropdown.setPos(120, 60)
Dropdown.setSize(200, 80)
// 将样式绑定到按钮上
Dropdown.addStyle(theStyle)

let arr = ["黄金糕", "双皮奶", "蚵仔煎", "龙须面", "北京烤鸭"]
// 设置下拉选项内容
Dropdown.setOptions(arr)
// 设置下拉图标
Dropdown.setSymbol('/app/code/resource/image/down.png')
// 获取下拉列表
let l = Dropdown.getList()
// 创建字体
let label1_font = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 20, ui.Utils.FONT_STYLE.NORMAL)
// 设置文本字体
Dropdown.textFont(label1_font)
// 下拉列表字体绑定
l.textFont(label1_font)
// 设置选中项
Dropdown.setSelected(3)
// 加载屏幕
ui.loadMain(mainView)
```