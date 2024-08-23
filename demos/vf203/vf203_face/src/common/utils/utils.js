import * as os from "os"
import common from '../../../dxmodules/dxCommon.js'
import std from '../../../dxmodules/dxStd.js'
const utils = {}

// 生成指定长度的字母和数字组合的随机字符串
utils.genRandomStr = function (length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
    }
    return result;
}

// 判空
utils.isEmpty = function (value) {
    return value === undefined || value === null
}

// 获取url文件下载大小（字节数）
utils.getUrlFileSize = function (url) {
    let actualSize = common.systemWithRes(`wget --spider -S ${url} 2>&1 | grep 'Length' | awk '{print $2}'`, 100).match(/\d+/g)
    return actualSize ? parseInt(actualSize) : 0
}

/**
 * 解析字符串改为 json，注意value内不能有"号
 * @param {string} inputString 
 * @returns 
 */
utils.parseString = function (inputString) {
    // 获取{}及其之间的内容
    inputString = inputString.slice(inputString.indexOf("{"), inputString.lastIndexOf("}") + 1)
    // key=value正则，key是\w+（字母数字下划线，区别大小写），=两边可有空格，value是\w+或相邻两个"之间的内容（包含"）
    const keyValueRegex = /(\w+)\s*=\s*("[^"]*"|\w+)/g;
    let jsonObject = {};
    let match;
    while ((match = keyValueRegex.exec(inputString)) !== null) {
        let key = match[1];
        let value = match[2]

        if (/^\d+$/.test(value)) {
            // 数字
            value = parseInt(value)
        } else if (/^\d+\.\d+$/.test(value)) {
            // 小数
            value = parseFloat(value)
        } else if (value == 'true') {
            value = true
        } else if (value == 'false') {
            value = false
        } else {
            // 字符串
            value = value.replace(/"/g, '').trim()
        }
        jsonObject[key] = value;
    }
    return jsonObject;
}

/**
 * 等待下载结果，注意超时时间不得超过喂狗时间，否则下载慢会重启
 * @param {string} update_addr 下载地址
 * @param {string} downloadPath 存储路径
 * @param {number} timeout 超时
 * @param {string} update_md5 md5校验
 * @param {number} fileSize 文件大小
 * @returns 下载结果(bool)
 */
utils.waitDownload = function (update_addr, downloadPath, timeout, update_md5, fileSize) {
    // 删除原文件
    common.systemBrief(`rm -rf "${downloadPath}"`)
    // 异步下载
    common.systemBrief(`wget -c "${update_addr}" -O "${downloadPath}" &`)
    let startTime = new Date().getTime()
    while (true) {
        // 计算已下载的文件大小
        let size = parseInt(common.systemWithRes(`file="${downloadPath}"; [ -e "$file" ] && wc -c "$file" | awk '{print $1}' || echo "0"`, 100).split(/\s/g)[0])
        // 如果相等，则下载成功
        if (size == fileSize) {
            let ret = common.md5HashFile(downloadPath)
            if (ret) {
                let md5 = ret.map(v => v.toString(16).padStart(2, '0')).join('')
                if (md5 == update_md5) {
                    // md5校验成功返回true
                    return true
                }
            }
            common.systemBrief(`rm -rf "${downloadPath}"`)
            // md5校验失败返回false
            return false
        }
        // 如果下载超时，删除下载的文件并且重启，停止异步继续下载
        if (new Date().getTime() - startTime > timeout) {
            driver.pwm.fail()
            common.systemBrief(`rm -rf "${downloadPath}"`)
            common.asyncReboot(3)
            return false
        }
        std.sleep(100)
    }
}

// 记录定时器id，用于clear，只能在同一线程中clear
let allTimerIds = []
let allTimerIdsMap = {}

/**
 * interval定时器
 * @param {function} callback 回调函数，必填
 * @param {number} interval 间隔时间，必填
 * @param {boolean} once 创建后立即执行一次，非必填
 * @param {number} timerId 定时器id，非必填
 */
function setInterval(callback, interval, once, timerId) {
    if (timerId === null || timerId === undefined) {
        timerId = new Date().getTime() + "_" + this.genRandomStr(5)
        allTimerIds.push(timerId)
    }
    if (once === true) {
        // 创建后立即执行一次
        os.setTimeout(() => {
            if (allTimerIds.includes(timerId)) {
                callback()
            }
        }, 0);
    }
    allTimerIdsMap[timerId] = os.setTimeout(() => {
        if (allTimerIds.includes(timerId)) {
            callback()
            setInterval(callback, interval, false, timerId)
        }
    }, interval);
    return timerId
}

/**
 * 清除interval定时器
 * @param {number} timerId 定时器id，必填
 */
function clearInterval(timerId) {
    allTimerIds = allTimerIds.filter(v => v !== timerId);
    os.clearTimeout(allTimerIdsMap[timerId])
    delete allTimerIdsMap[timerId]
}
/**
 * 删除所有定时器，注意：只是删除当前线程创建的定时器，若有多个线程，每个线程都需要调用
 */
function clearIntervalAll() {
    allTimerIds = []
    for (const timerId in allTimerIdsMap) {
        os.clearTimeout(allTimerIdsMap[timerId])
        delete allTimerIdsMap[timerId]
    }
}
utils.setInterval = setInterval
utils.clearInterval = clearInterval
utils.clearIntervalAll = clearIntervalAll


const daysOfWeekEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const daysOfWeekCh = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const monthsOfYearEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const monthsOfYearCh = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
// 获取格式化时间
utils.getDateTime = function () {
    let t = new Date();
    let addZero = (v) => {
        // 双位补0
        return v.toString(10).padStart(2, '0')
    }
    return {
        year: t.getFullYear(),//年，如：2024
        month: addZero(t.getMonth() + 1), // 月份从0开始，所以要加1
        monthTextCh: monthsOfYearCh[t.getMonth()],
        monthTextEn: monthsOfYearEn[t.getMonth()],
        day: addZero(t.getDate()), // 获取日期
        hours: addZero(t.getHours()),// 获取小时
        minutes: addZero(t.getMinutes()),// 获取分钟
        seconds: addZero(t.getSeconds()),// 获取秒
        dayTextCh: daysOfWeekCh[t.getDay()],//星期(中文)
        dayTextEn: daysOfWeekEn[t.getDay()],//星期(英文)
    }
}

export default utils
