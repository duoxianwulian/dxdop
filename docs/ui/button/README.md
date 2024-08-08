<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Button

## Overview
Button controls have the basic properties of screen controls, such as coordinates, parent object, style, and events like click. However:
- They cannot scroll.
- They have default width and height.

Note that unlike typical buttons, this framework's buttons allow child elements and do not have text properties. Any descriptive text or icons on the button must be added as child elements.

### Coordinates

The coordinates are set relative to the parent element. Parameter 1 is the X-axis, and parameter 2 is the Y-axis.
```js
button.setPos(50, 130)
```

### Size

The size parameters are: parameter 1 for width and parameter 2 for height.
```js
button.setSize(50, 130)
```

## Style
Button styles are applicable from the style sets provided within the framework. See style for more details.

## Events
Currently, buttons support most event bindings:
- Click: Executes the method when the button is released, without considering the touch duration.
```js
button.on(ui.Utils.EVENT.CLICK, () => {})
```
- Long press: The method executes only if the touch duration exceeds 400 milliseconds.
```js
button.on(ui.Utils.EVENT.LONG_PRESSED, () => {})
```
- Short press: The method does not execute if the touch duration exceeds 400 milliseconds.
```js
button.on(ui.Utils.EVENT.SHORT_PRESSED, () => {})
```
For more event details, please refer to Events.

## Code Example
![alt text](btn.png)
```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";

// UI context
let context = {}

// UI initialization
ui.init({ orientation: 1 }, context);

// Create screen
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// Create style collection
let labelStyle = ui.Style.build()
// Add properties to the collection
labelStyle.radius(10)
labelStyle.bgOpa(100)
labelStyle.bgColor(0x2196F3)

let greenBg = ui.Style.build()
greenBg.bgColor(0x219600)

// Create button control
let button1 = ui.Button.build(mainView.id + 'button1', mainView)
button1.setPos(150, 60)
button1.setSize(150, 60)
// Bind style to button
button1.addStyle(labelStyle)

// Create button control
let button2 = ui.Button.build(mainView.id + 'button2', mainView)
button2.setPos(150, 200)
button2.setSize(150, 60)
// Bind style to button
button2.addStyle(labelStyle)
button2.addStyle(greenBg)

// Create text control
let label1 = ui.Label.build(mainView.id + 'label1', button1)
// Set text content
label1.text("CLICK")
// Set text color
label1.textColor(0xffffff)
// Center element relative to parent element
label1.align(ui.Utils.ALIGN.CENTER, 0, 0)
// Create font
let label1_font = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 18, ui.Utils.FONT_STYLE.NORMAL)
// Set text font
label1.textFont(label1_font)

// Create text control
let label2 = ui.Label.build(mainView.id + 'label2', button2)
// Set text content
label2.text("LONG_PRESSED")
// Set text color
label2.textColor(0xffffff)
// Center element relative to parent element
label2.align(ui.Utils.ALIGN.CENTER, 0, 0)
// Create font
let label2_font = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 14, ui.Utils.FONT_STYLE.NORMAL)
// Set text font
label2.textFont(label2_font)

let aa = ["#ffff80", "#ffff00", "#ff8000" ,"#ff0000" ,"#800000"]
let flag = 0
button1.on(ui.Utils.EVENT.CLICK, () => {
    flag++;
    button1.bgColor(aa[flag%5])
})
button2.on(ui.Utils.EVENT.LONG_PRESSED, () => {
    flag++;
    button2.bgColor(aa[flag%5])
})

// Load screen
ui.loadMain(mainView)
```