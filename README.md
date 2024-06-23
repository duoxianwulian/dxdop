<p align="right">
    <b>English</b>| <a href="./README_CN.md">中文</a>
</p>

<h1 align="center">DUOXIAN Device Open Platform</h1>

📒 Overview and Summary
-------------

**Platform Overview**

dxdop is an embedded secondary development software platform that uses JavaScript as the primary development language to reduce development costs and difficulty. The vision is to make embedded development very simple, and it performs excellently in many terminal scenarios.

**Rich Features** 

- Hardware control for gpio, pwm, rs485, rs232, usb, wiegand, capturer, net, watchdog, alsa, etc.
- Network protocols including tcp, tcpserver, mqtt, udp, http, webserver
- Allows drawing LVGL screen UI using JS, supporting all native LVGL capabilities
- Rich peripheral access (card reader, fingerprint, Bluetooth, face recognition), encryption and decryption (base64, aes, md5, hmac, crc, bcc) and other supporting component libraries
- Supports development using embedded native C libraries

**Hardware Environment**

- The platform is currently only adapted for secondary development on <a href="https://koodle.cn/" target="_blank">Koodle IoT devices</a>.

**Tools and Services**

- Development and debugging using VScode and the <a href="https://marketplace.visualstudio.com/items?itemName=dxide.dxide" target="_blank">DXIDE</a> plugin
- Includes <a href="./examples/dw200/" target="_blank">component examples</a> and <a href="./src/README.md" target="_blank">component source code</a>, as well as <a href="./demos/README.md" target="_blank">open source project demos</a>

<br>

🚀 Technical Background
-------

The platform is supported by a framework based on Linux, quickjs, and LVGL, which improves development efficiency while maintaining extremely high operational efficiency.

**Linux**: Possesses capabilities for Linux system processes, threads, and resource scheduling

**quickjs**: A small, fast JS engine supporting ES2023 specifications with asynchronous capabilities

**LVGL**: The most popular free open-source embedded graphics library, allowing for the easy drawing of beautiful UIs using JS

<br>

▶️ Using dxdop
---------------

This list will guide you step by step to start using dxdop.

**Get Familiar with dxdop**

1. View <a href="" target="_blank">demo</a> to understand the output of dxdop
2. Read <a href="./src/README.md" target="_blank">documentation</a> to get familiar with component capabilities
3. Get familiar with <a href="" target="_blank">scaffolding</a> project construction and code framework

**Start Using dxdop**

4. Purchase a <a href="https://koodle.cn/" target="_blank">development board</a>
5. Install the <a href="https://marketplace.visualstudio.com/items?itemName=dxide.dxide" target="_blank">debugging environment</a>
6. Try some <a href="./examples/" target="_blank">component examples</a>
7. Complete <a href="" target="_blank">project development and debugging</a>

<br>

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
If you have any questions, <a href="https://koodle.cn/index.php/contact-us/" target="_blank">contact us</a> and let us know how we can help.
