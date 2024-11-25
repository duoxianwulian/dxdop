<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>

<h1 align="center">Deja OS</h1>

📒 Overview
-------------

**Introduction**

dejaOS is a JavaScript runtime environment designed for embedded devices, enabling low-cost, low-spec smart devices to run JavaScript code. It uses JavaScript as the development language, reducing costs and simplifying development. It make embedded application development easier. It has already shown excellent performance in various IoT scenarios.

**Rich Features** 

dejaOS provides a comprehensive set of [JavaScript Module](./src/README.md), including:

- `Hardware Interface Module`: GPIO, PWM, UART, RS-485, RS-232, USB, Wiegand, Watchdog, Capturer, ALSA, NFC, QRCode, BLE, Face Recognition, etc.
- `Networking and Communication Protocol Module`: Net, TCP, TCP Server, MQTT, UDP, HTTP, Web Server, OSDP, etc.
- `Graphics Module`: Supports drawing GUI screens using JavaScript, compatible with all LVGL native capabilities.
- `Utility Module`: Threads, encryption/decryption, logging, EventBus, NTP, SQLite, etc.
- `Third-Party Module`: Supports using pure JavaScript third-party module with import (ESM).
- `Native C Library Support`: Allows development through embedded native C libraries wrapped in JavaScript.

**Hardware Environment**

Currently, dejaOS is compatible with various smart devices primarily based on Ingenic and EeasyTech chips, with more being added continuously.

**Development Process**

The development process for dejaOS app is as follows:

