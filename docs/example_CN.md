<p align="right">
    <a href="./example.md">English</a>| <b>中文</b>
</p>

# 示例

此处仅展示部分实例，如果要查看更多示例，可查看 <a href="../examples/" target="_blank">Examples </a> 文件夹.

uart

```JavaScript
// id
const id = "uart"

// 485串口地址
const UART_485 = "/dev/ttyS3"

// 打开485串口
uart.open(uart.TYPE.UART, UART_485, id)

// 设置串口波特率
uart.ioctl(1, '115200-8-N-1', id)

// 接收数据
std.setInterval(() => {
    let byteArr = uart.receive(1, 100, id)
    if (byteArr && byteArr.length > 0) {
        console.log(JSON.stringify(byteArr));
        // 发送串口数据，原样返回
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
// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 1 }, context);

// 创建屏幕
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// 创建文本控件
let label = ui.Label.build(mainView.id + 'label', mainView)
// 设置文本内容
label.text("22 April 2020 15:36")
// 设置文本颜色
label.textColor(0x000000)
// 创建字体
let font24 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 24, ui.Utils.FONT_STYLE.NORMAL)
// 设置文本字体
label.textFont(font24)

// 加载屏幕
ui.loadMain(mainView)

// 刷新ui
let timer = std.setInterval(() => {
    if (ui.handler() < 0) {
        std.clearInterval(timer)
    }
}, 1)

```

mqtt

```JavaScript
let mqttAddr = "tcp://192.168.1.1:1883" //服务 IP 端口
let clientId = "client111" //客户端 id
let username = "username" //mqtt账号
let password = "password"//mqtt密码
let prefix = "prefix"   //前缀
let qos = 1   //qos
let willTopic = "willTopic"   //遗嘱 topic
let willMessage = JSON.stringify({xxxx:'123'})  //遗嘱消息
let id ='mqtt'  //句柄 id
let subs = ['aaa', 'bbb/ccc', 'ddddd']

//链接 mqtt
mqtt.init(mqttAddr,clientId,username,password,prefix,qos,willTopic,willMessage,id)

 std.setInterval(() => {
    try {
        if (mqtt.isConnected(id) ) {
            log.info('连接成功');
            if (subs) {
                mqtt.subscribes(subs, qos, id)
            }
            while (true) {
                // 连接成功后进入消息监听
                if (!mqtt.isConnected(id) ) {
                    // 未连接跳出循环重新连接
                    log.info('断开连接');
                    break
                }
                if (!mqtt.msgIsEmpty()) {
                    let msg = mqtt.receive()
                   log.info('收到了数据：',JSON.stringify(msg))
                }
                os.sleep(10)
            }
        } else {
            // 重连
            mqtt.reconnect(willTopic, willMessage, id)
            os.sleep(1000)//重连后等待1秒
        }
    } catch (error) {
        log.error(error, error.stack)
    }
 }, 20)

```

<br>