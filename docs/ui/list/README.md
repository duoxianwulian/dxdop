<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# List

## Overview

A list is essentially a vertically arranged rectangle where buttons point to the rectangle and text can be added.

## Parts and Styles

Lists can be divided into text lists and menu lists. Text lists are used for display, while menu lists can send click events.

### Button

`addBtn(src, text)`: Adds a full-width button with an icon.

- `src` is an image or symbol.
- `text` is the button text.

If the text is too long, it will start scrolling horizontally.

### Texts

`addText(text)`: Adds text.

## Events

The list itself does not send any special events, but menu lists will send events from buttons just like other controls.

## Code Example

![alt text](list.png)

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

let list = ui.List.build(mainView.id + 'list', mainView)
list.setPos(400, 200)
list.setSize(100, 150)
let btn123 = list.addBtn(null, "123")
list.addBtn(null, "456")
list.addBtn(null, "789")
list.addBtn(null, "000")
// Create font
let font_24 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 24, ui.Utils.FONT_STYLE.ITALIC | ui.Utils.FONT_STYLE.BOLD)

list.textFont(font_24)

btn123.on(ui.Utils.EVENT.CLICK, () => {
    log.info(list.getBtnText(btn123))
})

// Load screen
ui.loadMain(mainView)
```