- Prepare Development Environment: Install Node.js (20+), VSCode, and [DXIDE (VSCode plugin)](https://marketplace.visualstudio.com/items?itemName=dxide.dxide) on your computer.
- Prepare the Device: Purchase a development device and connect it to VSCode using a USB cable.
- Development and Debugging: Write JavaScript code in VSCode, sync it in real-time to see results, and check the runtime logs in VSCode.
- Build and Publish: Build a `DPK` installation package in VSCode, purchase production devices, and use the [DPK installation tool]() to install it on the production devices via serial connection.


🚀 Technical Background
-------

dejaOS is built on the foundations of Mip/ARMLinux, QuickJS, and LVGL, enhancing development efficiency while maintaining high runtime performance.

**Mip/ARMLinux**: Embedded Linux with system processes, threads, and resource scheduling capabilities.

**QuickJS**: A compact and fast JavaScript engine that supports the ES2020 standard.

**LVGL**: The most popular free open-source embedded graphics library, allowing easy creation of beautiful UIs using C, while dejaOS enables development with JavaScript.


▶️ Learning dejaOS
---------------

This list will guide you step by step to get started with dejaOS.

**Quick Start**
- [Introduction to dejaOS](docs/introduction.md)
- [How to Install dejaOS](docs/install.md)
- [Introduction to dejaOS-Compatible Devices](docs/devices.md)
- [Introduction to dejaOS's JavaScript Engine](docs/quickjs.md)
- [Introduction to dejaOS's GUI Engine](docs/lvgl.md)
- [Introduction to dejaOS Modules](docs/module.md)
- [Introduction to DXIDE](docs/dxide.md)
- [Introduction to dejaOS Project Structure](docs/project.md)
- [dxLogger and Debugging Introduction](docs/logger.md)
- [App Packaging、Installation、Upgrade](docs/app.md)
- [dejaOS System Mode Overview](docs/mode.md)

**Multithreading (Worker)**
- Concept of Workers
- Asynchronous Operations
- Introduction to EventBus
- Introduction to dxMap and dxQueue
- Introduction to Thread Pools

**GUI Introduction**
- Basic Concepts of GUI
- Communication between GUI and Other Threads
- Introduction to dxUI Components
- Several Basic UI Examples

**File Operations**
- File System on the Device
- Reading and Writing Text Files
- Reading and Writing Binary Files

**Hardware Interfaces**
- Introduction to GPIO
- Introduction to PWM
- Introduction to UART
- Introduction to QR Code
- Introduction to NFC
- Introduction to Bluetooth
- Introduction to Audio

**Network Interfaces and Protocols**
- Introduction to Network Types
- Introduction to TCP Module
- Introduction to UDP Module
- Introduction to HTTP Module
- Introduction to MQTT Module

**Database and Miscellaneous**
- Introduction to SQLite and Basic Usage
- Introduction to Watchdog
- Introduction to Time Synchronization

**Module Development Introduction**

🤖 Examples
-------

Only some examples are shown here. For more examples, check the <a href="./examples/" target="_blank">Examples</a> folder.

gpio

```JavaScript
const gpio_id_dw200 = 105

//init gpio
let res = gpio.init()
logger.info('init gpio', res)


//request gpio
res = gpio.request(gpio_id_dw200)
logger.info('request gpio', res)


std.setInterval(() => {
    //Output high level to open the relay
    res = gpio.setValue(gpio_id_dw200, 1)
    logger.info('Output high level', res);

    //Get whether the current level is high or low
    res = gpio.getValue(gpio_id_dw200)
    logger.info('The level is now', res);

    os.sleep(3000)

    //Output low level to close the relay
    res = gpio.setValue(gpio_id_dw200, 0)
    logger.info('Output low level', res);

    res = gpio.getValue(gpio_id_dw200)
    logger.info('The level is now', res);


}, 3000)

```

uart

```JavaScript
// id
const id = "uart"

// 485 uart path
const UART_485 = "/dev/ttyS3"

// open 485 uart
uart.open(uart.TYPE.UART, UART_485, id)

// Set uart port baud rate
uart.ioctl(1, '115200-8-N-1', id)

// Receive data
std.setInterval(() => {
    let byteArr = uart.receive(1, 100, id)
    if (byteArr && byteArr.length > 0) {
        console.log(JSON.stringify(byteArr));
        // Send serial port data and return it as is
        let buffer = new ArrayBuffer(byteArr.length);
        let uint8View = new Uint8Array(buffer);
        for (let i = 0; i < byteArr.length; i++) {
            uint8View[i] = byteArr[i];
        }
        uart.send(buffer, id)
    }
}, 10)
```

ui

```JavaScript
// ui context
let context = {}

// ui init
ui.init({ orientation: 1 }, context);

// Create screen
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// Create a label control
let label = ui.Label.build(mainView.id + 'label', mainView)
// Set text content
label.text("22 April 2020 15:36")
// Set text color
label.textColor(0x000000)
// Create font
let font24 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 24, ui.Utils.FONT_STYLE.NORMAL)
// Set text font
label.textFont(font24)

// load screen
ui.loadMain(mainView)

// Refresh ui
let timer = std.setInterval(() => {
    if (ui.handler() < 0) {
        std.clearInterval(timer)
    }
}, 1)

```

mqtt

```JavaScript
let mqttAddr = "tcp://192.168.1.1:1883" //Service IP port
let clientId = "client111" //client id
let username = "username" //mqtt account
let password = "password"//mqtt password
let prefix = "prefix"   //topic prefix
let qos = 1   //qos
let willTopic = "willTopic"   //will topic
let willMessage = JSON.stringify({xxxx:'123'})  //Will message
let id ='mqtt'  //handle id
let subs = ['aaa', 'bbb/ccc', 'ddddd']

//connect mqtt
mqtt.init(mqttAddr,clientId,username,password,prefix,qos,willTopic,willMessage,id)

 std.setInterval(() => {
    try {
        if (mqtt.isConnected(id) ) {
            log.info('connection succeeded');
            if (subs) {
                mqtt.subscribes(subs, qos, id)
            }
            while (true) {
                // Successful connection listening message
                if (!mqtt.isConnected(id) ) {
                    log.info('Disconnect');
                    break
                }
                if (!mqtt.msgIsEmpty()) {
                    let msg = mqtt.receive()
                   log.info('Data received：',JSON.stringify(msg))
                }
                os.sleep(10)
            }
        } else {
            // Reconnection
            mqtt.reconnect(willTopic, willMessage, id)
            os.sleep(1000)
        }
    } catch (error) {
        log.error(error, error.stack)
    }
 }, 20)

```

<br>

🤝 Services
If you have any questions,contact us  service@dxiot.com and let us know how we can help.
