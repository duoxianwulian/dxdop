<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Text area

## Overview

A text area is a basic object that includes a label and a cursor. You can add text or characters to the text area. Long lines will wrap, and when the text content becomes long enough (exceeding the visible area of the text box), the text area can scroll.

It supports single-line input mode and password input mode.

## Usage

- You can configure the text area for single-line input mode by using `setOneLine(true/false)`. In this mode, the height is automatically set to display only one line, line breaks are ignored, and word wrapping is disabled.

```js
textarea.setOneLine(true)
```

- Set the password mode where the content is displayed as dots. The text area supports password mode, which can be enabled using `setPasswordMode(true/false)`.
> In password mode, `lv_textarea_get_text(textarea)` returns the actual text entered, not the • character.

```js
textarea.setPasswordMode(true)
```

- Set the text alignment, such as left, center, or right. You can enable this mode using `setAlign(ui.Utils.TEXT_ALIGN.AUTO)`.

> 1. "AUTO": Default mode, automatically aligns left or right depending on the language;
> 2. "LEFT": Aligns to the left;
> 3. "CENTER": Aligns to the center;
> 4. "RIGHT": Aligns to the right;

```js
textarea.setAlign(dxui.Utils.TEXT_ALIGN.RIGHT)
```

- Set the text length. You can use `setMaxLength(length)` to set the maximum number of characters the text area can hold.

```js
textarea.setMaxLength(32)
```

- Enable or disable cursor positioning, showing or hiding the cursor. You can set the cursor display using `setCursorClickPos(true/false)`.

```js
textarea.setCursorClickPos(true)
```

- Insert text at the current cursor position. You can use `lvTextareaAddText(string)` to insert text or characters at the current cursor position.

```js
textarea.lvTextareaAddText("New text")
```

- Delete the character to the left of the current cursor position.

```js
textarea.lvTextareaDelChar()
```

- Get or set the text content.

```js
textarea.text('text')
```

- Placeholder text. You can specify placeholder text using `obj.lvTextareaSetPlaceholderText("请输入...")`. When the text area is empty, the placeholder text will be displayed.

```js
textarea.obj.lvTextareaSetPlaceholderText("请输入...")
```

## Events

- The `VALUE_CHANGED` event is triggered when the content of the text area changes.

```js
textarea.on(ui.Utils.EVENT.VALUE_CHANGED, () => {
    log.info("VALUE_CHANGED:" + textarea.text())
})
```

## Code Example

![alt text](textarea.png)

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

let textarea = ui.Textarea.build(mainView.id + 'textarea', mainView)
textarea.setPos(100, 100)
textarea.width(300)
textarea.padAll(20)

// Create font
let font_24 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 24, ui.Utils.FONT_STYLE.ITALIC | ui.Utils.FONT_STYLE.BOLD)

textarea.textFont(font_24)

textarea.obj.lvTextareaSetPlaceholderText("请输入...")

textarea.on(dxui.Utils.EVENT.CLICK, openSearch)

textarea.on(ui.Utils.EVENT.VALUE_CHANGED, () => {
    log.info("VALUE_CHANGED:" + textarea.text())
})

// Load screen
ui.loadMain(mainView)
```