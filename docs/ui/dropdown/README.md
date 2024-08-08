<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Drop-down list

## Overview

A drop-down list allows users to select a value from a list of options.

The options list of the drop-down is closed by default, and the options can be single values or predefined text. When the drop-down list is clicked, it creates a list from which the user can select an option. Once a value is selected, the list is removed and will be regenerated upon the next click.

## Parts and Styles

The drop-down component consists of the following elements: "Button" and "List" (which are not related to button and list controls).

### Button

- **LV_PART_MAIN**: The background of the button. It uses typical background properties and text properties for the text on it.

- **LV_PART_INDICATOR**: Usually an arrow symbol, which can be an image or text (LV_SYMBOL).

When the button is opened, it is set to the **LV_STATE_CHECKED** state.

### List

- **LV_PART_MAIN**: The list itself. Uses typical background properties. The height of the list can be limited by setting `max_height`.

- **LV_PART_SCROLLBAR**: Background, border, shadow properties, and width (for its own width) of the list's scrollbar, as well as the right padding for the right-side margin.

- **LV_PART_SELECTED**: Refers to the currently pressed, selected, or pressed + selected option. Also uses typical background properties.

The list is hidden or shown when opened or closed. To add styles to it, use `getList()` to get the list object.

### Symbol

A symbol (usually an arrow) can be added to the drop-down list using `setSymbol(url)`.

## Direction

The list can be created (expanded) on any side. By default, it is set to **LV_DIR_BOTTOM** (expands downward), but this can be modified using the function `lv_dropdown_set_dir(dropdown, LV_DIR_LEFT)` to change the expansion direction.

If the list extends beyond the screen (or parent object's bounds) in the specified direction, it will automatically adjust its expansion direction.

## Manually open/close

To manually open or close the drop-down list, you can use the `lv_dropdown_open(dropdown)` and `lv_dropdown_close(dropdown)` functions.

## Events

The supported events that are already encapsulated include `setOptions()` [sets the options content], `getList()` [gets the drop-down list], `setSelected()` [sets the selected item index], `getSelected()` [gets the selected item index], `setSymbol()` [sets the symbol], and others. These functions can be called directly. Example:

```js
Dropdown.setSelected(3) // Sets the selected item to the one with index 3
```

## Code Example

![alt text](dropdown.png)

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
let theStyle = ui.Style.build()
// Add properties to the collection
theStyle.padTop(10)
theStyle.padBottom(10)

// Create Drop-down control
let Dropdown = ui.Dropdown.build(mainView.id + 'Dropdown', mainView)

Dropdown.setPos(120, 60)
Dropdown.setSize(200, 80)
// Bind style to Drop-down
Dropdown.addStyle(theStyle)

let arr = ["Golden Cake", "Double Skin Milk", "Oyster Omelet", "Dragon Beard Noodles", "Peking Duck"]
// Set drop-down options content
Dropdown.setOptions(arr)
// Set drop-down icon
Dropdown.setSymbol('/app/code/resource/image/down.png')
// Get drop-down list
let l = Dropdown.getList()
// Create font
let label1_font = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 20, ui.Utils.FONT_STYLE.NORMAL)
// Set text font
Dropdown.textFont(label1_font)
// Bind font to drop-down list
l.textFont(label1_font)
// Set selected item
Dropdown.setSelected(3)
// Load screen
ui.loadMain(mainView)
```