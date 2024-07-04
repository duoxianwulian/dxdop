# 样式属性
|  属性名   | api  | 参数  | 例  |
|  ------  | ----  | ----  | ----  |
| 坐标  | setPos | (Left, Top)<br>参数1为X轴坐标，参数2为Y轴坐标 | setPos(150, 130) |
| 尺寸  | setSize | (Width, Height)<br>参数1为元素宽度，参数2为元素高度 | setSize(140, 60) |
| 内间距  | padAll | (Number) | padAll(10) |
| 内间距上  | padTop | (Number) | padTop(10) |
| 内间距下  | padBottom | (Number) | padBottom(10) |
| 内间距左  | padLeft | (Number) | padLeft(10) |
| 内间距右  | padRight | (Number) | padRight(10) |
| 边框宽度  | borderWidth | (Number) | borderWidth(3) |
| 圆角  | radius | (Number) | radius(5) |
| 背景透明度  | bgOpa | (Number)<br>参数为0~100的整数，0为全透明 | bgOpa(100) |
| 背景颜色  | bgColor | (String 或 Number)<br>参数为字符串类型的HEX色值或者16进制数字 | bgColor(0x2196F3) |
| 元素透明度  | opa | (Number)<br>参数为0~100的整数，0为全透明 | opa(100) |
| 字体颜色  | textColor | (String 或 Number)<br>参数为字符串类型的HEX色值或者16进制数字 | textColor('#2196F3') |
| 文字对齐方式  | textAlign | (Number)<br>0: "AUTO"(根据语言环境自动切换左右对齐),<br>1: "LEFT"(左对齐),<br>2: "CENTER"(居中对齐),<br>3: "RIGHT"(右对齐) | textAlign(0) |
| 设置渐变色  | bgGradColor | (Number)<br>参数为16进制数字 | bgGradColor(0x2196F3) |
| 渐变色方向  | bgGradDir | (String)<br>VER: 垂直方向,<br>HOR: 水平方向,<br>NONE: 取消渐变显示 | bgGradDir(ui.Utils.GRAD.VER) |
| 渐变色开始位置  | bgMainStop | (Number)<br>参数为0~255之间的数字，0代表开始，128是中心点，255是元素末尾 | bgMainStop(0) |
| 渐变色结束位置  | bgGradStop | (Number)<br>参数为0~255之间的数字，0代表开始，128是中心点，255是元素末尾 | bgGradStop(255) |
