import dxui from '../../dxmodules/dxUi.js'
const passwordView = {}
passwordView.init = function (context) {
    dxui.initContext(context)
    /**************************************************创建屏幕*****************************************************/
    let screen_password = dxui.View.build('screen_password', dxui.Utils.LAYER.MAIN)
    passwordView.screen_password = screen_password
    screen_password.scroll(false)
    /**************************************************创建按钮矩阵*****************************************************/
    let password_btnm = dxui.Buttons.build('password_btnm', screen_password)
    passwordView.password_btnm = password_btnm
    let font30 = dxui.Font.build('/app/code/resource/font/PangMenZhengDaoBiaoTiTi-1.ttf', 30, dxui.Utils.FONT_STYLE.NORMAL)
    password_btnm.textFont(font30)
    password_btnm.data([
        "1", "2", "3", "0", "\n",
        "4", "5", "6", "取消", "\n",
        "7", "8", "9", "确认", ""
    ]);
    password_btnm.setSize(480, 320)
    clearStyle(password_btnm)
    password_btnm.padAll(5, dxui.Utils.ENUM._LV_STYLE_STATE_CMP_SAME)
    password_btnm.obj.lvObjSetStylePadGap(2, dxui.Utils.ENUM._LV_STYLE_STATE_CMP_SAME)
    password_btnm.borderWidth(1, dxui.Utils.STYLE_PART.ITEMS)
    password_btnm.radius(9, dxui.Utils.STYLE_PART.ITEMS)
    password_btnm.bgColor(0x437fc9, dxui.Utils.STYLE_PART.ITEMS)
    password_btnm.textColor(0xFFFFFF, dxui.Utils.STYLE_PART.ITEMS)
    /**************************************************创建按键线条*****************************************************/
    let password_line = dxui.Line.build('password_line', screen_password)
    passwordView.password_line = password_line
    password_line.lineColor(0xff6600)
    password_line.lineWidth(8)
}

function clearStyle(obj) {
    obj.radius(0)
    obj.padAll(0)
    obj.borderWidth(0)
}
export default passwordView