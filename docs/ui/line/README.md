<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Line

## Overview

The Line component can draw connected straight lines between a given set of points.

## Usage

- **Setting Points**: Points must be stored in a large array and passed to the line object using the `setPoints(points, point_cnt)` function. `point_cnt` is the actual number of line segments and must be less than or equal to the length of `points`.

```js
line.setPoints([[100, 100], [200, 200]], 2)
```

- **Auto-size**: By default, the width and height of the line are set to `LV_SIZE_CONTENT`, meaning it automatically adjusts its size to fit all the points. If you set specific width and height, some parts of the line may become invisible.

## Events

The line object only sends general events.

## Code Example

![alt text](line.png)

```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";

// ui context
let context = {}

// Initialize ui
ui.init({ orientation: 0 }, context);

// Create screen
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

let line = ui.Line.build(mainView.id + 'Line', mainView)
line.lineColor(0x3F85FF)
line.lineWidth(8)

let points = [[100, 100], [200, 200], [300, 100], [400, 200], [500, 50], [100, 100]]

line.setPoints(points, points.length)

// Load screen
ui.loadMain(mainView)
```