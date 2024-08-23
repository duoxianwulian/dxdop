// import common from "../../dxmodules/dxCommon.js"
// import config from "../../dxmodules/dxConfig.js"
// import log from "../../dxmodules/dxLogger.js"
// import wpc from "../../dxmodules/dxWpc.js"
// import sqlite from '../modules/driver/sqlite.js'

// const HttpService = {}
// let DB_PATH = '/app/data/db/app.db'
// let sqlUtils = sqlite.init(DB_PATH)
// /**
// * http返回通用方法
// */
// function httpReply(data, msg, code) {
//     return {
//         "code": code ? 'LAN_SUS-0' : 'LAN_EXP-1000',
//         "data": data,
//         "msg": !msg ? 'success' : msg,
//         "result": code == true ? 1 : 0,
//         "success": code
//     }
// }
// // 登录
// HttpService.login = function (event) {
//     log.info("{http} [login] req:" + JSON.stringify(event))
//     let res
//     if (event.userPassword != config.get('apiPwd', 'sysInfo')) {
//         wpc.invoke('http', 'httpSend', httpReply(null, 'Login password   error', false))
//         return
//     }
//     if (event.newPassword) {
//         //修改密码
//         config.setAndSave('apiPwd', event.newPassword, 'sysInfo')
//         res = httpReply({password:event.newPassword}, 'Password changed successfully', true)
//     } else {
//         if (!event.userName) {
//             wpc.invoke('http', 'httpSend', httpReply(null, 'userName cannot be empty', false))
//             return
//         }
//         if (!event.userName) {
//             wpc.invoke('http', 'httpSend', httpReply(null, 'Login userName  error', false))
//             return
//         }
//         res = httpReply({password:event.userPassword}, 'Login successful', true)
//     }
//     wpc.invoke('http', 'httpSend', res)

// }
// /**
//  * 远程控制 
//  * @param {*} data 
//  * command  0 开门  1 播放音频  2 设备重启  3 设备重置 4 摄像头标定 5 升级
//  * extra  command为 1时候是音频数据、4是标定超时时间秒、5是一个对象字符串{url:"http://xxxx","md5":"xxxx"}
//  *  
//  */
// HttpService.control = function (event) {
//     log.info("{http} [control] req:" + JSON.stringify(event))
//     switch (event.command) {
//         case 0:
//             //TODO 未提供
//             break;
//         case 1:

//             break;
//         case 2:
//             common.asyncReboot(2)
//             break;
//         case 3:
//             common.systemBrief("rm -rf " + CONFIG_PATH + '*')
//             common.systemBrief("rm -rf " + DB_PATH)
//             common.asyncReboot(2)
//             break;
//         case 4:

//             break;
//         case 5:
//             upgradeFirmware(event)
//             return
//         default:
//             wpc.invoke('http', 'httpSend', httpReply(null, 'Illegal instruction', false))
//     }
//     wpc.invoke('http', 'httpSend', httpReply(null, '', true))

// }

// //查询配置
// HttpService.getConfig = function (event) {
//     log.info("{http} [getConfig] req:" + JSON.stringify(event))
//     let obj = {
//         sysInfo: config.getAll('sysInfo')
//     }
//     obj.sysInfo = {
//         // 保留原有的 sysInfo 中的其他值
//         ...obj.sysInfo,
//         time: Math.floor(Date.parse(new Date()) / 1000),
//         disk: common.getTotaldisk(),
//         memory: common.getFreemem(),
//         cpu: common.getFreecpu()
//     }
//     wpc.invoke('http', 'httpSend', httpReply(obj.sysInfo, '', true))
// }

// //修改配置
// HttpService.setConfig = function (event) {
//     log.info("{http} [setConfig] req:" + JSON.stringify(event))
//     let data = event.config
//     for (let key in data) {
//         config.setAndSave(key, data.key, 'sysInfo')
//     }
//     wpc.invoke('http', 'httpSend', httpReply(null, '', true))
// }
// /**
//  * 添加权限
//  */
// HttpService.insertPermission = function (event) {
//     log.info("{http} [insertPermission] req:" + JSON.stringify(event))
//     insertPermission(event)

// }
// /**
//  * 查询权限
//  */
// HttpService.getPermission = function (event) {
//     log.info("{http} [getPermission] req:" + JSON.stringify(event))
//     getPermission(event)
// }

