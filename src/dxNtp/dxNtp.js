//build: 20240523
//同步时间,运行时需要把这个组件加载到一个线程里的while循环,
//缺省每隔24小时同步一次，也支持事件触发主动同步 eventcetner.fire(ntp.MANUAL_SYNC)
//依赖组件 dxLogger,dxCommon,dxCenter

import center from './dxEventCenter.js'
import common from "./dxCommon.js"
import dxNet from './dxNet.js'
import log from './dxLogger.js'
const ntp = {}
ntp.MANUAL_SYNC = '__ntp__sync'
/**
 * 同步时间循环初始化
 * @param {string} server 同步时间服务器地址，缺省是182.92.12.11 
 * @param {number} interval 同步时间的间隔，单位是分钟，缺省是24小时同步一次
 * @param {number} gmt 时区，比如8，表示GMT8北京时间，取值范围是0,1,2....24
 * 
 */
ntp.beforeLoop = function (server = '182.92.12.11', interval = 24 * 60, gmt) {
    this.server = server
    this.interval = interval
    this.tempinterval = 1000//第一次隔1秒就开始第一次对时
    this.last = new Date().getTime()
    ntp.updateGmt(gmt)
    center.on('__ntp__sync', function (data) {
        ntp.tempinterval = 1000 //收到后隔1秒开始对时
    }, '__ntpWorker__flag')
}
/**
 * 更新时区GMT，比如8，表示GMT8北京时间
 * @param {number} gmt  取值范围是0,1,2....24表示时区，
 */
ntp.updateGmt = function (gmt) {
    if (gmt != undefined && gmt != null) {
        let cmd = `cp /etc/localtimes/localtime${gmt} /etc/localtime`
        common.systemBrief(cmd)
    }
}
/**
 * 同步时间
 */
ntp.loop = function () {
    center.getEvent()
    if (!dxNet.getStatus().connected) {//没有网络
        return
    }
    const now = new Date().getTime()
    const minus = now - this.last
    if (minus > (this.tempinterval)) {
        let cmd = `ntpdate -u -t 1 '${this.server}' > /dev/null && echo 'Y' || echo 'N'`
        let res = common.systemWithRes(cmd, 100).split(/\s/)[0]
        if (res != "Y") {
            // 对时失败，1分后重试
            log.error('ntp sync failed')
            this.tempinterval = 60 * 1000
        } else {
            // 对时成功
            log.info('ntp sync success')
            this.tempinterval = this.interval * 60 * 1000
        }
        this.last = now
    }
}

export default ntp;