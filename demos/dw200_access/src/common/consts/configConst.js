
const configConst = {}
configConst.setConfig = {
    // mqttip+端口
    mqttaddr: "mqttInfo.mqttAddr",
    // mqtt 账号
    mqttusername: "mqttInfo.mqttName",
    //mqtt 密码
    mqttpassword: "mqttInfo.password",
    //mqtt前缀
    mqttprefix: "mqttInfo.prefix",
    //qosmqtt
    mqttqos: "mqttInfo.qos",
    //ntp对时服务地址
    ntpAddr: "netInfo.ntpAddr",
    //DHCP 
    ip_mode: "netInfo.dhcp",
    //ip
    ip: "netInfo.ip",
    //网关
    gateway: "netInfo.gateway",
    //dns
    dns: "netInfo.dns",
    //子网掩码
    mask: "netInfo.subnetMask",
    //公司名称
    devname: "sysInfo.devname",
    //喇叭音量
    volume: "sysInfo.volume",
    //按键音量
    volume2: "sysInfo.volume2",
    //蜂鸣音量
    volume3: "sysInfo.volume3",
    //心跳开关
    heart_en: "sysInfo.heart_en",
    //心跳间隔
    heart_time: "sysInfo.heart_time",
    //心跳内容
    onlinecheck: "sysInfo.heart_data",
    
    //sn是否隐藏 1 显示 0 隐藏
    sn_show: "uiInfo.sn_show",
    //ip是否隐藏 1 显示 0 隐藏
    ip_show: "uiInfo.ip_show",
    //设备配置密码
    com_passwd: "sysInfo.com_passwd",
    //语言
    language: "uiInfo.language",
    //开门模式
    openMode:"doorInfo.openMode",
    //开门时长
    openTime:"doorInfo.openTime",
    //开门超时时间
    openTimeout:"doorInfo.openTimeout",
    //在线验证开关 1开 0 关
    onlinecheck: "doorInfo.onlinecheck",
    //在线验证超时时间
    onlineTimeout: "doorInfo.timeout",
}
//根据 key 获取 setCofig中的 value
configConst.getValueByKey = function (key) {
    return this.setConfig[key] || undefined;
}

export default configConst