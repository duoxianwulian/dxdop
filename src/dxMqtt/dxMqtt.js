//build:20240411
//利用mqtt协议实现和mqtt服务端的通信或通过mqtt broker实现和其它mqtt客户端的通信
//依赖组件 dxMap,dxLogger,dxDriver,dxCommon,dxEventCenter,dxNet
import { mqttClass } from './libvbar-m-dxmqtt.so'
import * as os from "os"
import std from './dxStd.js'
import dxMap from './dxMap.js'
import dxCommon from './dxCommon.js'
const map = dxMap.get("default")
const mqttObj = new mqttClass();
const mqtt = {}
/**
 * 初始化mqtt相关属性并创建连接,请在worker里使用dxMqtt组件或使用简化函数dxMqtt.run
 * @param {string} mqttAddr mqtt服务地址，必填，以tcp://开头，格式是tcp://ip:port
 * @param {string} clientId 客户端id，必填，不同的设备请使用不同的客户端id
 * @param {string} username 非必填，mqtt用户名
 * @param {string} password 非必填，mqtt密码
 * @param {string} prefix 非必填，缺省为空字符串，这个表示自动在主题前加上一个前缀
 * @param {number} qos 0,1,2 非必填，缺省是1. 其中0表示消息最多发送一次，发送后消息就被丢弃;1表示消息至少发送一次，可以保证消息被接收方收到，但是会存在接收方收到重复消息的情况;2表示消息发送成功且只发送一次,资源开销大
 * @param {string} willTopic 非必填，遗嘱主题，通过broker通信的时候设备断开会自动触发一个mqtt遗嘱消息，这个是遗嘱消息的主题
 * @param {string} willMessage 非必填，遗嘱内容，通过broker通信的时候设备断开会自动触发一个mqtt遗嘱消息，这个是遗嘱消息的内容
 * @param {string} id 句柄id，非必填（若初始化多个实例需要传入唯一id）
 */
mqtt.init = function (mqttAddr, clientId, username, password, prefix = "", qos = 1, willTopic, willMessage, id) {

    if (mqttAddr === undefined || mqttAddr.length === 0) {
        throw new Error("dxMqtt.init: 'mqttAddr' parameter should not be null or empty")
    }
    if (clientId === undefined || clientId.length === 0) {
        throw new Error("dxMqtt.init: 'clientId' parameter should not be null or empty")
    }
    let pointer = mqttObj.init(mqttAddr, clientId, username, password, prefix, qos, willTopic, willMessage);
    if (pointer === undefined || pointer === null) {
        throw new Error("dxMqtt.init: mqtt init failed")
    }

    dxCommon.handleId("mqtt", id, pointer)
}

/**
 * 重新连接,比如连接成功后突然网络断开，无需重新init，直接重连即可
 * @param {string} willTopic 非必填，遗嘱主题，通过broker通信的时候设备断开会自动触发一个mqtt遗嘱消息，这个是遗嘱消息的主题
 * @param {string} willMessage 非必填，遗嘱内容，通过broker通信的时候设备断开会自动触发一个mqtt遗嘱消息，这个是遗嘱消息的内容
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 */
mqtt.reconnect = function (willTopic, willMessage, id) {
    let pointer = dxCommon.handleId("mqtt", id)
    return mqttObj.recreate(pointer, willTopic, willMessage);
}

/**
 * 订阅多主题
 * @param {array} topics 必填， 要订阅的主题数组，可以同时订阅多个 
 * @param {number} qos 非必填，缺省是1. 其中0表示消息最多发送一次，发送后消息就被丢弃;1表示消息至少发送一次，可以保证消息被接收方收到，但是会存在接收方收到重复消息的情况;2表示消息发送成功且只发送一次,资源开销大
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns 
 */
mqtt.subscribes = function (topics, qos, id) {
    if (topics === undefined || topics.length === 0) {
        throw new Error("dxMqtt.subscribes: 'topics' parameter should not be null or empty")
    }

    if (qos === undefined) {
        qos = 1
    }
    let pointer = dxCommon.handleId("mqtt", id)
    return mqttObj.subscribes(pointer, topics, qos);
}

/**
 * 判断mqtt是否连接，连接成功后如果网络断开，连接也会断开
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns false失败； true成功
 */
mqtt.isConnected = function (id) {
    let pointer = dxCommon.handleId("mqtt", id)
    return mqttObj.isConnected(pointer);
}

/**
 * 查询mqtt配置
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns mqtt配置
 */
mqtt.getConfig = function (id) {
    let pointer = dxCommon.handleId("mqtt", id)
    return mqttObj.getConfig(pointer);
}

