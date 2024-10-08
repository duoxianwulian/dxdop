import log from '../dxmodules/dxLogger.js'
import std from '../dxmodules/dxStd.js'
import mqtt from '../dxmodules/dxMqtt.js'
import * as os from "os"


let mqttAddr = "tcp://101.200.139.97:51883" //服务 IP 端口
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


 
