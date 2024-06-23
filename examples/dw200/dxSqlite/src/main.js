import sqlite from '../dxmodules/dxSqlite.js'
import logger from '../dxmodules/dxLogger.js'

const id = 'sqlite'

sqlite.init("/app.db", id)

// 创建表
let sql = `CREATE TABLE IF NOT EXISTS d1_permission (
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
    message TEXT);`

// 执行sql
logger.info(sqlite.exec(sql, id));

// 查
logger.info(JSON.stringify(sqlite.select(`SELECT * FROM d1_permission ;`, id)));

// 增
logger.info(sqlite.exec(`INSERT INTO d1_permission VALUES('${new Date().getTime()}','456','789','123','456','789','123',0,1,'extra','message');`, id));

// 删
logger.info(sqlite.exec(`DELETE FROM d1_permission ;`, id));

// 改
logger.info(sqlite.exec(`UPDATE d1_permission SET id = '${new Date().getTime()}' WHERE  id = '${new Date().getTime()}';`, id));

