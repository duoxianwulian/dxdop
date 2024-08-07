# Fonts（字体）

## 概述

在LVGL中，字体是由位图和其他必要的信息组成，用于绘制单个字母（字形）的图像。字体存储在 lv_font_t 变量中，并可以在样式的 textFont 函数设置。例如： 
```js
// 创建字体样式 参数（字体包url， 字号， 字体样式{NORMAL: 默认样式，ITALIC：斜体， BOLD： 粗体}）
let font_24 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 24, ui.Utils.FONT_STYLE.ITALIC | ui.Utils.FONT_STYLE.BOLD)
// 设置文本样式
label.textFont(font_24)
```
字体有一个 格式 属性，描述了字形绘制数据的存储方式。它有两个分类： 传统简单格式 和 高级格式。在传统简单格式中，字体存储在一个简单的位图数组中。在高级格式中，字体以不同的方式存储，例如 矢量图、 SVG 等。

在传统简单格式中，存储的像素值决定了像素的不透明度。这样，通过更高的位深度（每像素位数），字母的边缘可以更加平滑。可能的位深度值为1、2、4和8（更高的值意味着更好的质量）。

格式属性还影响存储字体所需的内存量。例如， format = LV_FONT_GLYPH_FORMAT_A4 的字体大小大约是 format = LV_FONT_GLYPH_FORMAT_A1 的四倍。
