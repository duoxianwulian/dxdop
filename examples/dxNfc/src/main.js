import nfc from '../dxmodules/dxNfc.js'
import std from '../dxmodules/dxStd.js'
import logger from '../dxmodules/dxLogger.js'

const id = 'nfc'

// nfc初始化
nfc.init(id)

// nfc普通卡回调注册
nfc.cbRegister(id)

// nfc PSAM卡注册回调
nfc.psamCbRegister(id)

std.setInterval(() => {
    if (!nfc.msgIsEmpty(id)) {
        // 打印卡号数据
        let res = nfc.msgReceive(id);
        logger.info(res);
    }
}, 10)

std.setInterval(() => {
    // 判断有卡
    if (nfc.isCardIn(id)) {
        // 读m1卡数据
        nfc.m1cardReadSector(0, 2, 0, 4, [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF], 0x60, id)
        // 写m1卡数据
        nfc.m1cardWriteBlk(0, 5, 0, 2, [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF], 0x61, [0x11, 0x22, 0x33], id)
    }
}, 10)
