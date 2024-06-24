<p align="right">
    <a href="./README.md">English</a>| <b>中文</b>
</p>

 <h1 align="center">基于MQTT的在线门禁示例</h1>


## **DEMO概述**
设备型号是 DW200，是具备触屏屏幕的多功能一体机
在这个DEMO中，DW200北向通过MQTT协议和北向应用通信，南向通过GPIO控制门锁
这个DEMO通过3种方式来实现门禁通行，基本流程如下：
- 扫二维码通行： 设备扫码到二维码的字符串内容，通过MQTT发送到应用端，MQTT服务端根据内容来判断是否允许开门
- 输入手机号和密码通行：通过MQTT发送到MQTT服务端，应用端根据内容来判断是否允许开门
- 输入ID和密码通行：通过MQTT发送到MQTT服务端，应用端根据内容来判断是否允许开门

应用端判断可以开门的话，发送MQTT指令远程控制设备的GPIO打开大门,同时播放声音，屏幕显示对应图片等操作来提示用户

## **基本功能** 
- 读取QRCode或Barcode，读取到后自动通过MQTT上传
- 特殊标志开头的二维码作为配置码，通过配置可以修改设备的一些基本参数，比如MQTT Broker地址、网络基本信息、屏幕上是否显示特定元素等
- 可以通过MQTT协议来远程修改设备上的一些基本参数
- 可以通过MQTT协议来控制设备行为，比如远程播放音频，远程开门、远程显示指定图片
- 支持通过二维码或MQTT协议来升级设备里的JS代码和资源文件（音频、图片等），要升级的文件压缩成zip部署在可以访问的远程HTTP地址
- 在屏幕上支持触屏输入手机号、ID号、密码，确认后通过MQTT协议发送到应用端
- 支持看门狗功能，应用在指定秒内无响应会自动重启
- 屏幕上显示以太网和MQTT图标来标识网络是否已经连上，和MQTTBroker是否连上
- 屏幕上显示当前时间，设备每次重启会矫正时间，每24小时也会自动校准一次
- 屏幕上任何操作都触发蜂鸣短音提示，配置等操作错误会蜂鸣长音或双短音提示用户

## **目录说明**
- docs：一些设备屏幕的截图
- source：demo的所有源码和资源文件等
- test：用于配套测试的MQTT测试工具和配置二维码生成工具

## **代码说明**
1. 总共启动4个worker（thread）
- main线程：主线程并绘制刷新ui
- mqtt线程：接收mqtt数据
- code线程：capture二维码或一维码图像并decoder
- service线程：订阅mqtt、code消息并进行相应的处理，耗时的操作通过setTimeout异步处理

2. 主目录/文件说明：
- resource/wav：多个音频文件
- resource/image:多个图片，包括背景图片，各种图标等
- resource/font.ttf: OpenSans-Regular字库
- main.js: 程序入口，在这里初始化设备各个线程，初始化设备各种驱动，循环绘制ui
- driver.js: dw200各个驱动组件的初始化和功能的简单封装
- codehandler.js: 二维码处理，配置码触发配置的修改，其它二维码MQTT透传
- config.json: 设备配置初始化json文件
- constants.js: 一些常量设置
- mqtthandler.js: mqtt数据的处理，接收mqtt指令并进行处理
- service.js：订阅mqtt、code消息并调用mqtthandler和codehandler来处理


## **屏幕截图**
![Main Ui](docs/screen1.jpg "Main UI")
![Menu UI](docs/screen2.jpg "Menu UI")
![Phone UI](docs/screen3.jpg "Phone UI")
![MQTT Test Tool](docs/screen4.png "MQTT Test Tool")
![QRCode Test Tool](docs/screen5.png "QRCode Test Tool")
