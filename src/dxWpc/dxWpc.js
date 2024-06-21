//build 20240409
//worker(线程) 之间无法正常的数据传输，通过所有worker共享的一个宿主map来实现之间线程间函数的互相调用
//wpc是Worker Procedure Call的缩写
//组件依赖: dxMap
import dxMap from './dxMap.js'
import * as os from "os"
const map = dxMap.get("___wpc")
const POST = "_reply"

const wpc = {}
//记录所有注册的函数
wpc.registerFunctions = {}
/**
 * 注册能被远程调用的函数
 * @param {string} name  函数的名称,比如'send','setValue'等
 * @param {function} fun 函数对象
 */
wpc.register = function (name, fun) {
    _valideString(name, 'name')
    if (typeof fun != 'function') {
        throw new Error("The 'fun' value should be a function")
    }
    this.registerFunctions[name] = fun
}

/**
 * 远程调用其它线程的函数 
 * @param {string} worker 要调用的其它worker的名称标识,worker内不能包含#号
 * @param {string} name 函数的名称，比如'send','setValue'等
 * @param {any} param 传递的参数，可以为空
 * @param {number} timeout 是否等待返回结果，单位是毫秒.如果等待，可以为空，为空表示不需要等待结果,如果设置太短，有可能抛出超时异常
 */
wpc.invoke = function (worker, name, param = "", timeout = 0) {
    _valideString(worker, 'worker')
    _valideString(name, 'name')
    if ((typeof timeout != 'number') || timeout < 0) {
        throw new Error("The 'timeout' value should be a non-negative number")
    }
    if (worker.includes('#')) {
        throw new Error("The 'worker' value should not include '#'")
    }
    let key = worker + '#' + name + "#" + _getSerialNumber()
    if (timeout === 0) {
        map.put(key, { param: param })
        return //立即返回，不需要等待结果
    }
    timeout = Math.max(100, timeout);//最小100毫秒，实际执行最快是5毫秒
    map.put(key, { param: param, timeout: timeout })
    let times = Math.ceil(timeout / 5);
    const key_reply = key + POST
    for (let index = 0; index < times; index++) {
        os.sleep(5);//每5毫秒尝试一次
        let result = map.get(key_reply);
        if (result) {
            map.del(key_reply);
            return result;
        }
    }
    throw new Error("Invoke timeout");
}
/**
 * 每个worker（线程）都需要有一个while死循环来调用这个函数来实现注册过的函数被调用
 * @param {string} worker  当前worker的名称标识,不同的worker的标识确保不一样,worker内不能包含#号
 */
wpc.loop = function (worker) {
    _valideString(worker, 'worker')
    if (worker.includes('#')) {
        throw new Error("The 'worker' value should not include '#'")
    }
    let keys = map.keys()
    let invokes = [] //有可能会出现一次loop里发现多次调用都还没开始执行
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (k.startsWith(worker) && !k.endsWith(POST)) {
            let value = map.get(k)
            map.del(k)
            if (!value) {
                continue
            }
            value.key_reply = k + POST
            let ks = k.split('#')
            value.name = ks[1]//第2个部分是函数名
            value.timestamp = parseInt(ks[2])//第3部分是时间戳
            _insert(invokes, value)//按顺序插入
        }
    }
    for (let i = 0; i < invokes.length; i++) {//绝大部分情况invokes长度是1
        let value = invokes[i]
        wpc.key_reply = value.key_reply//用于异步的回复
        let fun = this.registerFunctions[value.name]
        if (fun) {
            let result = fun(value.param)
            if (result && !_timeout(value)) {
                map.put(value.key_reply, result)
            }
        }
    }
}

/**
 * 异步的回复，有可能注册的函数是一个异步的函数，不能同步返回结果，可以通过这个函数来异步回复
 * 在注册的函数里获取wpc.key_reply，然后保存下来，作为回复的标识
 * @param {string} key_reply 每次函数被调用一次都有一个唯一id作为返回标识
 * @param {*} result 返回的结果数据
 */
wpc.reply = function (key_reply, result) {
    _valideString(key_reply, 'key_reply')
    map.put(key_reply, result)
}


//------------------------------private------------------------------------------------------

function _getSerialNumber() {
    let now = new Date().getTime()
    let random = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
    return now + "#" + random
}
function _valideString(str, field) {
    if ((typeof str != 'string') || str.length <= 0) {
        throw new Error(`The '${field}' value should be a non-empty string`)
    }
}
function _timeout(value) {
    let timeout = value.timeout
    if (!timeout) {//表示无需返回执行结果
        return true
    }
    let interval = new Date().getTime() - timeout - value.timestamp
    //有一种特殊情况，就是缺省时间是1970，突然矫正时间到当前时间，这个差就会很大，1608025702用于矫正
    if (interval > 0 && interval < 1608025702) {
        return true;
    }
    return false;
}
function _insert(array, newItem) {
    let timestamp = newItem.timestamp;
    let index = array.findIndex(item => item.timestamp > timestamp);
    if (index === -1) {
        // 如果找不到比新元素更大的时间戳，则插入到数组末尾
        index = array.length;
    }
    array.splice(index, 0, newItem);
}
export default wpc