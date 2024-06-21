import { mapClass } from './libvbar-m-dxmap.so'
/**
 * build:20240407
 * map 组件，可以在内存里读写key/value
 */
const mapObj = new mapClass();

const map = {
    get: function (name) {
        if (!name || name.length == 0) {
            throw new Error("dxMap.get:name should not be null or empty")
        }
        //第一次put会自动创建实例
        return {
            /**
             * @brief   获取Map中的所有键,返回一个数组
             */
            keys: function () {
                let all = mapObj.keys(name)
                return all == null ? [] : all
            },
            /**
             * @brief   根据key获取value
             */
            get: function (key) {
                if (!key || key.length < 1) {
                    throw new Error("The 'key' parameter cannot be null or empty")
                }
                // put空字符串，get会是null
                let value = mapObj.get(name, key)
                if (value === undefined || value === null) {
                    value = ""
                }
                return _parseString(value)
            },
            /**
             * @brief   向Map中插入键值对
             */
            put: function (key, value) {
                if (!key || key.length < 1) {
                    throw new Error("The 'key' parameter cannot be null or empty")
                }
                if (value == null || value == undefined) {
                    throw new Error("The 'value' parameter cannot be null or empty")
                }
                return mapObj.insert(name, key, _stringifyValue(value))
            },
            /**
             * @brief   根据Key删除键值对
             */
            del: function (key) {
                if (!key || key.length < 1) {
                    throw new Error("The 'key' parameter cannot be null or empty")
                }
                return mapObj.delete(name, key)
            },
            /**
             * 不再使用了，就销毁
             */
            destroy: function () {
                return mapObj.destroy(name)
            },
        }
    }

}
function _stringifyValue(value) {
    const type = typeof value
    if (type === 'string') {
        return value
    }
    if (type === 'number') {
        return '#n#' + value
    }
    if (type === 'boolean') {
        return '#b#' + value
    }
    if (type === 'object') {
        // 如果是对象，进一步判断是否为数组
        if (Array.isArray(value)) {
            return '#a#' + JSON.stringify(value);
        }// else if (value === null) { 前面已经规避了null的情况
        return '#o#' + JSON.stringify(value)
    }
    if (type === 'function') {
        throw new Error("The 'value' parameter should not be function")
    }
}
function _parseString(str) {
    if (str.startsWith('#n#')) {
        // 解析数字
        const numberStr = str.substring(3);
        return numberStr.includes('.') ? parseFloat(numberStr) : parseInt(numberStr, 10);
    } else if (str.startsWith('#b#')) {
        // 解析布尔值
        return str.substring(3) === 'true';
    } else if (str.startsWith('#a#')) {
        // 解析数组
        return JSON.parse(str.substring(3));
    } else if (str.startsWith('#o#')) {
        // 解析对象
        return JSON.parse(str.substring(3));
    } else {
        // 默认情况下，将字符串返回
        return str;
    }
}
export default map;

