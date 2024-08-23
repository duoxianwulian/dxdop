import log from '../../dxmodules/dxLogger.js'
import sqlite from '../../dxmodules/dxSqlite.js'
import utils from '../common/utils/utils.js'

//-------------------------variable-------------------------
const sqliteService = {}
//-------------------------public-------------------------
//初始化数据库
sqliteService.init = function (path) {
    if (!path) {
        throw new Error("path should not be null or empty")
    }
    // 创建数据库
    sqlite.init(path)
    // 创建表
    createTables()
}
// 创建表
function createTables() {
    let sql = `CREATE TABLE IF NOT EXISTS d1_pass_record (
        id VARCHAR(128) PRIMARY KEY,
        keyId VARCHAR(128),
        permissionId VARCHAR(128),
        userId VARCHAR(128),
        type VARCHAR(128),
        code VARCHAR(128),
        door VARCHAR(128),
        time INTEGER,
        result INTEGER,
        extra TEXT,
        message TEXT)`
    let ret = sqlite.exec(sql)
    if (ret != 0) {
        throw new Error("table d1_pass_record create exception:" + ret)
    }
    sql = `CREATE TABLE IF NOT EXISTS d1_permission (
        id VARCHAR(128) PRIMARY KEY,
        userId VARCHAR(128),
        door VARCHAR(128),
        extra TEXT,
        timeType INTEGER,
        beginTime INTEGER,
        endTime INTEGER,
        repeatBeginTime INTEGER,
        repeatEndTime INTEGER,
        period TEXT)`
    ret = sqlite.exec(sql)
    if (ret != 0) {
        throw new Error("table d1_permission create exception:" + ret)
    }
    sql = `create table if not exists d1_security(
        id VARCHAR(128) PRIMARY KEY,
        type VARCHAR(128),
        key VARCHAR(128),
        value TEXT,
        startTime INTEGER,
        endTime INTEGER)`
    ret = sqlite.exec(sql)
    if (ret != 0) {
        throw new Error("table d1_security create exception:" + ret)
    }
    sql = `create table if not exists d1_voucher(
        id VARCHAR(128) PRIMARY KEY,
        type VARCHAR(128),
        code VARCHAR(128),
        userId VARCHAR(128),
        extra TEXT)`
    ret = sqlite.exec(sql)
    if (ret != 0) {
        throw new Error("table d1_voucher create exception:" + ret)
    }
    sql = `create table if not exists d1_person(
        id VARCHAR(128) PRIMARY KEY,
        name VARCHAR(128),
        extra TEXT)`
    ret = sqlite.exec(sql)
    if (ret != 0) {
        throw new Error("table d1_person create exception:" + ret)
    }
}
// 创建JPA自动生成增删改查方法
let handler = {
    get: function (target, prop, receiver) {
        return (...args) => {
            return createJPA(prop, target.tableName, ...args)
        }
    }
}
sqliteService.d1_pass_record = new Proxy({ tableName: "d1_pass_record" }, handler);
sqliteService.d1_permission = new Proxy({ tableName: "d1_permission" }, handler);
sqliteService.d1_security = new Proxy({ tableName: "d1_security" }, handler);
sqliteService.d1_voucher = new Proxy({ tableName: "d1_voucher" }, handler);
sqliteService.d1_person = new Proxy({ tableName: "d1_person" }, handler);

// 开始事务，事务不提交数据库重启后，数据会还原，所以transaction后一定要commit，但是如果在一个事务尚未提交或回滚的情况下执行另一个 BEGIN TRANSACTION，SQLite 会自动将新的事务嵌套在之前的事务内部，而不是覆盖之前的事务。
sqliteService.transaction = function () {
    sqlite.exec("BEGIN TRANSACTION;")
}

// 回滚事务
sqliteService.rollback = function () {
    sqlite.exec("ROLLBACK;")
}

// 提交事务，并无法回滚，数据无法还原
sqliteService.commit = function () {
    sqlite.exec("COMMIT;")
}

