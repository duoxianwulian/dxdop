<p align="right">
    <a href="./README.md">English</a>| <b>中文</b>
</p>


# Text area（文本框）

## 概述

文本框是一个 基础对象 ，其上面有一个 标签(Label) 和一个光标(cursor). 我们可以向文本框中添加文本或字符. 长行会被换行，当文本内容变得足够长时(文本框可视区域容纳不下时)，可以滚动文本框.

支持单行输入模式和密码输入模式.

## Usage（用法）

- 可以使用 setOneLine(true/false) 将文本框配置为单行输入模式. 在这个模式下，高度自动设置为仅显示一行，忽略换行符，并禁用自动换行.

```js
textarea.setOneLine(true)
```

- 设置密码模式，内容显示为·号.文本框支持密码模式，可以通过 setPasswordMode(true/false) 启用该模式.
> 在密码模式下 lv_textarea_get_text(textarea) 返回的是输入的实际文本，而不是 • 字符.

```js
textarea.setPasswordMode(true)
```

- 设置内容对齐方式，居中靠左靠右等.可以通过 setAlign(ui.Utils.TEXT_ALIGN.AUTO) 启用该模式.

>1. "AUTO": 默认模式，会根据语种自动靠左或者靠右；
>2. "LEFT": 向左对齐；
>3. "CENTER": 居中对齐；
>4. "RIGHT": 向右对齐；

```js
textarea.setAlign(dxui.Utils.TEXT_ALIGN.RIGHT)
```
- 设置文本长度.可以使用 setMaxLength(length) 设置文本框可容纳的最大字符数

```js
textarea.setMaxLength(32)
```

- 设置是否启用光标定位，是否显示 | .可以通过 setCursorClickPos(true/false) 设置光标显示隐藏.

```js
textarea.setCursorClickPos(true)
```

- 在当前光标位置插入文本.可以使用 lvTextareaAddText(string) 在光标的当前位置插入文本或字符.

```js
textarea.lvTextareaAddText("New text")
```

- 从当前光标位置删除左边的字符.

```js
textarea.lvTextareaDelChar()
```

- 获取/设置文本内容.

```js
textarea.text('text')
```

- 占位符. 可以通过 obj.lvTextareaSetPlaceholderText("请输入...") 指定占位符文本，当文本框的内容为空时，所设置的占位符文本将会展示出来.

```js
textarea.obj.lvTextareaSetPlaceholderText("请输入...")
```

## 事件

- 当文本框的内容被改变时就会激活 VALUE_CHANGED 事件.

```js
textarea.on(ui.Utils.EVENT.VALUE_CHANGED, () => {
    log.info("VALUE_CHANGED:" + textarea.text())
})
```

## 代码示例

![alt text](textarea.png)


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

let textarea = ui.Textarea.build(mainView.id + 'textarea', mainView)
textarea.setPos(100, 100)
textarea.width(300)
textarea.padAll(20)

// 创建字体
let font_24 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 24, ui.Utils.FONT_STYLE.ITALIC | ui.Utils.FONT_STYLE.BOLD)

textarea.textFont(font_24)

textarea.obj.lvTextareaSetPlaceholderText("请输入...")

textarea.on(dxui.Utils.EVENT.CLICK, openSearch)

textarea.on(ui.Utils.EVENT.VALUE_CHANGED, () => {
    log.info("VALUE_CHANGED:" + textarea.text())
})

// 加载屏幕
ui.loadMain(mainView)
```

