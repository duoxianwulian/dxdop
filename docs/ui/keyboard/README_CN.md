<p align="right">
    <a href="./README.md">English</a>| <b>中文</b>
</p>


# Keyboard（键盘）

## 概述

键盘(lv_keyboard)对象是一个特殊的 按钮矩阵，自身实现了按键(map)映射和其他功能，目的是用于实现一个虚拟键盘将文本写入 文本框 .

与按钮矩阵类似，键盘由 2 部分组成：

- LV_PART_MAIN 主要部分(自身背景部分)，使用所有组件默认都有的典型的背景样式属性.

- LV_PART_ITEMS 键盘中的按钮.使用所有典型的背景属性以及 text 属性.

## 用法

### 模式

键盘可以切换下面这几种输入模式：
- TEXT_LOWER： 26键英文小写键盘模式
- TEXT_UPPER 26键英文大写键盘模式
- SPECIAL 特殊字符输入模式
- NUMBER 数字键盘模式.可以输入数字、+/- 符号和小数点
- K26 26键键盘模式
- K9 9键键盘模式

更改模式会更改键盘的按钮的文字甚至布局.

您可以通过 mode(mode) 函数手动设置模式.默认的模式是 TEXT_UPPER.

```js
// 设置数字键盘
keyboard.mode(ui.Utils.KEYBOARD.NUMBER)
```

### 绑定文本框

你可以将 setTextarea 分配给键盘绑定，之后点击键盘上的按钮就能更改文本框中的内容.
可以通过 setTextarea(input) 函数将文本框分配给键盘绑定.

### 按键弹出提示

这个效果就像常见的安卓和iOS键盘上的效果：按下按键时会有在相应的按键之上弹出该按键提示当前按下的按钮.调用函数 setPopovers(true) 即可得到这样得效果.默认控制map默认的配置是只在有text的按键上显示弹出提示框，而不会在空格键(space)上显示.

请注意，顶行中的按键的弹出窗口将被绘制在超过键盘的边界之外.因此，建议在键盘顶部保留额外的可用空间，或确保在其顶部边界附近的任何其他控件(对象)之后再添加或者创建键盘，来确保弹出窗口不被这些控件遮挡.

目前，弹出窗口仅仅是一种视觉效果，还不支持使用其他字符，例如重音符号等.


## 事件




## 代码示例

![alt text](keyboard.png)


```js
// 设置文本内容
label2.text("line1\nline2\n\nline4")
```