/**
 * 自动创建jpa常用增删改查sql方法，
 * 支持的规则：findByAAndBAndC,findAll,deleteByAAndBAndC,deleteAll,deleteInBatch,deleteByIdInBatch,updateAByBAndCAndD,save,saveAll,count,countBy
 * 条件分页查询，eg：findByAAndBAndC(x,x,x,{ page: 0, size: 200, 其他条件, id:"123456" })
 * 批量删除，eg：deleteInBatch([{ a: 1, b: 2, c: "3" }, { a: 2 }])
 * 条件删除，eg：deleteAll({ a: 1, b: 2, c: "3" })
 * 单条件批量删除，eg：deleteByIdInBatch([1,2,3,4,5,6])
 * @param {string} methodName 方法名
 * @param {string} tableName 表名
 * @param  {...any} nums 方法参数
 * @returns sqlite执行结果
 */
function createJPA(methodName, tableName, ...nums) {
    let sql
    let isFind = false
    let isCount = false
    if (methodName.startsWith("save")) {
        // 增
        if (methodName.startsWith("saveAll")) {
            // 批量
            nums = nums[0]
            sql = `INSERT INTO ${tableName} VALUES `
            for (let i = 0; i < nums.length; i++) {
                const record = nums[i];
                sql += `(`
                for (let j = 0; j < record.length; j++) {
                    const item = record[j];
                    if (typeof item == 'string') {
                        sql += `'${item}'`
                    } else {
                        sql += `${item}`
                    }
                    if (j != record.length - 1) {
                        sql += `,`
                    }
                }
                sql += `)`
                if (i != nums.length - 1) {
                    sql += `,`
                }
            }
        } else {
            // 单条
            sql = `INSERT INTO ${tableName} VALUES (`
            for (let i = 0; i < nums.length; i++) {
                const item = nums[i];
                if (typeof item == 'string') {
                    sql += `'${item}'`
                } else {
                    sql += `${item}`
                }
                if (i != nums.length - 1) {
                    sql += `,`
                }
            }
            sql += `)`
        }
        methodName = ""
    } else if (methodName.startsWith("delete")) {
        // 删
        if (methodName.startsWith("deleteAll")) {
            // 清空表
            sql = `DELETE FROM ${tableName}`
            methodName = ""
        } else if (methodName.endsWith("InBatch")) {
            if (nums.length != 1) {
                log.error("[JPA]:", "缺少参数")
                return
            }
            sql = `DELETE FROM ${tableName} WHERE `
            if (methodName.indexOf("By") > -1) {
                methodName = methodName.split("By")[1].split("InBatch")[0]
                sql += `${firstLower(methodName)} IN `
                let whereClauses = ""
                for (let i = 0; i < nums[0].length; i++) {
                    const value = nums[0][i];
                    if (typeof value == 'string') {
                        whereClauses += `'${value}'`
                    } else {
                        whereClauses += `${value}`
                    }
                    if (i != nums[0].length - 1) {
                        whereClauses += ","
                    }
                }
                sql += `(${whereClauses})`
            } else {
                for (let i = 0; i < nums[0].length; i++) {
                    let whereClauses = ""
                    const record = nums[0][i];
                    for (const column in record) {
                        const value = record[column];
                        if (typeof value == 'string') {
                            whereClauses += `${column} = '${value}'`
                        } else {
                            whereClauses += `${column} = ${value}`
                        }
                        whereClauses += ` AND `
                    }
                    whereClauses = whereClauses.slice(0, " AND ".length * (-1))
                    sql += `(${whereClauses})`
                    if (i != nums[0].length - 1) {
                        sql += ` OR `
                    }
                }
            }
            methodName = ""
        } else {
            sql = `DELETE FROM ${tableName}`
            methodName = methodName.substring("delete".length)
        }
    } else if (methodName.startsWith("update")) {
        // 改
        sql = `UPDATE ${tableName} SET`
        methodName = methodName.substring("update".length)
    } else if (methodName.startsWith("find")) {
        // 查
        isFind = true
        sql = `SELECT * FROM ${tableName}`
        if (methodName.startsWith("findAll")) {
            methodName = ""
        } else {
            methodName = methodName.substring("find".length)
        }
    } else if (methodName.startsWith("count")) {
        // 统计
        isFind = true
        isCount = true
        sql = `SELECT COUNT(*) FROM ${tableName}`
        methodName = methodName.substring("count".length)
    } else {
        log.error("[JPA]:", "不支持的方法")
        return
    }
    // where条件构建
    let index = methodName.indexOf("By")
    let whereClauses = ""
    if (index > -1) {
        let count = 0
        let conditionsPart = methodName.substring(index + 2)
        if (conditionsPart.indexOf("And") > -1) {
            conditionsPart = conditionsPart.split("And")
            if (nums.length < conditionsPart.length) {
                log.error("[JPA]:", "缺少参数")
                return
            }
            for (let i = 0; i < conditionsPart.length; i++) {
                const field = conditionsPart[i];
                if (typeof nums[i] == 'string') {
                    whereClauses += `${firstLower(field)} = '${nums[i]}'`
                } else {
                    whereClauses += `${firstLower(field)} = ${nums[i]}`
                }
                if (i != conditionsPart.length - 1) {
                    whereClauses += ` AND `
                }
                count = i
            }
        } else if (conditionsPart.indexOf("Or") > -1) {
            conditionsPart = conditionsPart.split("Or")
            if (nums.length < conditionsPart.length) {
                log.error("[JPA]:", "缺少参数")
                return
            }
            for (let i = 0; i < conditionsPart.length; i++) {
                const field = conditionsPart[i];
                if (typeof nums[i] == 'string') {
                    whereClauses += `${firstLower(field)} = '${nums[i]}'`
                } else {
                    whereClauses += `${firstLower(field)} = ${nums[i]}`
                }
                if (i != conditionsPart.length - 1) {
                    whereClauses += ` OR `
                }
                count = i
            }
        } else {
            if (nums.length < 1) {
                log.error("[JPA]:", "缺少参数")
                return
            }
            whereClauses = `${firstLower(conditionsPart)} = ${nums[0]}`
        }
        count++
        // update的set项构建
        let setClauses = ""
        let prefix = methodName.substring(0, index);
        if (prefix.length > 0) {
            prefix = prefix.split("And")
            if ((nums.length - count) < prefix.length) {
                log.error("[JPA]:", "缺少参数")
                return
            }
            for (let i = 0; i < prefix.length; i++) {
                const field = prefix[i];
                if (typeof nums[i + count] == 'string') {
                    setClauses += `${firstLower(field)} = '${nums[i + count]}'`
                } else {
                    setClauses += `${firstLower(field)} = ${nums[i + count]}`
                }
            }
            sql += ` ${setClauses}`
        }
        sql += ` WHERE ${whereClauses}`
    }
    // 判断分页条件查询
    let pageable = nums[nums.length - 1]
    if (typeof pageable == 'object') {
        let clauses = ""
        for (const key in pageable) {
            const condition = pageable[key];
            if (key == "page" || key == "size") {
                continue
            }
            if (typeof condition == 'string') {
                clauses += `${firstLower(key)} = '${condition}'`
            } else {
                clauses += `${firstLower(key)} = ${condition}`
            }
            clauses += ` AND `
        }
        if (clauses.length > 0) {
            clauses = clauses.slice(0, " AND ".length * (-1))
            if (sql.indexOf("WHERE") > -1) {
                sql += ` AND ${clauses}`
            } else {
                sql += ` WHERE ${clauses}`
            }
        }
        if (isFind && !isCount && !utils.isEmpty(pageable.page) && !utils.isEmpty(pageable.size)) {
            sql += ` LIMIT ${pageable.size} OFFSET ${pageable.page}`
        }
    }
    sql += `;`;
    log.info("[JPA]:", sql)
    let ret
    if (isFind) {
        ret = sqlite.select(sql)
        if (ret.length == 1 && !utils.isEmpty(ret[0]["COUNT(*)"])) {
            return ret[0]["COUNT(*)"]
        }
    } else {
        ret = sqlite.exec(sql)
    }
    return ret
}
// 首字母小写
function firstLower(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
export default sqliteService
