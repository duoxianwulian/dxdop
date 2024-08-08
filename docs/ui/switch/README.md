<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Switch

## Overview

A switch looks like a small slider. It functions similarly to a button and can be used to turn something on or off.

## Usage

A switch consists of the following three parts:

- Switch background. Modifying its padding will change the size of the (indicator and knob) in the corresponding direction.
- An indicator that shows the switch's state.
- A knob on the left or right of the indicator.

### Set Selected or Unselected

```js
switch0.select(true)
```

### Get Whether Selected

```js
switch0.isSelect()
```

## Events

- Typically, when the switch is clicked and its state changes, it triggers the `VALUE_CHANGED` event.

```js
switch0.on(ui.Utils.EVENT.VALUE_CHANGED, () => {
    log.info("VALUE_CHANGED:" + switch0.isSelect())
})
```

## Code Example

![alt text](switch.png)

```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import log from '../dxmodules/dxLogger.js';

// ui context
let context = {}

// Initialize ui
ui.init({ orientation: 0 }, context);

// Create screen
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

let switch0 = ui.Switch.build(mainView.id + 'switch', mainView)
switch0.setPos(100, 100)
switch0.setSize(60, 30)
switch0.select(true)

switch0.on(ui.Utils.EVENT.VALUE_CHANGED, () => {
    log.info("VALUE_CHANGED:" + switch0.isSelect())
})
// Load screen
ui.loadMain(mainView)
```