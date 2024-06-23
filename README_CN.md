<p align="right">
    <a href="./README.md">English</a>| <b>中文</b>
</p>

 <h1 align="center">多弦设备开放平台</h1>


📒 概况与总览
-------------

**平台概述**

dxdop是一个嵌入式二次开发软件平台，它使用JS语言作为主开发语音，减少开发成本，降低开发难度，愿景是让嵌入式开发变的很简单，它应用在许多终端场景有着出色的表现。



**功能丰富** 

- gpio、pwm、rs485、rs232、usb、wiegand、capturer、net、watchdog、alsa等硬件控制
- tcp、tcpserver、mqtt、udp、http、webserver网络协议
- 可以用JS绘制LVGL屏幕UI，支持所有LVGL原生能力
- 有着丰富的外设接入（刷卡、指纹、蓝牙、人脸识别）、加解密（base64、aes、md5、hmac、crc、bcc）等配套组件库
- 支持植入原生C库的方式开发


**硬件环境**

- 目前平台仅适配 <a href="https://koodle.cn/" target="_blank">酷豆物联设备</a> 做二次开发。


**工具和服务**

- 使用VScode && <a href="https://marketplace.visualstudio.com/items?itemName=dxide.dxide" target="_blank">DXIDE</a> 插件 开发调试

- 包含 <a href="./examples/dw200/" target="_blank">组件示例</a> 以及 <a href="./src/README_CN.md" target="_blank">组件源码</a>，<a href="./demos/README_CN.md" target="_blank">开源项目demo</a>

<br>

🚀 技术背景
-------

平台以Linux、quickjs、LVGL为基础框架支撑，提高开发效率的同时，保有超高的运行效率。

**Linux**：具备Linux系统进程、线程、资源调度能力

**quickjs**：支持 ES2023规范，且小巧快速的JS引擎，具备异步

**LVGL**：LVGL 是最流行的免费开源嵌入式图形库，可以使用JS轻松绘制漂亮的UI


<br>

▶️ 使用 dxdop
---------------

此列表将指导您逐步开始使用 dxdop。


**熟悉 dxdop** 

1. 查看 <a href="./docs/image/README.md" target="_blank">演示</a> ，了解 dxdop 产出效果
2. 阅读 <a href="./src/README_CN.md" target="_blank">文档</a> 熟悉组件能力使用
3. 熟悉 <a href="" target="_blank">脚手架 </a> 项目构建及代码框架


**开始使用 dxdop**

4. 选购 <a href="https://koodle.cn/" target="_blank">开发板</a>
5. 安装 <a href="https://marketplace.visualstudio.com/items?itemName=dxide.dxide" target="_blank">调试环境</a>
6. 尝试一些 <a href="./examples/" target="_blank">组件示例</a>
7. 完成 <a href="" target="_blank">项目开发调试</a>



<br>

🤖 示例
-------

此处仅展示部分实例，如果要查看更多示例，可查看 <a href="./examples/" target="_blank">Examples </a> 文件夹。

gpio

```JavaScript
const gpio_id_dw200 = 105

//初始化 gpio
let res = gpio.init()
logger.info('初始化 gpio', res)


//申请gpio
res = gpio.request(gpio_id_dw200)
logger.info('申请gpio', res)


std.setInterval(() => {
    //输出高电平 代表打开继电器
    res = gpio.setValue(gpio_id_dw200, 1)
    logger.info('输出高电平', res);

    //获取当前是高电平还是低电平
    res = gpio.getValue(gpio_id_dw200)
    logger.info('现在电平为', res);

    //等待3秒
    os.sleep(3000)

    //输出低电平 代表关闭继电器
    res = gpio.setValue(gpio_id_dw200, 0)
    logger.info('输出低电平', res);

    res = gpio.getValue(gpio_id_dw200)
    logger.info('现在电平为', res);


}, 3000)

```

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

🤝 服务
-------

如有任何问题，<a href="https://koodle.cn/index.php/contact-us/" target="_blank">联系我们 </a> ，告诉我们如何提供帮助。