// /**
//  * 删除权限
//  */
// HttpService.delPermission = function (event) {
//     log.info("{http} [delPermission] req:" + JSON.stringify(event))
//     delPermission(event)
// }
// /**
//  * 清空权限
//  */
// HttpService.clearPermission = function (event) {
//     log.info("{http} [clearPermission] req:" + JSON.stringify(event))
//     clearPermission(event)
// }
// /**
//  * 添加人员
//  */
// HttpService.insertUser = function (event) {
//     log.info("{http} [insertUser] req:" + JSON.stringify(event))
//     insertUser(event)

// }
// /**
//  * 查询人员
//  */
// HttpService.getUser = function (event) {
//     log.info("{http} [getUser] req:" + JSON.stringify(event))
//     getUser(event)
// }

// /**
//  * 删除人员
//  */
// HttpService.delUser = function (event) {
//     log.info("{http} [delUser] req:" + JSON.stringify(event))
//     delUser(event)
// }
// /**
//  * 清空人员
//  */
// HttpService.clearUser = function (event) {
//     log.info("{http} [clearUser] req:" + JSON.stringify(event))
//     clearUser(event)
// }
// /**
//  * 添加凭证
//  */
// HttpService.insertKey = function (event) {
//     log.info("{http} [insertKey] req:" + JSON.stringify(event))
//     insertKey(event)

// }
// /**
//  * 查询凭证
//  */
// HttpService.getKey = function (event) {
//     log.info("{http} [getKey] req:" + JSON.stringify(event))
//     getKey(event)
// }

// /**
//  * 删除凭证
//  */
// HttpService.delKey = function (event) {
//     log.info("{http} [delKey] req:" + JSON.stringify(event))
//     delKey(event)
// }
// /**
//  * 清空凭证
//  */
// HttpService.clearKey = function (event) {
//     log.info("{http} [clearKey] req:" + JSON.stringify(event))
//     clearKey(event)
// }

// /**
//  * 查询通行记录
//  */
// HttpService.findRecords = function (event) {
//     log.info("{http} [findRecords] req:" + JSON.stringify(event))
//     findRecords(event)
// }

// /**
//  * 删除通行记录
//  */
// HttpService.deleteRecords = function (event) {
//     log.info("{http} [deleteRecords] req:" + JSON.stringify(event))
//     deleteRecords(event)
// }



// /**
//  * 添加权限 入库
//  */
// function insertPermission(event) {
//     let dataJson = event.data
//     let reply
//     for (let i = 0; i < dataJson.length; i++) {
//         const record = dataJson[i];
//         if (!record.id || !record.userId) {
//             wpc.invoke('http', 'httpSend', httpReply(null, "id,userId Cannot be empty", false))
//             return
//         }
//         if (!record.extra) {
//             record.extra = ""
//         }
//         if (!record.time) {
//             wpc.invoke('http', 'httpSend', httpReply(null, "Time and type cannot be empty", false))
//             return
//         }
//         if (record.time.type != 0 && record.time.type != 1 && record.time.type != 2 && record.time.type != 3) {
//             wpc.invoke('http', 'httpSend', httpReply(null, "Time type is not supported", false))
//             return
//         }
//     }

//     const permissions = dataJson.map(record => ({
//         id: record.id,
//         index: !record.index ? 0 : record.index,
//         extra: record.extra ? JSON.stringify(record.extra) : JSON.stringify({}),
//         timeType: record.time.type,
//         beginTime: record.time.type == 0 ? 0 : record.time.range.beginTime,
//         endTime: record.time.type == 0 ? 0 : record.time.range.endTime,
//         repeatBeginTime: record.time.type != 2 ? 0 : record.time.beginTime,
//         repeatEndTime: record.time.type != 2 ? 0 : record.time.endTime,
//         period: record.time.type != 3 ? 0 : JSON.stringify(record.time.weekPeriodTime),
//         userId: record.userId

//     }))
//     try {
//         sqlUtils.permisisonInsert(permissions)
//         reply = httpReply(dataJson.map(data => data.id), '', true)
//     } catch (error) {
//         reply = httpReply(null, error, true)
//     }
//     wpc.invoke('http', 'httpSend', reply)
// }

// /**
//  * 查询权限
//  * @param {*} event 
//  * @returns 
//  */
// function getPermission(event) {
//     let data = event.data
//     let res
//     let page = !data.page ? 0 : data.page
//     let size = !data.size ? 10 : data.size
//     try {
//         res = sqlUtils.permissionFindAll(page, size > 200 ? 10 : size, data.userId, data.id);
//         wpc.invoke('http', 'httpSend', httpReply(res, '', true));
//     } catch (error) {
//         wpc.invoke('http', 'httpSend', httpReply(null, error.message, false));
//     }
// }

