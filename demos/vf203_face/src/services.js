import server from './server.js'
import mqttService from './service/mqttService.js'
import faceService from './service/faceService.js'
import log from '../dxmodules/dxLogger.js'

const services = {}
Object.assign(services, mqttService);
Object.assign(services, faceService);

server.listener((data) => {
    try {
        if (services[data.topic]) {
            services[data.topic](data.data)
        } else {
            log.error("未实现该事件:" + data.topic)
        }
    } catch (error) {
        log.error(error, error.stack)
    }
    // service线程执行完事件要通知server释放该线程
    server.finish(data.topic)
})