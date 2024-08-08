<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Button Matrix

## Overview
The Button Matrix control is a lightweight implementation that displays multiple buttons in rows and columns. The buttons are not actually created but are drawn in real-time, making them lightweight. A single button only uses 8 bytes of memory, compared to a regular Button control, which uses ~100-150 bytes plus the memory used by the Label control.

### Coordinates

The coordinates are set relative to the parent element. Parameter 1 is the X-axis, and parameter 2 is the Y-axis.
```js
keys.setPos(50, 130)
```

### Size

The size parameters are: parameter 1 for width and parameter 2 for height.
```js
keys.setSize(50, 130)
```

## Style
Button styles are applicable from the style sets provided within the framework. See style for more details. However, you need to specify where the style should be applied. By default, the style is bound to the keyboard itself. To apply the style to the internal items, add the `ui.Utils.STYLE_PART.ITEMS` field.
```js
keys.addStyle(boxStyle)
keys.addStyle(btnStyle, ui.Utils.STYLE_PART.ITEMS)
```
The above applies to all elements uniformly. If you need to set styles for individual elements, you must call the JavaScript methods `lvDrawRectReset` for element style and `lvDrawLabelReset` for element text style.
```js
keys.obj.addEventCb((e) => {
    let dsc = e.lvEventGetDrawPartDsc()
    if (dsc.class_p == keys.obj.ClassP && dsc.type == ui.Utils.ENUM.LV_BTNMATRIX_DRAW_PART_BTN) {
        // Filter specific buttons by ID, where ID is the button index, starting from 0
        if (dsc.id == 11) {
            // Modify background color and button radius
            ui.Utils.GG.NativeDraw.lvDrawRectReset(dsc.rect_dsc, { bg_color: 0x2196F3, radius: 30 })
            // Modify text color
            ui.Utils.GG.NativeDraw.lvDrawLabelReset(dsc.label_dsc, { color: 0xFFFFFF })
        } else {
            ui.Utils.GG.NativeDraw.lvDrawRectReset(dsc.rect_dsc, { bg_color: 0xE0E0E0 })
        }
    }
}, ui.Utils.ENUM.LV_EVENT_DRAW_PART_BEGIN)
```

## Events
Button groups support most events, and the single style setting above uses the draw event.

- Click event binding
```js
keys.on(ui.Utils.EVENT.CLICK, () => {})
```
For more event details, please refer to Events.

## Code Example

![alt text](buttons.png)
```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js"
import log from '../dxmodules/dxLogger.js';

// UI context
let context = {}

// UI initialization
ui.init({ orientation: 1 }, context);

// Create screen
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// Create keyboard collection
let boxStyle = ui.Style.build()
// Add properties to the collection
boxStyle.padAll(25)
boxStyle.padColumn(20)
boxStyle.padRow(20)
// Create button collection
let btnStyle = ui.Style.build()
// Add properties to the collection
btnStyle.radius(10)
btnStyle.bgColor(0xE0E0E0)
btnStyle.textColor(0x000000)

// Create button group
let keys = ui.Buttons.build(mainView.id + 'keys', mainView)
// Set keyboard group size
keys.setSize(mainView.width(), mainView.height() - 60)
// Keyboard position
keys.setPos(0, 60)
// Keyboard button collection
keys.data(["0", "1", "2", "3", "4", "\n",
    "5", "6", "7", "8", "9", "\n",
    "Cancel", "Confirm", ""])
// Bind styles to the buttons
keys.addStyle(boxStyle) // Set overall keyboard style
keys.addStyle(btnStyle, ui.Utils.STYLE_PART.ITEMS) // Set button styles
// Set specific button styles
keys.obj.addEventCb((e) => {
    let dsc = e.lvEventGetDrawPartDsc()
    if (dsc.class_p == keys.obj.ClassP && dsc.type == ui.Utils.ENUM.LV_BTNMATRIX_DRAW_PART_BTN) {
        // Filter specific buttons by ID, where ID is the button index, starting from 0
        if (dsc.id == 11) {
            // Modify background color
            ui.Utils.GG.NativeDraw.lvDrawRectReset(dsc.rect_dsc, { bg_color: 0x2196F3, radius: 10 })
            // Modify text color
            ui.Utils.GG.NativeDraw.lvDrawLabelReset(dsc.label_dsc, { color: 0xFFFFFF })
        } else {
            ui.Utils.GG.NativeDraw.lvDrawRectReset(dsc.rect_dsc, { bg_color: 0xE0E0E0 })
        }
    }
}, ui.Utils.ENUM.LV_EVENT_DRAW_PART_BEGIN)


// Set font
let font14 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 14, ui.Utils.FONT_STYLE.NORMAL)
// Bind font
keys.textFont(font14)
// Button click event; `id` is the index, `text` is the button text
keys.on(ui.Utils.EVENT.CLICK, () => {
    let clickBtn = keys.clickedButton()
    log.info("========== id:" + clickBtn.id + " =========== text:" + clickBtn.text)
})
// Load screen
ui.loadMain(mainView)
```