// /**
//  * 批量删除权限
//  * @param {*} event 
//  * @returns 
//  */
// function delPermission(event) {
//     let data = event.data
//     let reply
//     try {
//         let res = 0
//         let res1 = 0
//         if (data.data.ids) {
//             res = sqlUtils.permisisonDeleteByIdIn(data.data.ids)
//         }
//         if (data.data.userIds) {
//             res1 = sqlUtils.permisisonDeleteByUserIdIn(data.data.userIds)
//         }
//         if (res == 0 && res1 == 0) {
//             reply = httpReply(data, '', true)
//         } else {
//             reply = httpReply(null, 'Deletion failure', false)
//         }
//     } catch (error) {
//         reply = httpReply(null, 'Deletion failure', false)
//     }
//     wpc.invoke('http', 'httpSend', reply);
// }

// /**
//  * 清空权限
//  * @param {*} event 
//  * @returns 
//  */
// function clearPermission(event) {
//     let res = sqlUtils.permissionClear()
//     let reply
//     if (res == 0) {
//         reply = httpReply(null, 'Clear successfully', true)
//     } else {
//         reply = httpReply(null, 'Clearing failure', false)
//     }
//     wpc.invoke('http', 'httpSend', reply);
// }

// //新增人员
// function insertUser(event) {
//     let reply
//     let dataJson = event.data
//     for (let i = 0; i < dataJson.length; i++) {
//         const record = dataJson[i];
//         if (!record.id || !record.name) {
//             wpc.invoke('http', 'httpSend', httpReply(null, "id,name Cannot be empty", false))
//             return
//         }
//     }

//     const persons = dataJson.map(record => ({
//         id: record.id,
//         name: record.name,
//         extra: record.extra ? JSON.stringify(record.extra) : JSON.stringify({})


//     }))
//     try {
//         sqlUtils.personInsert(persons)
//         reply = httpReply(persons.map(data => data.id), '', true)
//     } catch (error) {
//         reply = httpReply(null, error.stack, false)
//     }
//     wpc.invoke('http', 'httpSend', reply)
// }

// //查询人员
// function getUser(event) {
//     let data = event.data
//     let res
//     let page = !data.page ? 0 : data.page
//     let size = !data.size ? 10 : data.size
//     try {
//         res = sqlUtils.personFindAll(page, size > 200 ? 10 : size, data.phone, data.id);
//         wpc.invoke('http', 'httpSend', httpReply(res, '', true));
//     } catch (error) {
//         wpc.invoke('http', 'httpSend', httpReply(null, error.stack, false));
//     }
// }

// //删除人员
// function delUser(event) {
//     let reply
//     try {
//         let res = sqlUtils.personDeleteByIdIn(event.data)
//         if (res == 0) {

//             reply = httpReply(event.data, '', true)
//         } else {

//             reply = httpReply(null, 'Deletion failure', false)
//         }
//     } catch (error) {
//         reply = httpReply(null, 'Deletion failure', false)
//     }
//     wpc.invoke('http', 'httpSend', reply);
// }

// //清空人员
// function clearUser(event) {
//     let res = sqlUtils.personClear()
//     let reply
//     if (res == 0) {
//         reply = httpReply(null, '', true)
//     } else {
//         reply = httpReply(null, 'Clearing failure', false)
//     }
//     wpc.invoke('http', 'httpSend', reply);
// }
// //新增凭证
// function insertKey(event) {
//     let reply
//     let dataJson = event.data
//     for (let i = 0; i < dataJson.length; i++) {
//         const record = dataJson[i];
//         if (!record.id || !record.type || !record.code || !record.userId) {
//             wpc.invoke('http', 'httpSend', httpReply(null, "id,type,code,userId Cannot be empty", false))
//             return
//         }
//         // if (record.type != 300) {
//         //     let res = sqlUtils.voucherFindByUserIdOrCodeOrCodeOrId('', '', record.code)
//         //     if (res && res.length > 0) {
//         //         reply = mqttReply(payload, "The voucher value already exists :" + record.code, mqttConst.CODE.E_100)
//         //         wpc.invoke('__mqtt_Worker', 'send', { payload: JSON.stringify(reply), topic: getReplyTopic(event) });
//         //         return
//         //     }
//         // }
//     }
//     const vouchers = dataJson.map(record => ({
//         id: record.id,
//         type: record.type,
//         code: record.code,
//         userId: record.userId,
//         extra: record.extra ? JSON.stringify(record.extra) : JSON.stringify({})


//     }))

