//build:20240411
//通过这个组件来配置网络和监听网络状态变化
//依赖组件: dxMap,dxLogger,dxDriver,dxEventCenter
import dxMap from './dxMap.js'
import center from './dxEventCenter.js'
import { netClass } from './libvbar-m-dxnet.so'
import * as os from "os";
const netObj = new netClass();
const map = dxMap.get("default")

const net = {}
net.TYPE = {
    "UNKNOWN": 0,
    "ETHERNET": 1,
    "WIFI": 2,
    "4G": 4
}
net.DHCP = {
    STATIC: 1,
    DYNAMIC: 2,
    WIFI_AP: 3 //WiFi AP热点模式
}

/**
 * 网络初始化,wifi或以太网，如果连不上网络会自动不断的重试，无需重复init。但是init后需要轮询去获取网络状态（通过msgReceive)
 * 也可以直接使用简化方法dxNet.run，无需轮询
 * @param {object} options 初始化网络的参数
 *       @param {number} type 必填 网络类型，参考net.TYPE枚举
 *       @param {number} dhcp 必填 DHCP，参考net.DHCP枚举
 *       @param {string} macAddr 必填 mac地址,缺省使用dxCommon.getUuid2mac()方法来获取mac地址
 *       @param {string} ip 非必填 网络ip地址
 *       @param {string} gateway 非必填 网关地址
 *       @param {string} netmask 非必填 子网掩码
 *       @param {string} dns0 非必填 DNS地址
 *       @param {string} dns1 非必填 备选DNS地址
 * @returns 
 */
net.init = function (options) {
    let ret = netObj.init()
    if (!ret) {
        return false
    }
    if (!options) {
        throw new Error("dxNet.init: 'options' parameter should not be null or empty")
    }
    ret = netObj.setMasterCard(options.type)
    if (!ret) {
        return false
    }
    netObj.setMacaddr(options.type, options.macAddr)
    ret = netObj.cardEnable(options.type, true)
    if (!ret) {
        return false
    }
    if (options.dhcp === 1) {
        return netObj.setModeByCard(options.type, 1, {
            ip: options.ip,
            gateway: options.gateway,
            netmask: options.netmask,
            dns0: options.dns0,
            dns1: options.dns1,
        })
    } else if (options.dhcp === 2) {
        return netObj.setModeByCard(options.type, options.dhcp)
    }
    return false
}

/**
 * 获取Mac地址 
 * @param {number} type  必填 网络类型，参考net.TYPE枚举
 * @returns   Mac地址
 */
net.getMacaddr = function (type) {
    return netObj.getMacaddr(type)
}
/**
 * 设置Mac地址
 * @param {number} type  必填 网络类型，参考net.TYPE枚举
 * @param {string} addr  Mac地址,必填，格式类似 b2:a1:63:3f:99:b6
 * @returns   true：成功 主网卡类型，false 失败
 */
net.setMacaddr = function (type, addr) {
    if (type === null || type === undefined) {
        throw new Error("dxNet.setMacaddr:'type' paramter should not be null or empty")
    }
    if (addr === null || addr === undefined || addr.length < 1) {
        throw new Error("dxNet.setMacaddr:'addr' paramter should not be null or empty")
    }
    return netObj.setMacaddr(type, addr)
}
/**
 * 使能网卡，并添加到网络管理模块
 * @param {number} type  必填 网络类型，参考net.TYPE枚举
 * @param {boolean} on  开启/关闭
 * @returns   0：成功 <0 失败
 */
net.cardEnable = function (type, on) {
    if (type === null || type === undefined) {
        throw new Error("dxNet.cardEnable: 'type' parameter should not be null or empty")
    }
    if (on === null) {
        throw new Error("dxNet.cardEnable: 'on' parameter should not be null or empty")
    }
    return netObj.cardEnable(type, on)
}
/**
 * net网络销毁
 * @return true：成功，false 失败
 */
net.exit = function () {
    return netObj.exit()
}
/**
 * 设置指定网卡的模式及对应参数网络参数
 * @param {number} type   必填 网络类型，参考net.TYPE枚举
 * @param {number} mode   必填 DHCP，参考net.DHCP枚举
 * @param param  网络参数
 * @return true：成功，false 失败
 */
net.setModeByCard = function (type, mode, param) {
    if (type === null || type === undefined) {
        throw new Error("dxNet.setModeByCard: 'type' parameter should not be null or empty")
    }
    if (mode === null) {
        throw new Error("dxNet.setModeByCard:'mode' parameter should not be null or empty")
    }
    return netObj.setModeByCard(type, mode, param)
}
/**
 * 获取指定网卡的模式及对应参数网络参数
 * @param {number} type  必填 网络类型，参考net.TYPE枚举
 * @returns   如果是静态网络模式，就会返回ip、网关等信息
 */
net.getModeByCard = function (type) {
    if (type === null || type === undefined) {
        throw new Error("dxNet.getModeByCard: 'type' parameter should not be null or empty")
    }

    return netObj.getModeByCard(type)
}
/**
 * 设置主网卡，应用程序网络状态由次网卡决定
 * @param {number} type  必填 网络类型，参考net.TYPE枚举
 * @returns    true：成功，false 失败
 */
net.setMasterCard = function (type) {
    if (type === null || type === undefined) {
        throw new Error("dxNet.setMasterCard: 'type' parameter should not be null or empty")
    }
    return netObj.setMasterCard(type)
}
/**
 * 获取主网卡
 * @returns   >0：成功 主网卡类型，<0 失败
 */
