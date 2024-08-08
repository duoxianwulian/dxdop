<p align="right">
    <a href="./README.md">English</a>| <b>中文</b>
</p>


# Line （线条）

## 概述

线条(Line)组件能在给出的一组点之间绘制出相连的直线。

## Usage（用法）

- 设置点, 点必须以数组的方式，存储在一个大的数组中，并通过 setPoints(points, point_cnt) 函数将数组传递给line对象。point_cnt为现实的线段数量，需小于等于points的长度

```js
line.setPoints([[100, 100], [200, 200]], 2)
```

- Auto-size（自动调整大小）。默认情况下，线条的宽度和高度被设置为 LV_SIZE_CONTENT。也就是它会根据给出的点自动调整其大小来适应所有点的分布。如果你设置了宽、高，那么线条上的有些部分可能会不可见。

## 事件

线条对象仅发送 通用事件 。

## 代码示例

![alt text](line.png)

```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";

// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 0 }, context);

// 创建屏幕
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

let line = ui.Line.build(mainView.id + 'Line', mainView)
line.lineColor(0x3F85FF)
line.lineWidth(8)

let points = [[100, 100], [200, 200], [300, 100], [400, 200], [500, 50], [100, 100]]

line.setPoints(points, points.length)

// 加载屏幕
ui.loadMain(mainView)
```