//     try {
//         sqlUtils.voucherInsert(vouchers)
//         reply = httpReply(vouchers.map(data => data.id), '', true);
//     } catch (error) {
//         reply = mqttReply(payload, error, mqttConst.CODE.E_100);
//         reply = httpReply('', error.stack, false);
//     }
//     wpc.invoke('http', 'httpSend', reply)


// }
// //查询凭证
// function getKey(event) {
//     let data = event.data
//     let res
//     let page = !data.page ? 0 : data.page
//     let size = !data.size ? 10 : data.size
//     try {
//         res = sqlUtils.voucherFindAll(page, size > 200 ? 10 : size, data.code, data.type, data.id, data.userId);
//         wpc.invoke('http', 'httpSend', httpReply(res, '', true));
//     } catch (error) {
//         wpc.invoke('http', 'httpSend', httpReply(null, error.stack, false));
//     }
// }

// //删除凭证
// function delKey(event) {
//     let reply
//     try {
//         let res = 0
//         let res1 = 0
//         if (event.data.ids) {
//             res = sqlUtils.voucherDeleteByIdIn(event.data.ids)
//         }
//         if (event.data.userIds) {
//             res1 = sqlUtils.voucherDeleteByUserIdIn(event.data.userIds)
//         }
//         if (res == 0 && res1 == 0) {
//             reply = httpReply('', '', true)
//         } else {
//             reply = httpReply('', 'Deletion failure', false)
//         }
//     } catch (error) {
//         reply = httpReply('', 'Deletion failure', false)
//     }

//     wpc.invoke('http', 'httpSend', reply);
// }

// //清空凭证
// function clearKey(event) {
//     let data = JSON.parse(event.payload)
//     let res = sqlUtils.voucherClear()
//     let reply
//     if (res == 0) {
//         reply = httpReply(null, 'Clear successfully', true)
//     } else {
//         reply = httpReply(null, 'Clearing failure', false)
//     }
//     wpc.invoke('http', 'httpSend', reply)
// }
// //查询通行记录
// function findRecords(event) {
//     let data = event.data
//     let res
//     let page = !data.page ? 0 : data.page
//     let size = !data.size ? 10 : data.size
//     try {

//         res = sqlUtils.passRecordFindAll(page, size > 200 ? 10 : size, true, data.userName, data.userId, data.type, data.result);
//         wpc.invoke('http', 'httpSend', httpReply(res, '', true));
//     } catch (error) {
//         wpc.invoke('http', 'httpSend', httpReply(null, error.stack, false));
//     }
// }
// function deleteRecords(event) {
//     let reply
//     try {
//         let res = sqlUtils.passRecordDeleteById(event.data)
//         if (res == 0) {
//             reply = httpReply(event.data, '', true)
//         } else {
//             reply = httpReply(null, 'Deletion failure', false)
//         }
//     } catch (error) {
//         reply = httpReply(null, 'Deletion failure', false)
//     }
//     wpc.invoke('http', 'httpSend', reply);
// }
// //升级
// function upgradeFirmware(event) {
//     // 先下载升级包,返回包大小（字节数）
//     let actualSize = common.systemWithRes(`wget --spider -S ${event.data.url} 2>&1 | grep 'Length' | awk '{print $2}'`, 100).match(/\d+/g)
//     actualSize = actualSize ? parseInt(actualSize) : 0
//     let res
//     // url和大小校验
//     let updatePack = event.data.url.match(/APP_[0-9]_\w*\.(zip|bin)/g)
//     if (actualSize < limit[0] || actualSize > limit[1] || !updatePack) {
//         wpc.invoke('http', 'httpSend', httpReply(null, "The url is wrong or the file is too large", false))
//         return
//     } else {
//         try {
//             let path = firmwarePath + updatePack
//             common.systemBrief(`rm -rf ${path} && wget -c ${event.data.url} -O ${path}`)
//             let md5 = common.md5HashFile(firmwarePath + updatePack)
//             md5 = md5.map(v => v.toString(16).padStart(2, 0)).join('')
//             if (event.data.md5 != md5) {
//                 res = httpReply(null, "MD5 verification fails", false)
//             } else {
//                 // 下载完成，重启
//                 common.asyncReboot(2)
//                 res = httpReply(null, "Upgrade successfully", true)
//                 config.set('accessDevVersion', updatePack, 'sysInfo')
//             }
//         } catch (error) {
//             res = httpReply(null, "Upgrade failure", false)
//         }

//     }
//     wpc.invoke('http', 'httpSend', res)


// }
// export default HttpService