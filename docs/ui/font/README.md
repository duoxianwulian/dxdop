<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>


# Fonts

## Overview

In LVGL, fonts are composed of bitmaps and other necessary information used to render images of individual letters (glyphs). Fonts are stored in an `lv_font_t` variable and can be set in a style using the `textFont` function. For example:
```js
// Create a font style with parameters (font package URL, font size, font style {NORMAL: default style, ITALIC: italic, BOLD: bold})
let font_24 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 24, ui.Utils.FONT_STYLE.ITALIC | ui.Utils.FONT_STYLE.BOLD)
// Set the text style
label.textFont(font_24)
```

Fonts have a `format` property that describes how the glyph rendering data is stored. There are two categories: **Simple format** and **Advanced format**. In the simple format, fonts are stored in a straightforward bitmap array. In the advanced format, fonts are stored differently, such as in vector graphics, SVG, etc.

In the simple format, the stored pixel values determine the opacity of the pixels. This allows for smoother edges on letters with higher bit depth (bits per pixel). Possible bit depth values are 1, 2, 4, and 8 (higher values mean better quality).

The `format` property also affects the amount of memory required to store the font. For example, a font with `format = LV_FONT_GLYPH_FORMAT_A4` requires about four times the size of a font with `format = LV_FONT_GLYPH_FORMAT_A1`.