/**
 * 发送mqtt请求
 * @param {string} topic 主题，必填
 * @param {string} payload 消息体内容，必填
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 */
mqtt.send = function (topic, payload, id) {
    if (topic === undefined || topic.length === 0) {
        throw new Error("dxMqtt.send:'topic' parameter should not be null or empty")
    }
    if (payload === undefined || payload.length === 0) {
        throw new Error("dxMqtt.send:'payload' parameter should not be null or empty")
    }
    let pointer = dxCommon.handleId("mqtt", id)
    return mqttObj.sendMsg(pointer, topic, payload);
}

/**
 * 接收mqtt数据,需要轮询去获取
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @return mqtt请求数据，结构是: {topic:'主题',payload:'内容'}
 */
mqtt.receive = function (id) {
    let msg = mqttObj.msgReceive(id);
    return JSON.parse(msg);
}

/**
 * 判断是否有新的数据，一般先判断有数据后再调用receive去获取数据
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns false 有数据；true 没有数据
 */
mqtt.msgIsEmpty = function (id) {
    return mqttObj.msgIsEmpty(id);
}

/**
 * 销毁mqtt实例
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 */
mqtt.destroy = function (id) {
    let pointer = dxCommon.handleId("mqtt", id)
    mqttObj.deinit(pointer);
}

mqtt.RECEIVE_MSG = '__mqtt__MsgReceive'
mqtt.CONNECTED_CHANGED = '__mqtt__Connect_changed'
mqtt.CONNECTED_CURRENT = '__mqtt__Connect_current'

/**
 * 用简单的方式实现mqtt客户端，只需要调用这一个函数就可以实现mqtt客户端，
 * 收到消息会触发给 dxEventCenter发送一个事件，事件的主题是mqtt.RECEIVE_MQTT_MSG，内容是{topic:'',payload:''}格式
 * 如果需要发送消息，直接使用 mqtt.send方法 mqtt发送的数据格式类似： { topic: "sendtopic1", payload: JSON.stringify({ a: i, b: "ssss" }) }
 * mqtt的连接状态发生变化会触发给 dxEventCenter发送一个事件，事件的主题是mqtt.CONNECTED_CHANGED，内容是'connected'或者'disconnect'
 * mqtt需要有网络，所以必须在使用之前确保dxNet组件完成初始化
 * @param {object} options mqtt相关参数,必填
 *      @param {string} options.mqttAddr mqtt服务地址，必填，以tcp://开头，格式是tcp://ip:port
 *      @param {string} options.clientId 客户端id，必填，不同的设备请使用不同的客户端id
 *      @param {string} options.username 非必填，mqtt用户名
 *      @param {string} options.password 非必填，mqtt密码
 *      @param {string} options.prefix 非必填，缺省为空字符串，这个表示自动在主题前加上一个前缀
 *      @param {number} options.qos 0,1,2 非必填，缺省是1. 其中0表示消息最多发送一次，发送后消息就被丢弃;1表示消息至少发送一次，可以保证消息被接收方收到，但是会存在接收方收到重复消息的情况;2表示消息发送成功且只发送一次,资源开销大
 *      @param {string} options.willTopic 非必填，遗嘱主题，通过broker通信的时候设备断开会自动触发一个mqtt遗嘱消息，这个是遗嘱消息的主题
 *      @param {string} options.willMessage 非必填，遗嘱内容，通过broker通信的时候设备断开会自动触发一个mqtt遗嘱消息，这个是遗嘱消息的内容
 *      @param {array}  options.subs 非必填，要订阅的主题组
 *      @param {string} options.id  句柄id，非必填（若初始化多个实例需要传入唯一id）
 */
mqtt.run = function (options) {
    if (options === undefined || options.length === 0) {
        throw new Error("dxmqtt.run:'options' parameter should not be null or empty")
    }
    if (options.id === undefined || options.id === null || typeof options.id !== 'string') {
        // 句柄id
        options.id = ""
    }
    let oldfilepre = '/app/code/dxmodules/mqttWorker'
    let content = std.loadFile(oldfilepre + '.js').replace("{{id}}", options.id)
    let newfile = oldfilepre + options.id + '.js'
    std.saveFile(newfile, content)
    let init = map.get("__mqtt__run_init" + options.id)
    if (!init) {//确保只初始化一次
        map.put("__mqtt__run_init" + options.id, options)
        new os.Worker(newfile)
    }
}
/**
 * 获取当前mqtt连接的状态
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns 'connected' 或者 'disconnected'
 */
mqtt.getConnected = function (id) {
    if (id === undefined || id === null || typeof id !== 'string') {
        // 句柄id
        id = ""
    }
    return map.get(this.CONNECTED_CURRENT + id)
}

export default mqtt;
