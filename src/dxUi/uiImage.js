//build：20240311
//image控件 
import utils from "./uiUtils.js"
import base from "./uiBase.js"
let image = {}

image.build = function (id, parent) {
    let temp = utils.validateBuild(image.all, id, parent, 'image')
    let my = {}
    my.obj = new utils.GG.NativeImage({ uid: id }, temp)
    image.all[id]=my.obj
    my.id = id
    /**
     * 设置image的来源或获取来源
     * @param {string} path 非必填，图片文件的绝对路径，如果没有填或者不是string类型就是获取
     */
    my.source = function (path) {
        if (utils.validateString(path)) {
            this.obj.lvImgSetSrc(path)
        } else {
            return this.obj.lvImgGetSrc()
        }
    }
    let comp = Object.assign(my, base);
    return comp;
}
export default image;