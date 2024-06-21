/**
 * 实现对应用所有配置项（key/value)的管理：
 * 1. 用户需要把初始的配置项保存在项目的 src/config.json ，配置文件的格式请保留key/value格式（支持注释)，value只能是字符串和数字类型,例如：
 * {
 *      //mqtt相关配置
 *      "mqtt.ip":"192.168.2.3",
 *      "mqtt.port":6199,
 * }
 * 2. 也支持自定义配置文件，初始化可以传递自定义配置文件的路径和标识，后续读写数据都需要传递这个标识
 * 3. 用户在应用中第一次使用这个组件，需要先初始化 init，初始化会把 config.json 的数据保存到内存里，以后每次获取都是从内存获取
 * 4. 用户可以在任何地方都可以通过 get 和 set 来读写配置
 * 5. 如果修改配置项的 value 同时需要保存到配置文件（保证重启后新配置生效），使用 setAndSave
 * 6. 如果需要恢复所有默认配置，使用 reset
 */
import * as os from 'os';
import dxMap from './dxMap.js'
import common from './dxCommon.js'
import logger from './dxLogger.js'
import std from './dxStd.js'

const map = dxMap.get("default")

const config = {}
const DEFALUT_OPTIONS = { path: '/app/code/src/config.json', savePath: '/app/data/config/config.json', flag: '___config.' }

/**
 * 初始化会把 config.json 或自定义的配置文件的数据保存到内存里，以后每次获取都是从内存获取
 * @param {object} custom 非必填，自定义的配置文件
 *          @param {string} custom.path 自定义的配置文件完整路径
 *          @param {string} custom.flag 自定义配置文件的标识，注意如果有多个自定义配置文件，这个标识不要重复
 */
config.init = function (custom) {
    if (custom) {
        if (!custom.path || !custom.flag) {
            throw new Error('The path and flag for the custom configuration file cannot be empty.')
        }
    }
    let flag = custom ? DEFALUT_OPTIONS.flag + custom.flag + '.' : DEFALUT_OPTIONS.flag;
    const isInited = map.get('___inited' + flag)
    if (isInited) {//只初始化一次
        return
    }
    let path = custom ? custom.path : DEFALUT_OPTIONS.path
    let savePath = custom ? '/app/data/config/config' + custom.flag + '.json' : DEFALUT_OPTIONS.savePath
    if (!std.exist(path)) {
        throw new Error('The config file not existed:' + path)
    }
    let existed = std.exist(savePath)
    let content = existed ? std.parseExtJSON(std.loadFile(savePath)) : std.parseExtJSON(std.loadFile(path))
    if (!existed) {
        std.saveFile(savePath, JSON.stringify(content))
    }
    for (let [key, value] of Object.entries(content)) {
        map.put(flag + key, value)
    }
    map.put('___inited' + flag, 'ok')
}
/**
 * 获取所有配置项
 * @param {string} flag 自定义的配置文件标识，可以为空，为空则返回缺省config.json里所有内容
 * @returns json对象
 */
config.getAll = function (flag) {
    let _flag = _getFlag(flag)
    let configInfo = {}
    let keys = map.keys().filter(k => k.startsWith(_flag))
    keys.forEach(k => {
        let key = k.substring(_flag.length)
        let val = map.get(k)
        configInfo[key] = val
    })
    return configInfo
}
/**
 * 获取配置，只从map获取
 * 如果配置项为空，返回所有所有数据；
 * @param {string} key 配置项 
 * @param {string} flag 自定义的配置文件标识，可以为空，为空则返回缺省config.json里的配置值
 * @returns 
 */
config.get = function (key, flag) {
    if (!key) {
        return this.getAll(flag);
    }
    let _flag = _getFlag(flag)
    return map.get(_flag + key)
}

/**
 * 更新配置，只修改map
 * @param {string} key 配置项 
 * @param {string} value 配置值
 * @param {string} flag 自定义的配置文件标识，可以为空，为空则指向缺省config.json里的配置值
 */
config.set = function (key, value, flag) {
    if (!key || value == null || value == undefined) {
        throw new Error("key or value should not be empty")
    }
    let _flag = _getFlag(flag)
    map.put(_flag + key, value)
}

/**
 * 将map中的数据持久化到本地
 * @param {string} flag 自定义的配置文件标识，可以为空，为空则指向缺省config.json里的配置值
 */
config.save = function (flag) {
    //保存
    std.saveFile(_getSavePath(flag), JSON.stringify(this.getAll(flag)))
}

/**
 * 更新配置，修改map且持久化本地
 * @param {string} key 配置项 
 * @param {string} value 配置值
 * @param {string} flag 自定义的配置文件标识，可以为空，为空则指向缺省config.json里的配置值
 */
config.setAndSave = function (key, value, flag) {
    this.set(key, value, flag)
    //保存
    std.saveFile(_getSavePath(flag), JSON.stringify(this.getAll(flag)))
}

/**
 * 重置，重置后请重启动设备
 * @param {string} flag 自定义的配置文件标识，可以为空，为空则指向缺省config.json里的配置值
 */
config.reset = function (flag) {
    common.systemBrief('rm -rf ' + _getSavePath(flag))
}

//-------------------private-------------------------------

function _getFlag(flag) {
    return flag ? DEFALUT_OPTIONS.flag + flag + '.' : DEFALUT_OPTIONS.flag
}
function _getSavePath(flag) {
    return flag ? '/app/data/config/config' + flag + '.json' : DEFALUT_OPTIONS.savePath
}
export default config;