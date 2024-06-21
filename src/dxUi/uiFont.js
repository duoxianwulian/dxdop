//build：20240311
//字体对象(要支持中文，需要使用支持中文的字体ttf文件)
import utils from "./uiUtils.js"
let font = {}
/**
 * 构建字体
 * @param {string} ttf 字体ttf文件的完整路径 
 * @param {number} size 字体大小
 * @param {number} style 字体样式，参考utils.FONT_STYLE
 * @returns 
 */
font.build = function (ttf, size, style) {
    let comp = {}
    comp.obj = utils.GG.NativeFont.lvFontInit(ttf, size, style)
    return comp;
}

export default font;