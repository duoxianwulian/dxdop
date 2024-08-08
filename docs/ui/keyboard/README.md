<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Keyboard

## Overview

The `lv_keyboard` object is a special button matrix that implements key (map) mappings and other functionalities to provide a virtual keyboard for entering text into text boxes.

Similar to the button matrix, the keyboard is composed of two parts:

- **LV_PART_MAIN**: The main part (background of the keyboard itself), using typical background style properties that all components have by default.
  
- **LV_PART_ITEMS**: The buttons on the keyboard. Uses typical background properties as well as text properties.

## Usage

### Modes

The keyboard can switch between the following input modes:
- **TEXT_LOWER**: 26-key English lowercase keyboard mode
- **TEXT_UPPER**: 26-key English uppercase keyboard mode
- **SPECIAL**: Special characters input mode
- **NUMBER**: Numeric keyboard mode. Allows input of numbers, +/-, and decimal points
- **K26**: 26-key keyboard mode
- **K9**: 9-key keyboard mode

Changing the mode will change the text and even the layout of the keyboard buttons.

You can manually set the mode using the `mode(mode)` function. The default mode is `TEXT_UPPER`.

```js
// Set to numeric keyboard mode
keyboard.mode(ui.Utils.KEYBOARD.NUMBER)
```

### Binding to Textbox

You can bind the keyboard to a text box using `setTextarea`. Once bound, clicking buttons on the keyboard will change the content in the text box. You can bind the text box to the keyboard using the `setTextarea(input)` function.

### Key Popups

This effect is similar to the popups on common Android and iOS keyboards: when a key is pressed, a popup showing the current pressed button appears above the corresponding key. This effect can be achieved by calling `setPopovers(true)`. By default, the popup is shown only on keys with text and not on the space key.

Please note that popups for keys in the top row will be drawn outside the keyboard's boundaries. Therefore, it is recommended to leave extra space at the top of the keyboard or ensure that the keyboard is added or created after any other controls (objects) near its top boundary to ensure the popup is not obstructed by these controls.

Currently, popups are purely a visual effect and do not support using other characters, such as accent marks, etc.


## Events

## Code Example

![alt text](keyboard.png)

```js
// Set text content
label2.text("line1\nline2\n\nline4")
```