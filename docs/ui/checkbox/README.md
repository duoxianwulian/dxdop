<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Checkbox

## Overview
The Checkbox control consists of a "tick box" and a label. When the Checkbox is clicked, the tick box toggles.

### Coordinates

The coordinates are set relative to the parent element. Parameter 1 is the X-axis, and parameter 2 is the Y-axis.
```js
keys.setPos(50, 130)
```

### Size

The "tick box" is a square that uses all typical background style properties. By default, the size of the Checkbox is adjusted based on the height of the internal font.

## Style

In fact, there are not many adjustable styles for a Checkbox. Although the size can be adjusted using `setSize`, the effective visual size will not change with the size adjustment. Common style properties mainly involve using `padColumn` to adjust the distance between the "tick box" and the "label."

## Text

The Checkbox has a unique text property. Use `text(String)` to set the text content, and use `textFont(font)` to set the font style and size.

## Events

- Set the Checkbox value

```js
Checkbox.select(true)
```
- Get the Checkbox status

```js
let isSelect = Checkbox.isSelect()
```

## Code Example

```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js"

// UI context
let context = {}

// UI initialization
ui.init({ orientation: 1 }, context);

// Create screen
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// Create style collection
let labelStyle = ui.Style.build()
// Add properties to the collection
labelStyle.padColumn(10)

// Create Checkbox control
let Checkbox = ui.Checkbox.build(mainView.id + 'Checkbox', mainView)
Checkbox.setPos(150, 60)
// Bind style to Checkbox
Checkbox.addStyle(labelStyle)

// Set text content
Checkbox.text("Checkbox")
// Set Checkbox value
Checkbox.select(true)
// Create font
let label1_font = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 20, ui.Utils.FONT_STYLE.NORMAL)
// Set text font
Checkbox.textFont(label1_font)

// Load screen
ui.loadMain(mainView)
```