import log from '../dxmodules/dxLogger.js'
import center from '../dxmodules/dxEventCenter.js'
import config from '../dxmodules/dxConfig.js'
import utils from './common/utils/utils.js'
import screen from './screen.js'
import driver from './driver.js'
import server from './server.js'
import mainService from './intercept.js'

(function () {
    // 事务中心初始化
    center.init()
    // 配置文件初始化
    config.init()
    // driver初始化
    driver.init()
    // 屏幕初始化
    screen.init()
    // 启动server服务
    server.run('/app/code/src/controller.js', '/app/code/src/services.js', mainService.intercept)
    // 版本信息
    const appVersion = 'vf203_access_v1.0.0'
    config.set('sysInfo.appVersion', appVersion)
    log.info("=================== version:" + appVersion + " ====================")
})();

const timer = utils.setInterval(() => {
    if (screen.loop() < 0) {
        // 监听ctrl+c退出程序
        utils.clearInterval(timer)
        // 停止server服务
        server.exit()
        // 屏幕资源释放
        screen.exit()
        // 删除所有定时器，释放线程
        utils.clearIntervalAll()
    }
}, 1)
