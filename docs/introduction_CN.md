<p align="right">
    <a href="./introduction.md">English</a>| <b>中文</b>
</p>

# dejaOS 介绍
dejaOS 是一个针对嵌入式设备的 JavaScript 运行时环境，基于 QuickJS 作为 JavaScript 引擎，能够在资源配置低的设备上运行. 同时，它使用 LVGL 作为图形引擎，适用于带屏幕的设备. 通过调用 JavaScript 标准库，dejaOS 使得设备的各个模块能够高效协同工作. 此外，dejaOS 提供了 Visual Studio Code 插件，方便开发者编写、调试和测试 JavaScript 程序.

dejaOS 的设计初衷是简化嵌入式开发过程，不仅希望让嵌入式开发人员能够更加轻松地进行开发，更希望吸引更多应用开发者参与这一领域. 当前，嵌入式设备的固件开发对于应用开发者来说往往不够友好，主要体现在以下几个方面：首先，主流的开发语言和环境通常是 C/C++，而许多应用开发者对这些语言并不熟悉；其次，嵌入式设备开发通常需要较多的硬件知识和技能.

然而，应用开发者的数量远远超过嵌入式开发人员. 如果能够让这些开发者像开发业务应用一样，轻松地开发嵌入式设备，那么物联网的快速发展将指日可待. dejaOS 旨在填补这一空白，推动嵌入式开发的普及与创新.

我们来看一个简单示例，比如我们的设备支持二维码扫描，我们把二维码放在设备前，让设备识别内容，根据内容来做相应的处理
``` js
import log from '../dxmodules/dxLogger.js'
import std from '../dxmodules/dxStd.js'
import bus from '../dxmodules/dxEventBus.js'
import code from '../dxmodules/dxCode.js'

//1. init qrcode module:dxCode
code.worker.beforeLoop({ id: 'capturer1', path: '/dev/video11' }, { id: 'decoder1', name: "decoder v4", width: 800, height: 600 })
//2. subscribe qrcode event:device scaned the qrcode and fire an event
bus.on(code.RECEIVE_MSG, function (data) {
    //3. handle the event
    log.info(data)
})

std.setInterval(() => {
    try {
        //4. try to retrieve the scan results every 50 milliseconds.
        code.worker.loop()
    } catch (error) {
        log.error(error)
    }
}, 50)
```
示例总体上非常简单：
1. `import` 标准库，这里用到了4个库:
    - dxLogger.js :用于打印日志
    - dxStd.js :系统库，在这个示例里用于轮询
    - dxEventBus.js: 事件库，在这个示例里用于订阅扫描二维码成功后的事件
    - dxCode.js: 二维码库，这个库同时也支持条形码
2. 初始化设备的摄像头用于识别二维码
3. 订阅识别二维码成功的事件，并注册一个回调函数
4. 在回调函数里处理二维码的内容，这个示例只是打印了二维码内容
5. 轮询去尝试获取摄像头的结果

如果期望在设备上运行这段代码，只需要在自己的电脑上通过 USB 线连上设备，然后在 VSCode 上通过插件把代码同步到设备，并运行