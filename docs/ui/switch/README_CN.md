<p align="right">
    <a href="./README.md">English</a>| <b>中文</b>
</p>


# Switch （开关）

## 概述

开关看起来像一个小滑块，开关的功能类似于按钮，也可以用来打开和关闭某些东西。

## Usage（用法）

开关包括以下3个零件：

- 开关背景。修改其 padding 会让下面的(指示器和旋钮)在相应方向上的大小发生变化。
- 显示开关状态的指示器。
- 在指标左侧或右侧的旋钮。

### 设置选中或者取消选中

```js
switch0.select(true)
```

### 获取是否选中

```js
switch0.isSelect()
```

## 事件

- 正常情况下，当开关被点击并且状态发生改变时，会触发 VALUE_CHANGED 事件。

```js
switch0.on(ui.Utils.EVENT.VALUE_CHANGED, () => {
    log.info("VALUE_CHANGED:" + switch0.isSelect())
})
```

## 代码示例

![alt text](switch.png)

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

let switch0 = ui.Switch.build(mainView.id + 'switch', mainView)
switch0.setPos(100, 100)
switch0.setSize(60, 30)
switch0.select(true)

switch0.on(ui.Utils.EVENT.VALUE_CHANGED, () => {
    log.info("VALUE_CHANGED:" + switch0.isSelect())
})
// 加载屏幕
ui.loadMain(mainView)
```

