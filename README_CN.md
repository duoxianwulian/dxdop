<p align="right">
    <a href="./README.md">English</a>| <b>中文</b>
</p>

 <h1 align="center">Deja OS</h1>


📒 概况与总览
-------------

**概述**

dejaOS 是一个针对嵌入式设备的 JavaScript 运行时环境，使低配置、低成本的智能设备能够运行 JavaScript 代码。它使用 JavaScript 作为开发语言，减少开发成本，降低开发难度，愿景是让嵌入式应用开发变得更加简单。dejaOS 已经在许多IoT场景中表现出色。

**功能丰富** 

dejaOS 提供了丰富的 [JavaScript 库](./src/README_CN.md)支持，包含：

- `硬件接口库`：GPIO、PWM、UART、RS-485、RS-232、USB、Wiegand、Watchdog、Capturer、ALSA、NFC、QRCode、BLE、人脸识别等
- `网络与通信协议库`：Net、TCP、TCP Server、MQTT、UDP、HTTP、Web Server、OSDP等
- `图形库`：支持用 JavaScript 绘制屏幕 GUI，并兼容所有 LVGL 原生能力
- `工具库`：线程、加解密、日志、EventBus、NTP、SQLite 等
- `第三方库`：支持 `import` 使用纯 JavaScript 的第三方库（ESM 方式）
- `原生 C 库支持`：支持通过植入原生 C 库，用 JS 包装的方式进行开发


**硬件环境**

- 目前 dejaOS 适配多款以Ingenic、EeasyTech为主芯片的智能设备，还在持续增加中


**开发流程**

开发 dejaOS 应用的流程如下：
- 开发环境准备：电脑上安装 Nodejs(20+),VSCode, [DXIDE(VSCode plugin)](https://marketplace.visualstudio.com/items?itemName=dxide.dxide)
- 设备准备：购买开发设备,USB 线连接 VSCode 和设备
- 开发和调试：在 VSCode 上编写 JavaScript 代码，实时同步到设备上查看效果，在 VSCode 上查看运行日志
- Build和发布：在 VSCode 上 build 成 DPK 安装包，购买生产设备，使用 [DPK 安装工具]()通过串口线安装到生产设备上


🚀 技术背景
-------

dejaOS 以Mip/ARMLinux、Quickjs、LVGL为基础框架支撑，提高开发效率的同时，保有超高的运行效率.

**Mip/ARMLinux**：嵌入式Linux，系统进程、线程、资源调度能力

**Quickjs**：支持 ES2020规范，且小巧快速的JS引擎

**LVGL**：LVGL 是最流行的免费开源嵌入式图形库，可以使用 C 轻松绘制漂亮的UI，dejaOS可以使用 JavaScript 


▶️ 学习 dejaOS
---------------

此列表将指导您逐步开始了解 dejaOS.

**快速上手** 
- [dejaOS 介绍](docs/introduction_CN.md)
- [如何安装 dejaOS](docs/install_CN.md)
- [dejaOS 配套设备介绍](docs/devices_CN.md)
- [dejaOS 的 JavaScript 引擎介绍](docs/quickjs_CN.md)
- [dejaOS 的 GUI 引擎介绍](docs/lvgl_CN.md)
- [dejaOS 的 module 介绍](docs/module_CN.md)
- [DXIDE 的介绍](docs/dxide_CN.md)
- [dejaOS 项目结构介绍](docs/project_CN.md)
- [dxLogger 及调试介绍](docs/logger_CN.md)
- [应用打包、安装和升级](docs/app_CN.md)
- [dejaOS 系统模式介绍](docs/mode_CN.md)

**多线程(worker)**
- worker的概念
- 异步操作
- eventbus介绍
- dxmap和dxqueue介绍
- 线程池介绍

**GUI 介绍**
- gui的基本概念
- gui和其它线程通信
- dxui组件的介绍
- ui的几个基本示例

**文件操作**
- 设备内的文件体系
- 文本文件的读写
- 二进制文件的读写

**硬件接口**
- gpio介绍
- pwm介绍
- uart介绍
- 二维码介绍
- NFC介绍
- 蓝牙介绍
- 音频介绍

**网络接口及协议**
- 网络类型介绍
- TCP模块介绍
- UDP模块介绍
- HTTP模块介绍
- MQTT模块介绍

**数据库及杂项**
- sqlite介绍及基本使用
- 看门狗介绍
- 时间同步介绍

**module开发介绍**


🤖 示例
-------

此处仅展示部分实例，如果要查看更多示例，可查看 <a href="./examples/" target="_blank">Examples </a> 文件夹.

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

如有任何问题，联系我们 service@dxiot.com ，告诉我们如何提供帮助.