net.getMasterCard = function () {
    return netObj.getMasterCard()
}
/**
 * 获取网络状态 类似{"status":4，"connected":true} ,其中status如下
 *  0,    未初始态
    1,    网卡处于关闭状态
    2,    网卡处于打开状态
    3,    网线已插入或者wifi已连接ssid 但未分配ip
    4,    已成功分配ip
    5     已连接指定服务或者通过测试可以连接到广域网
 * @returns   网络状态
 */
net.getStatus = function () {
    let status = netObj.getStatus()
    return { "status": status, "connected": status >= 4 }
}
/**
 * 设置网络状态
 * @param {number} status 网络状态，必填
 * @returns true：成功，false 失败
 */
net.setStatus = function (status) {
    if (status === null || status === undefined) {
        throw new Error("dxNet.setStatus: 'status' parameter should not be null or empty")
    }
    return netObj.setStatus(status)
}

/**
 * 获取wifi列表
 * @param {*} timeout 必填
 * @param {*} interval 必填
 * @returns wifi列表
 */
net.netGetWifiSsidList = function (timeout, interval) {
    if (timeout === null || timeout === undefined) {
        throw new Error("dxNet.netGetWifiSsidList: 'timeout' parameter should not be null or empty")
    }
    if (interval === null) {
        throw new Error("dxNet.netGetWifiSsidList: 'interval' parameter should not be null or empty")
    }
    return netObj.netGetWifiSsidList(timeout, interval)
}
/**
 * 连接到wifi
 * @param {*} ssid 必填
 * @param {*} psk 必填
 * @param {*} params 必填
 * @returns 
 */
net.netConnectWifiSsid = function (ssid, psk, params) {
    if (ssid === null) {
        throw new Error("dxNet.netConnectWifiSsid: 'ssid' parameter should not be null or empty")
    }
    if (psk === null) {
        throw new Error("dxNet.netConnectWifiSsid: 'psk' parameter should not be null or empty")
    }
    if (params === null) {
        throw new Error("dxNet.netConnectWifiSsid: 'params' parameter should not be null or empty")
    }
    return netObj.netConnectWifiSsid(ssid, psk, params)
}
/**
 * 获取已保存的热点列表
 * @returns  已保存的热点列表
 */
net.netGetWifiSavedList = function () {
    return netObj.netGetWifiSavedList()
}
/**
 * 断开当前连接的wifi热点
 * @returns  
 */
net.netDisconnetWifi = function () {
    return netObj.netDisconnetWifi()
}
/**
 * 获取当前热点的信息
 * @param timeout 必填
 * @returns  
 */
net.netGetCurrentWifiInfo = function (timeout) {
    if (timeout === null) {
        throw new Error("dxNet.netGetCurrentWifiInfo: 'timeout' parameter should not be null or empty")
    }
    return netObj.netGetCurrentWifiInfo(timeout)
}

/**
 * 检查消息队列是否为空
 * @returns true为空 false不为空
 */
net.msgIsEmpty = function () {
    return netObj.msgIsEmpty()
}
/**
 * 从消息队列中取网络当前状态数据，返回结构类似{"type":1,"status":4，"connected":true}
 * 其中type参考net.TYPE枚举
 * 其中status的值说明如下：
 *  0,    未初始态
    1,    网卡处于关闭状态
    2,    网卡处于打开状态
    3,    网线已插入或者wifi已连接ssid 但未分配ip
    4,    已成功分配ip
    5     已连接指定服务或者通过测试可以连接到广域网
 * @returns   字符串类型的消息数据
 */
net.msgReceive = function () {
    let res = JSON.parse(netObj.msgReceive());
    if (res.status >= 4) {
        res.connected = true
    } else {
        res.connected = false
    }
    return res
}

net.STATUS_CHANGE = '__netstatus__changed'

/**
 * 简化网络组件的使用，无需轮询去获取网络状态，网络的状态会通过eventcenter发送出去
 * run 只会执行一次，执行之后网络基本配置不能修改
 * 如果需要实时获取网络状态变化，可以订阅 eventCenter的事件，事件的topic是net.STATUS_CHANGE，事件的内容是类似{"type":1,"status":4，"connected":true}
 * 其中type参考net.TYPE枚举
 * 其中status的值说明如下：
 *  0,    未初始态
    1,    网卡处于关闭状态
    2,    网卡处于打开状态
    3,    网线已插入或者wifi已连接ssid 但未分配ip
    4,    已成功分配ip
    5     已连接指定服务或者通过测试可以连接到广域网
 * @param {object} options 参考init的options描述
 */
net.run = function (options) {
    if (options === undefined || options.length === 0) {
        throw new Error("dxnet.run:'options' parameter should not be null or empty")
    }
    let workerFile = '/app/code/dxmodules/netWorker.js'
    let init = map.get("__net__run_init")
    if (!init) {//确保只初始化一次
        map.put("__net__run_init", options)
        new os.Worker(workerFile)
    }
}

/**
 * 如果net单独一个线程，可以直接使用run函数，会自动启动一个线程，
 * 如果想加入到其他已有的线程，可以使用以下封装的函数
 */
net.worker = {
    //在while循环前
    beforeLoop: function (options) {
        net.init(options)
    },
    //在while循环里
    loop: function () {
        if (!net.msgIsEmpty()) {
            let res = net.msgReceive();
            if (res.status >= 4) {
                res.connected = true
            } else {
                res.connected = false
            }
            center.fire(net.STATUS_CHANGE, res)
        }
    }
}

export default net;
