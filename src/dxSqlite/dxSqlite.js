//build: 20240525
//依赖组件:dxCommon
import { sqliteClass } from './libvbar-m-dxsqlite.so'
import dxCommon from './dxCommon.js'
const sqliteObj = new sqliteClass();
const sqlite = {}

/**
 * 初始化数据库
 * @param {string} path db文件全路径，必填
 * @param {string} id 句柄id，非必填（若初始化多个实例需要传入唯一id）
 */
sqlite.init = function (path, id) {
    if (path == undefined || path.length == 0) {
        throw new Error("dxsqliteObj.initDb:path should not be null or empty")
    }
    let pointer = sqliteObj.open(path);
    dxCommon.handleId("sqlite", id, pointer)
}

/**
 * 执行语句
 * @param {string} sql 脚本语句，必填
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns 0:成功，非0失败
 */
sqlite.exec = function (sql, id) {
    let pointer = dxCommon.handleId("sqlite", id)
    return sqliteObj.sql_exec(pointer, sql)
}


/**
 * 执行查询语句
 * @param {string} sql 脚本语句，必填
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns 查询结果，形如：[{"id":"1","type":200,"code":"aad7485a","door":"大门","extra":"","tiemType":0,"beginTime":1716613766,"endTime":1716613766,"repeatBeginTime":1716613766,"repeatEndTime":1716613766,"period":"extra"}]
 */
sqlite.select = function (sql, id) {
    let pointer = dxCommon.handleId("sqlite", id)
    return sqliteObj.select(pointer, sql);
}

/**
 * 关闭数据库连接
 * @param {string} id 句柄id，非必填（需保持和init中的id一致）
 * @returns 0:成功，非0失败
 */
sqlite.close = function (id) {
    let pointer = dxCommon.handleId("sqlite", id)
    return sqliteObj.close(pointer)
}

export default sqlite;