import std from '../dxmodules/dxStd.js'
import ntp from '../dxmodules/dxNtp.js'
import net from '../dxmodules/dxNet.js'
import common from '../dxmodules/dxCommon.js'
import logger from '../dxmodules/dxLogger.js'

// 首先联网
let type = 1
// let dhcp = net.DHCP.STATIC
let dhcp = net.DHCP.DYNAMIC
let ip = "192.168.60.111"
let gateway = "192.168.60.1"
let subnetMask = "255.255.255.0"
let dns = "218.4.4.4,218.2.2.2".split(",")
let macAddr = common.getUuid2mac()
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
net.run(options)

// ntp事务初始化
ntp.beforeLoop(undefined, undefined, 8)

// 打印对时前时间
logger.info(new Date().getTime());

std.setInterval(() => {
    // ntp循环监听对时
    ntp.loop()
    // 打印对时后时间
    logger.info(new Date().getTime());
}, 1000)
