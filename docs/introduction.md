<p align="right">
    <b>English</b>| <a href="./introduction_CN.md">中文</a>
</p>

# Introduction to dejaOS

DejaOS is a JavaScript runtime environment designed for embedded devices, based on QuickJS as the JavaScript engine, capable of running on resource-constrained devices. It uses LVGL as the graphics engine, suitable for devices with screens. By importing various JavaScript modules, dejaOS Apps enable efficient collaboration among the device's various modules. Additionally, dejaOS provides a Visual Studio Code plugin, making it convenient for developers to write, debug, and test JavaScript programs.

The design intent of dejaOS is to simplify the embedded development process, not only aiming to make it easier for embedded developers but also hoping to attract more application developers to this field. Currently, firmware development for embedded devices is often not user-friendly for application developers, mainly reflected in the following aspects: first, development languages and environments are usually C/C++, which many application developers are not familiar with; second, embedded device development typically requires considerable hardware knowledge and skills.

However, the number of application developers far exceeds that of embedded developers. If these developers can easily develop embedded devices just like developing business applications, the rapid development of the Internet of Things (IoT) will be just around the corner. dejaOS aims to fill this gap and promote the popularization and innovation of embedded development.

Let's look at a simple example. For instance, if our device supports QR code scanning, we place a QR code in front of the device, allowing it to recognize the content within the QR code and respond accordingly:

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

The example is quite simple overall:

1. `import` modules, here four moduels are used:
    - dxLogger.js: for logging
    - dxStd.js: base system module, used for polling in this example
    - dxEventBus.js: event module, used for subscribing to the event after successfully scanning the QR code in this example
    - dxCode.js: module for camera recognition and decoding of QR codes, which also supports barcodes

2. Initialize the device's camera for QR code recognition; different devices may have different initialization parameter values.
3. Subscribe to the event of successful QR code recognition and register a callback function.
4. Handle the content of the QR code in the callback function; this example simply prints the content of the QR code.
5. Polling to attempt to retrieve the results recognized by the camera.

To run this code on the device, simply connect the device to your computer via USB, then use the VSCode plugin to sync the code to the device and run it.