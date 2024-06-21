//build:20240409
//打印日志，请不要使用console.log,使用这个组件替代
//依赖组件：dxCommon,dxMap
import dxCommon from './dxCommon.js'
const logger = {}
logger.config = {
    level: 0, // 缺省是debug
    append: 0, // 缺省是console
}
const CONFIG_FILE = '/app/code/src/log.conf'
function run() {
    try {
        if (dxCommon.systemWithRes(`test -e "${CONFIG_FILE}" && echo "OK" || echo "NO"`, 2).includes('OK')) {
            logger.config = JSON.parse(dxCommon.systemWithRes(`cat ${CONFIG_FILE}`, 1024))
        }
    } catch (ignore) {

    }
}
run()
//-----------------------------------public----------------------
/**
 *  修改一些基础配置 ,需要重启才能生效，如果都使用缺省无需执行该函数
 * @param {number} level 日志级别，总共4级，<0 不输出 0 表示debug，1表示info，2表示error，缺省为0，所有级别的日志都会输出，为1则debug级别的不会输出，为2则输出error
 * @param {number} append 输出方式 0 表示控制台输出 1 表示管道或队列（TODO)
 */
logger.init = function (level = 0, append = 0) {
    this.config.level = level
    this.config.append = append
    dxCommon.systemBrief(`echo '${JSON.stringify(this.config)}' > ${CONFIG_FILE}`)
}
logger.debug = function (...data) {
    if (this.config.level === 0) {
        log("DEBUG ", data)
    }
}
logger.info = function (...data) {
    if ([0, 1].includes(this.config.level)) {
        log("INFO ", data)
    }
}
logger.error = function (...data) {
    if ([0, 1, 2].includes(this.config.level)) {
        log("ERROR ", data)
    }
}
//-----------------------------------private----------------------
function log(level, messages) {
    let message = messages.map(msg => getContent(msg)).join(' ');
    let content = `[${level}${getTime()}]: ${message}`
    dxCommon.systemBrief(`echo '${content}'`)
}
function getContent(message) {
    if (message === undefined) {
        return 'undefined'
    } else if (message === null) {
        return 'null'
    }
    if ((typeof message) == 'object') {
        if (Object.prototype.toString.call(message) === '[object Error]') {
            return message.message + '\n' + message.stack
        }
        return JSON.stringify(message)
    }
    return message
}
function getTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);
    const milliseconds = ('0' + now.getMilliseconds()).slice(-3);
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
}
export default logger