<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Styles

## Overview

"Styles" are used to set the appearance of objects. The styles in LVGL are inspired by CSS. In short, the concept is as follows:

- A style is an `lv_style_t` variable that can hold properties such as border width, text color, etc., similar to a class in CSS.

- Styles can be assigned to objects to change their appearance. When assigning, you can specify the target part (pseudo-elements in CSS) and target state (pseudo-classes). For example, you can add `style_blue` when a slider is in the pressed state.

- A style can be used by any number of objects.

- Styles can be cascaded, meaning multiple styles can be assigned to an object, with each style having different properties. Therefore, not all properties need to be specified in a single style.

- Recently added styles have higher priority. This means if a property is specified in two styles, the latest style will be used.

- Some properties (e.g., text color) can be inherited from the parent if not specified in the object.

- Objects can also have local styles with higher priority than "normal" styles.

- Unlike CSS, where pseudo-classes describe different states (e.g., :focus), in LVGL, properties are assigned to given states.

- Transitions can be applied when an object changes state.

## Style Properties

| Property Name    | API          | Parameters                                     | Example               |
| ---------------- | ------------ | ---------------------------------------------- | --------------------- |
| Coordinates       | `setPos`      | (Left, Top)<br>Parameter 1 is X-coordinate, Parameter 2 is Y-coordinate | `setPos(150, 130)`    |
| Size             | `setSize`     | (Width, Height)<br>Parameter 1 is element width, Parameter 2 is element height | `setSize(140, 60)`    |
| Padding          | `padAll`      | (Number)                                       | `padAll(10)`          |
| Padding Top      | `padTop`      | (Number)                                       | `padTop(10)`          |
| Padding Bottom   | `padBottom`   | (Number)                                       | `padBottom(10)`       |
| Padding Left     | `padLeft`     | (Number)                                       | `padLeft(10)`         |
| Padding Right    | `padRight`    | (Number)                                       | `padRight(10)`        |
| Border Width     | `borderWidth` | (Number)                                       | `borderWidth(3)`      |
| Radius           | `radius`      | (Number)                                       | `radius(5)`           |
| Background Opacity | `bgOpa`     | (Number)<br>Parameter is an integer from 0 to 100, where 0 is fully transparent | `bgOpa(100)`         |
| Background Color | `bgColor`     | (String or Number)<br>Parameter is a HEX color value in string or hexadecimal number | `bgColor(0x2196F3)`  |
| Element Opacity   | `opa`        | (Number)<br>Parameter is an integer from 0 to 100, where 0 is fully transparent | `opa(100)`           |
| Text Color       | `textColor`   | (String or Number)<br>Parameter is a HEX color value in string or hexadecimal number | `textColor('#2196F3')` |
| Text Alignment   | `textAlign`   | (Number)<br>0: "AUTO" (automatic left/right alignment based on language),<br>1: "LEFT" (left alignment),<br>2: "CENTER" (center alignment),<br>3: "RIGHT" (right alignment) | `textAlign(0)`       |
| Gradient Color    | `bgGradColor` | (Number)<br>Parameter is a hexadecimal number | `bgGradColor(0x2196F3)` |
| Gradient Direction | `bgGradDir`  | (String)<br>VER: vertical,<br>HOR: horizontal,<br>NONE: no gradient | `bgGradDir(ui.Utils.GRAD.VER)` |
| Gradient Start Position | `bgMainStop` | (Number)<br>Parameter is a number between 0 and 255, where 0 represents the start, 128 is the center, and 255 is the end of the element | `bgMainStop(0)` |
| Gradient End Position | `bgGradStop` | (Number)<br>Parameter is a number between 0 and 255, where 0 represents the start, 128 is the center, and 255 is the end of the element | `bgGradStop(255)` |

### Code Example

```js
// ui context
let context = {}

// Initialize ui
ui.init({ orientation: 1 }, context);

// Create screen
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// Create style collection
let labelStyle = ui.Style.build()
// Add properties to the collection
labelStyle.borderWidth(1)
labelStyle.radius(20)
labelStyle.bgOpa(100)
labelStyle.bgColor(0x2196F3)

let greenBg = ui.Style.build()
greenBg.bgColor(0x219600)

// Create button control
let button1 = ui.Button.build(mainView.id + 'button1', mainView)
button1.setPos(50, 130)
button1.setSize(100, 60)
// Bind style to button
button1.addStyle(labelStyle)

// Create button control
let button2 = ui.Button.build(mainView.id + 'button2', mainView)
button2.setPos(300, 130)
button2.setSize(100, 60)
// Bind style to button
button2.addStyle(labelStyle)
button2.addStyle(greenBg)

// Load screen
ui.loadMain(mainView)
```