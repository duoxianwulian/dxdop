//build：20240311
//button控件 相对基类没有新功能
import utils from "./uiUtils.js"
import base from "./uiBase.js"
let button = {}

button.build = function (id, parent) {
    let temp = utils.validateBuild(button.all, id, parent, 'button')
    let my = {}
    my.obj = new utils.GG.NativeButton({ uid: id }, temp)
    button.all[id]=my.obj
    my.id = id
    let comp = Object.assign(my, base);
    return comp;
}
export default button;