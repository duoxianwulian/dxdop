<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Label

## Overview

Labels are basic objects used to display text.

### Coordinates

Coordinates are set relative to the parent element, with parameter 1 being the X-axis and parameter 2 being the Y-axis.
```js
label.setPos(50, 130)
```

### Size

Size settings use parameter 1 for element width and parameter 2 for height.
```js
label.setSize(50, 130)
```

If the control's size is smaller than the content, the display mode will change according to the set type:
- **"WRAP"**: Text wraps when it is long.
- **"DOT"**: Text is replaced with "..." when it is long.
- **"SCROLL"**: Text scrolls automatically when it is long.
- **"SCROLL_CIRCULAR"**: Text scrolls circularly when it is long.
- **"CLIP"**: Text is clipped when it is long.

```js
// Set to automatic line wrap
label.longMode(ui.Utils.LABEL_LONG_MODE.WRAP)
```

For fixed line breaks, use `\n`.
```js
// Set text content
label2.text("line1\nline2\n\nline4")
```

## Style

Label styles apply to the style set provided by the framework; see the `style` documentation for details.

## Events

Labels do not send special events.

## Code Example

![alt text](label.png)

```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js"

// ui context
let context = {}

// Initialize ui
ui.init({ orientation: 1 }, context);

// Create screen
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// Create style set
let labelStyle = ui.Style.build()
// Add properties to set
labelStyle.radius(10)
labelStyle.bgOpa(100)
labelStyle.bgColor(0x2196F3)

// Create text control
let label2 = ui.Label.build(mainView.id + 'label2', mainView)
// Set text content
label2.text("LONG_PRESSED")
// Center element relative to parent
label2.align(ui.Utils.ALIGN.CENTER, 0, 0)
// Create font
let font_24 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 24, ui.Utils.FONT_STYLE.ITALIC | ui.Utils.FONT_STYLE.BOLD)
// Set text font
label2.textFont(font_24)
// Load screen
ui.loadMain(mainView)
```