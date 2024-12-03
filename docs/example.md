<p align="right">
    <b>English</b>| <a href="./example_CN.md">中文</a>
</p>

# Examples

Only some examples are shown here. For more examples, check the <a href="../examples/" target="_blank">Examples</a> folder.

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
