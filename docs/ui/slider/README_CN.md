<p align="right">
    <a href="./README.md">English</a>| <b>中文</b>
</p>


# Slider（滑动条）

## 概述

滑动条对象看起来像是在 进度条 增加了一个可以调节的旋钮，使用时可以通过拖动旋钮来设置一个值. 就像进度条(bar)一样，Slider可以是垂直的或水平的(当设置进度条的宽度小于其高度，就可以创建出垂直摆放的滑动条).

## Usage（用法）

滑动条是由滑动条、状态条和旋钮三个部分组成，

- 设置滑动条范围

```js
slider.range(0, 100)
```

- 设置/获取 滑动条初始值

```js
// 设置初始值
slider.value(10)
// 获取滑动条的值
slider.value(10)
```

## 事件

- 在拖动滑块或用键更改.当滑块处于被拖拽时候会激活 VALUE_CHANGED 事件.

```js
slider.on(ui.Utils.EVENT.VALUE_CHANGED, () => {
    log.info("VALUE_CHANGED:" + slider.value())
})
```

- 刚刚释放滑块，旋钮失去焦点时候会激活 DEFOCUSED 事件.

```js
slider.on(ui.Utils.EVENT.DEFOCUSED, () => {
    log.info("DEFOCUSED:" + slider.value())
})
```

## 代码示例

![alt text](slider.png)


```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import log from '../dxmodules/dxLogger.js';

// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 0 }, context);

// 创建屏幕
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

let slider = ui.Slider.build(mainView.id + 'slider', mainView)
slider.width(150)
slider.setPos(400, 200)
slider.range(0, 100)
slider.value(10)
slider.on(ui.Utils.EVENT.VALUE_CHANGED, () => {
    log.info("VALUE_CHANGED:" + slider.value())
})
slider.on(ui.Utils.EVENT.DEFOCUSED, () => {
    log.info("DEFOCUSED:" + slider.value())
})
// 加载屏幕
ui.loadMain(mainView)
```
