import log from '../dxmodules/dxLogger.js'
import config from '../dxmodules/dxConfig.js'

try {
    //初始化配置  指定flag 配置文件的标识  后续查询修改需要加 flag 
    config.init({path:'/app/code/src/config.json', flag: "flag" })

    //获取初始化后所有的配置项
    log.info(config.getAll('flag'))

    //获取配置项中的一个配置
    log.info(config.get('mqtt.ip','flag'))

    //修改配置项中的一个配置
    config.set("mqtt.ip",'192.168.1.1','flag')
    log.info('修改后的ip为',config.get('mqtt.ip','flag'));

    //修改并且保存到本地文件
    config.setAndSave("mqtt.ip",'192.168.1.1','flag')
    log.info('修改后的ip为',config.get('mqtt.ip','flag'));

   
    //重置配置文件 
    config.reset('flag')
} catch (error) {
    log.error(error.message)
    log.error(error.stack)
}