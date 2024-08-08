<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Slider

## Overview

A slider object looks like a progress bar with an adjustable knob. It can be used to set a value by dragging the knob. Just like a progress bar, a Slider can be vertical or horizontal (creating a vertical slider when the width of the progress bar is less than its height).

## Usage

The slider consists of a slider bar, a state bar, and a knob.

- Set the range of the slider

```js
slider.range(0, 100)
```

- Set/Get the initial value of the slider

```js
// Set initial value
slider.value(10)
// Get the slider's value
slider.value(10)
```

## Events

- The `VALUE_CHANGED` event is triggered when the knob is dragged or when the value is changed using keys.

```js
slider.on(ui.Utils.EVENT.VALUE_CHANGED, () => {
    log.info("VALUE_CHANGED:" + slider.value())
})
```

- The `DEFOCUSED` event is triggered when the knob is just released or loses focus.

```js
slider.on(ui.Utils.EVENT.DEFOCUSED, () => {
    log.info("DEFOCUSED:" + slider.value())
})
```

## Code Example

![alt text](slider.png)

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
// Load screen
ui.loadMain(mainView)
```