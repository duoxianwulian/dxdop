//build：20240315
//控件样式 每个控件可以绑定样式对象，设置多种样式
import utils from "./uiUtils.js"

let style = {}
style.build = function () {
    let comp = {}
    comp.obj = new utils.GG.NativeStyle()
    comp.obj.lvStyleInit()
    /**
     * 设置左右上下的内边距都为一个值
     * @param {number} pad 边距值
     */
    comp.padAll = function (pad) {
        this.obj.lvStyleSetPadAll(pad)
    }
    /**
     * 设置右内边距都为一个值
     * @param {number} pad 边距值
     */
    comp.padRight = function (pad) {
        this.obj.lvStyleSetPadRight(pad)
    }
    /**
     * 设置左内边距都为一个值
     * @param {number} pad 边距值
     */
    comp.padLeft = function (pad) {
        this.obj.lvStyleSetPadLeft(pad)
    }
    /**
     * 设置上内边距都为一个值
     * @param {number} pad 边距值
     */
    comp.padTop = function (pad) {
        this.obj.lvStyleSetPadTop(pad)
    }
    /**
     * 设置下内边距都为一个值
     * @param {number} pad 边距值
     */
    comp.padBottom = function (pad) {
        this.obj.lvStyleSetPadBottom(pad)
    }
    /**
     * 设置列与列之间的边距都为一个值
     * @param {number} pad 边距值
     */
    comp.padColumn = function (pad) {
        this.obj.lvStyleSetPadColumn(pad)
    }
    /**
     * 设置行与行之间的边距都为一个值
     * @param {number} pad 边距值
     */
    comp.padRow = function (pad) {
        this.obj.lvStyleSetPadRow(pad)
    }
    /**
     * 设置边框宽度
     * @param {number} w 
     */
    comp.borderWidth = function (w) {
        this.obj.lvStyleSetBorderWidth(w)
    }
    /**
     * 设置边圆角
     * @param {number} r 
     */
    comp.radius = function (r) {
        this.obj.lvStyleSetRadius(r)
    }
    /**
     * 设置背景透明度，值范围是0-100，值越小越好
     * @param {number} opa 必须是0-100
     */
    comp.bgOpa = function (opa) {
        this.obj.lvStyleSetBgOpa(utils.OPA_MAPPING(opa))
    }
    /**
     * 设置自身透明度，值范围是0-100，值越小越好
     * @param {number} opa 必须是0-100
     */
    comp.opa = function (opa) {
        this.obj.lvStyleSetOpa(utils.OPA_MAPPING(opa))
    }
    /**
     * 设置背景颜色
     * @param {any} color 支持数字类型：比如0x34ffaa；字符串类型(#开头),比如:'#34ffaa'
     */
    comp.bgColor = function (color) {
        this.obj.lvStyleSetBgColor(utils.colorParse(color))
    }
    /**
     * 设置文本颜色
     * @param {any} color  支持数字类型：比如0x34ffaa；字符串类型(#开头),比如:'#34ffaa'
     */
    comp.textColor = function (color) {
        this.obj.lvStyleSetTextColor(utils.colorParse(color))
    }
    /**
     * 设置文本对齐方式
     * @param {number} type  参考utils.TEXT_ALIGN
     */
    comp.textAlign = function (type) {
        this.obj.lvStyleSetTextAlign(type)
    }
    /**
     * 设置文本字体
     * @param {object} font font.js里build返回的对象 
     */
    comp.textFont = function (font) {
        if (!font || !font.obj) {
            throw new Error("style.textFont: 'font' parameter should not be null")
        }
        this.obj.lvStyleSetTextFont(font.obj)
    }
    /**
     * 设置渐变色
     * @param {number} color 渐变色，例如:0xffffff
     */
    comp.bgGradColor = function (color) {
        this.obj.lvStyleSetBgGradColor(color)
    }
    /**
     * 设置渐变色方向
     * @param {number} dir 方向，目前只支持水平和垂直
     */
    comp.bgGradDir = function (dir) {
        this.obj.lvStyleSetBgGradDir(dir)
    }
    /**
     * 背景色的结束位置(0-255)
     * @param {number} value 距离，从左端开始计算
     */
    comp.bgMainStop = function (value) {
        this.obj.lvStyleSetBgMainStop(value)
    }
    /**
     * 渐变色的距离(0-255)
     * @param {number} value 距离，从背景色的结束位置开始计算
     */
    comp.bgGradStop = function (value) {
        this.obj.lvStyleSetBgGradStop(value)
    }
    return comp;
}

export default style;