/**
 * @description 针对物模型属性相关的操作,初始化属性列表后，然后可以根据get和set方法来读写属性值，get和set是根据属性来动态生成。
 * get会优先从内存获取，如果没有则获取默认值，set会先修改内存，然后保存到data下的property.json
 * For things model property operations, after initializing the property list, 
 * use the dynamically generated 'get' and 'set' methods to read and write values. 
 * 'get' retrieves from memory or returns the default value if not found. set updates memory and saves to 'property.json' under '/app/data/config/'.
 * @author buter
 */

import dxMap from './dxMap.js'
import common from './dxCommon.js'
import logger from './dxLogger.js'
import std from './dxStd.js'

const property = {}
const map = dxMap.get('property')
const savePath = '/app/data/config/property.json'
property.all = map.get('all') || {}

/**
 * 初始化只需要一次，all是所有物模型的属性及属性的默认值，如下示例：
 * Initialization is required only once. 'all' contains all things model properties and their default values, as shown below:
 * {
 *  "ui.showver":1,
 *  "sys.version":"version1.0.0"
 * }
 * 然后可以通过调用getUiShowver()来获取属性的值，可以通过setUiShowver(data)来修改属性的值，
 * 如果setUiShowver(data,true)则只是修改内存里属性的值，并不会保存到文件里
 * Then, you can call getUiShowver() to get the property value, and call setUiShowver(data) to modify the property value.
 * If you call setUiShowver(data, true), it will only modify the value in memory and will not save it to the file.
 * @param {object} all 
 * @returns 
 */
property.init = function (all) {
    if (map.get('___inited')) { // 只初始化一次
        return
    }
    all['sys.uuid'] = common.getUuid()
    property.all = all
    map.put('all', all)
    if (!std.exist(savePath)) {
        std.saveFile(savePath, '{}')
    }
    let content = std.parseExtJSON(std.loadFile(savePath))
    for (let [key, value] of Object.entries(content)) {
        map.put(key, value)
    }
    map.put('___inited', 'ok')
    defineGetSet() // 确保初始化时定义动态方法
}

/**
 * 除了动态get函数，也可以根据id来获取属性值
 * In addition to the dynamic get function, you can also get property values based on the id.
 * @param {string} groupId 属性组id，必填 The property group id, required.
 * @param {string} id 属性id，不必填，如果不填则返回属性组下所有属性 The property id, optional. If not provided, all properties under the group will be returned.
 */
property.get = function (groupId, id) {
    if (!groupId) {
        throw new Error("property.get: 'groupId' should not be empty")
    }
    let res = {}
    if (!id) {
        let keys = Object.keys(property.all).filter(k => k.startsWith(groupId + '.'))//先取默认值
        keys.forEach(k => {
            res[k] = property.all[k];
        })
        keys = map.keys().filter(k => k.startsWith('property.' + groupId + '.'))//再用实际值覆盖
        keys.forEach(k => {
            res[k.slice(10)] = map.get(k)
        })
    } else {
        const key = groupId + '.' + id
        res[key] = getProperty(key)
    }
    return res
}

/**
 * 除了动态set函数，也支持传值来设置一个或多个属性值
 * In addition to the dynamic set function, you can also set one or more property values.
 * @param {object} properties {groupId.id:value} 格式，支持一次设置多个属性 The properties in the format {groupId.id: value}, supporting setting multiple properties at once.
 * @param {boolean} notsave 是否只保存到内存，不保存到文件 Whether to save only to memory and not to the file.
 */
property.set = function (properties, notsave) {
    if (!properties || typeof properties !== 'object') {
        throw new Error("property.set: 'properties' should not be empty and must be an object")
    }
    Object.keys(properties).forEach(key => {
        map.put('property.' + key, properties[key])
    })
    if (!notsave) {
        save()
    }
}

/**
 * 恢复出厂设置，把所有属性恢复为默认值
 * Restore factory settings, resetting all properties to their default values.
 */
property.reset = function () {
    common.systemBrief('rm -rf ' + savePath)
}

function defineGetSet() {
    // 遍历 all 对象，动态生成 get 和 set 方法
    Object.keys(property.all).forEach(key => {
        const camelCaseKey = toCamelCase(key)
        const getKey = 'get' + camelCaseKey.charAt(0).toUpperCase() + camelCaseKey.slice(1)
        const setKey = 'set' + camelCaseKey.charAt(0).toUpperCase() + camelCaseKey.slice(1)

        property[getKey] = function () {
            return getProperty(key)
        }

        property[setKey] = function (value, notsave) {
            map.put('property.' + key, value)
            if (!notsave) {
                save()
            }
        }
    })
}

function getProperty(key) {
    const temp = map.get('property.' + key)
    if (temp !== undefined && temp !== null) {
        return temp
    }
    return property.all[key]
}

function save() {
    let configInfo = {}
    let keys = map.keys().filter(k => k.startsWith('property.'))
    keys.forEach(k => {
        let val = map.get(k)
        configInfo[k] = val
    })
    std.saveFile(savePath, JSON.stringify(configInfo))
}

// 辅助函数，用于将点分隔的字符串转换为驼峰命名法
const toCamelCase = (str) => {
    return str.replace(/(\.\w)/g, (match) => match[1].toUpperCase())
}

// 确保在模块加载时定义动态方法
defineGetSet()

export default property
