import net from '../dxmodules/dxNet.js'
import common from '../dxmodules/dxCommon.js'
import logger from '../dxmodules/dxLogger.js'
import std from '../dxmodules/dxStd.js'
let type = 1 //网络类型 必填
//动静态获取 ip 地址  net.DHCP.STATIC为静态   必填 
let dhcp = net.DHCP.DYNAMIC
let ip = "192.168.60.111" //静态必填
let gateway = "192.168.60.1"//静态必填
let subnetMask = "255.255.255.0"//静态必填
let dns = "218.4.4.4,218.2.2.2".split(",")//静态必填
let macAddr = common.getUuid2mac()//获取设备mac地址
let options = {
    type: type,
    dhcp: dhcp,
    ip: ip,
    gateway: gateway,
    netmask: subnetMask,
    dns0: dns[0],
    dns1: dns[1],
    macAddr: macAddr
}
//初始化网络
net.init(options)

//循环获取网络状态上报
std.setInterval(() => {
    if (!net.msgIsEmpty()) {
        let res = net.msgReceive();
        //res.status >= 4代表获取 ip 并且联网
        if (res.status >= 4) {
            res.connected = true
        } else {
            res.connected = false
        }
    }
}, 20)


//循环获取网络状态
 std.setInterval(()=>{
    logger.info('获取网络状态:',JSON.stringify(net.getStatus()));
 },2000)

