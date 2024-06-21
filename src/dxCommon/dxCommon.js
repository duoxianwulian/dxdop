//build: 20240617
// 系统的一些基本操作、还有一些常用的工具函数，基本上每个项目都需要依赖这个组件，另外dxLogger也依赖这个组件
// 依赖组件：dxDriver，dxMap
import { commonClass } from './libvbar-m-dxcommon.so'
import dxMap from './dxMap.js'
import * as std from 'std';

const commonObj = new commonClass();

const common = {}
/**
 * 获取系统启动的运行时间(单位是秒)
 * @returns 
 */
common.getUptime = function () {
    return commonObj.getUptime();
}

/**
 * 获取系统的总内存(单位是字节)
 * @returns 
 */
common.getTotalmem = function () {
    return commonObj.getTotalmem();
}

/**
 * 获取系统剩余内存(单位是字节)
 * @returns 
 */
common.getFreemem = function () {
    return commonObj.getFreemem();
}

common.__start = new Date().getTime()
common.__last = common.__start
common.__min = common.getFreemem() / 1024
common.__max = common.__min
/**
 * 每隔n秒打印一下当前内存，用于调试监控内存使用
 * @param {object} logger 打印日志组件对象
 * @param {number} interval 打印间隔，缺省是10秒 
 */
common.logMem = function (logger, interval = 10) {
    const now = new Date().getTime()
    const pass = (now - this.__start) / 1000
    const free = this.getFreemem() / 1024
    this.__min = Math.min(this.__min, free)
    this.__max = Math.max(this.__max, free)
    let passStr;
    if (pass >= 3600) {
        const hours = Math.floor(pass / 3600)
        const minutes = Math.floor((pass % 3600) / 60)
        const seconds = Math.floor(pass % 60)
        passStr = `${hours}h ${minutes}m ${seconds}s`
    } else if (pass >= 60) {
        const minutes = Math.floor(pass / 60)
        const seconds = Math.floor(pass % 60)
        passStr = `${minutes}m ${seconds}s`
    } else {
        passStr = `${Math.floor(pass)}s`
    }

    let log = `------ ${passStr} passed,free memory(k):${free},min free memory(k):${this.__min},max free memory(k):${this.__max} ------`
    if ((now - this.__last) >= (interval * 1000)) {
        this.__last = now
        // common.systemBrief("free")
        logger.info(log)
    }
}
/**
 * 获取系统可用磁盘总量(单位是字节)
 * @param {string} path 不同的磁盘分区名称（不是目录名），非必填，缺省是'/'
 */
common.getTotaldisk = function (path) {
    return commonObj.getTotaldisk(!path ? "/" : path);
}

/**
 * 获取系统磁盘剩余可用量(单位是字节)
 * @param {string} path 不同的磁盘分区名称（不是目录名），非必填，缺省是'/'
 * @returns 
 */
common.getFreedisk = function (path) {
    return commonObj.getFreedisk(!path ? "/" : path);
}

/**
 * 获取CPU ID
 * @param {number} len 非必填，缺省长度是33位长
 * @returns 
 */
common.getCpuid = function () {
    return commonObj.getCpuid(33);
}

/**
 * 获取设备uuid（字符串）
 * @returns 
 */
common.getUuid = function () {
    return commonObj.getUuid(19);
}

/**
 * 获取设备唯一标识
 * @returns 
 */
common.getSn = function () {
    let sn = std.loadFile('/etc/.sn')
    if (sn) {
        return sn
    } else {
        return commonObj.getUuid(19);
    }
}

/**
 * 获取通过uuid计算的mac地址，这个可以用来初始化网卡的时候用
 * @returns 格式类似：b2:a1:63:3f:99:b6
 */
common.getUuid2mac = function () {
    return commonObj.getUuid2mac(19);
}

/**
 * 获取cpu占用率（不大于100的数字）
 * @returns 
 */
common.getFreecpu = function () {
    return commonObj.getFreecpu();
}


/**
 * RSA 解密 （私钥加密公钥解密）
 * 比如公钥是
 * @param {ArrayBuffer} data 要解密的数据，必填
 * @param {string} publicKey 公钥，必填
 * @returns 
 */
common.arrayBufferRsaDecrypt = function (data, publicKey) {
    if (data === undefined || data === null) {
        throw new Error("dxCommon.arrayBufferRsaDecrypt:'data' parameter should not be null or empty")
    }
    if (publicKey === undefined || publicKey === null || publicKey.length < 1) {
        throw new Error("dxCommon.arrayBufferRsaDecrypt:'publicKey' parameter should not be null or empty")
    }
    return commonObj.arrayBufferRsaDecrypt(data, publicKey)
}

/**
 * @brief   Stirng aes 加密
 */
common.aes128EcbEncrypt = function (input, key) {
    return commonObj.aes128EcbEncrypt(input, key)
}
/**
 * @brief   Stirng aes 解密
 */
common.aes128EcbDecrypt = function (input, key) {
    return commonObj.aes128EcbDecrypt(input, key)
}

/**
 * @brief   arraybuffer ecb 128bit Pkcs7Padding aes 加密
 */
common.aes128Pkcs7PaddingEncode = function (input, key) {
    return commonObj.aes128Pkcs7PaddingEncode(input, key)
}
/**
 * @brief   arraybuffer ecb 128bit Pkcs7Padding aes 解密
 */
common.aes128Pkcs7PaddingDecode = function (input, key) {
    return commonObj.aes128Pkcs7PaddingDecode(input, key)
}

/**
 * 执行操作系统的命令
 * @param {*} cmd 命令
 * @returns 
 */
common.system = function (cmd) {
    return commonObj.system(cmd)
}

/**
 * 执行操作系统的命令 
 * @param {*} cmd 命令 操作系统常用指令(linux绝大部分指令都支持)，必填
 * @returns 
 */
common.systemBrief = function (cmd) {
    return commonObj.systemBrief(cmd)
}

/**
 * 执行操作系统的命令并返回结果
 * @param {*} cmd 命令 操作系统常用指令(linux绝大部分指令都支持)，必填
 * @param {*} resLen 接收数据长度 有时候返回的数据很大，可以通过这个值来返回固定长度的数据，必填
 * @returns 
 */
common.systemWithRes = function (cmd, resLen) {
    return commonObj.systemWithRes(cmd, resLen)
}

/**
 * 执行操作系统的命令阻塞执行
 * @param {*} cmd 命令  操作系统常用指令(linux绝大部分指令都支持)，必填
 * @returns 
 */
common.systemBlocked = function (cmd) {
    return commonObj.systemBlocked(cmd)
}

/**
 * 异步延迟重启
 * @param {*} delay_s 延迟时间
 * @returns 
 */
common.asyncReboot = function (delay_s) {
    return commonObj.asyncReboot(delay_s)
}

/**
 * bcc校验
 * @param {array} data eg:[49,50,51,52,53,54]对应的值是7
 * @returns 校验计算结果
 */
common.calculateBcc = function (data) {
    return commonObj.calculateBcc(data)
}

/**
 * aes cbc解密
 * @param {*}
 * @returns 
 */
common.aes128CbcDecrypt = function (val1, val2, val3) {
    return commonObj.aes128CbcDecrypt(val1, val2, val3)
}

/**
 * aes cbc加密
 * @param {*}
 * @returns 
 */
common.aes128CbcEncrypt = function (val1, val2, val3) {
    return commonObj.aes128CbcEncrypt(val1, val2, val3)
}

/**
 * crc校验 比如字符串'123456'校验计算的结果是数字 158520161
 * @param {string} content 要校验的字符串数据，
 * @returns 
 */
common.crc32 = function (content) {
    if (content === undefined || content === null || typeof (content) != "string" || content.length < 1) {
        throw new Error("dxCommon.crc32:'content' paramter should not be empty")
    }
    return commonObj.crc32(content)
}

/**
 * 计算MD5哈希，比如'123456'对应的数字数组是[49,50,51,52,53,54] 对应的md5是'e10adc3949ba59abbe56e057f20f883e'，
 * 但是返回的不是16进制字符串，是数字数组，可以使用arrToHex函数转换
 * @param {array} arr 数字数组 
 * @returns 数字数组
 */
common.md5Hash = function (arr) {
    return commonObj.md5Hash(arr)
}

/**
 * 文件计算MD5哈希,比如文件里的内容是'123456'，对应的md5是'e10adc3949ba59abbe56e057f20f883e'
 * 但是返回的不是16进制字符串，是数字数组，可以使用arrToHex函数转换
 * @param {string} 文件路径，绝对路径，必填，通常是以/app/code开头
 * @returns 数字数组
 */
common.md5HashFile = function (filePath) {
    if (filePath === undefined || filePath === null || typeof (filePath) != "string") {
        return null
    }
    return commonObj.md5HashFile(filePath)
}

/**
 * 计算HMAC MD5加密,比如加密的数据是'123456',密钥是'654321'，对应的结果是'357cbe6d81a8ec770799879dc8629a53'
 * 但是参数和返回的值都是ArrayBuffer
 * @param {ArrayBuffer} data 需要加密的内容,必填
 * @param {ArrayBuffer} key 密钥 ,必填
 * @returns ArrayBuffer
 */
common.hmacMd5Hash = function (data, key) {
    return commonObj.hmacMd5Hash(data, key)
}

/**
 * 计算HMAC MD5加密,比如加密的数据是'123456',密钥是'654321'，对应的结果是'357cbe6d81a8ec770799879dc8629a53'
 * @param {string} data 需要加密的内容,必填
 * @param {string} key 密钥 ,必填
 * @returns ArrayBuffer
 */
common.hmac = function (data, key) {
    return commonObj.hmac(data, key)
}

/**
 * 文件计算HMAC MD5加密，比如文件里的内容是'123456'，密钥是'654321'，对应的结果是'357cbe6d81a8ec770799879dc8629a53'
 * @param {string} filePath 需要加密的内容存储的文件路径，绝对路径，必填，通常是以/app/code开头
 * @param {array} key 密钥 ,数字数组,必填
 * @returns 数字数组
 */
common.hmacMd5HashFile = function (filePath, key) {
    return commonObj.hmacMd5HashFile(filePath, key)
}

/**
 * 切换设备模式
 * @description 模式切换后会重启设备，进入指定模式，使用方法时需完整维护相互切换的逻辑，切换为业务模式后不能使用IDE功能
 * @param {number} mode 业务模式：1 开发模式：2
 * @returns true false
 */
common.setMode = function (mode) {
    if (mode == 1) {
        //业务模式
        commonObj.systemWithRes(`echo 'app' > /etc/.mode`, 2)
        // 1.0版本切换为其他模式后删除工厂检测（后续版本可能会调整）
        commonObj.systemWithRes(`rm -rf /test`, 2)
    } else if (mode == 2) {
        //开发模式
        commonObj.systemWithRes(`echo 'debug' > /etc/.mode`, 2)
        // 1.0版本切换为其他模式后删除工厂检测（后续版本可能会调整）
        commonObj.systemWithRes(`rm -rf /test`, 2)
    } else {
        return false
    }
    commonObj.systemWithRes(`sync`, 2)
    commonObj.asyncReboot(2)
    return true
}

/**
 * 查询设备模式
 * @description 获取设备当前模式
 * @returns 业务模式：1，开发模式：2，工厂模式：28， 异常模式：-1
 */
common.getMode = function () {
    let ret = commonObj.systemWithRes(`test -e "/etc/.mode" && echo "OK" || echo "NO"`, 2)
    if (ret.includes('NO')) {
        return 28
    }
    let mode = commonObj.systemWithRes(`cat "/etc/.mode"`, 10)
    if (mode.includes('app')) {
        return 1
    } else if (mode.includes('debug')) {
        return 2
    } else {
        return -1
    }
}
/**
 * 十六进制转字节数组 eg:313233616263->[49,50,51,97,98,99]
 * @param {string} str 16进制字符串 小写且中间无空隔的十六进制字符串
 * @returns 数字数字
 */
common.hexToArr = function (str) {
    if (str === undefined || str === null || (typeof str) != 'string' || str.length < 1) {
        throw new Error("dxCommon.hexToArr:'str' parameter should not be empty")
    }
    let regex = /.{2}/g;
    let arr = str.match(regex);
    return arr.map(item => parseInt(item, 16));
}
/**
 * 字节数组转十六进制 eg:[49,50,51,97,98,99]->313233616263
 * @param {array}numbers 数字数组
 * @returns str 16进制字符串 小写且中间无空隔的十六进制字符串
 */
common.arrToHex = function (numbers) {
    const hexArray = numbers.map(num => num.toString(16).padStart(2, '0').toLowerCase());
    const hexString = hexArray.join('');
    return hexString;
}
/**
 * 十六进制转字符串 eg:313233616263->123abc
 * 注意如果16进制字符串是由中文转过去的，再转回中文字符串会有乱码，因为是一个一个字节的转换
 * @param {string} str 要转的16进制字符串
 * @returns 
 */
common.hexToString = function (str) {
    let regex = /.{2}/g;
    let arr = str.match(regex);
    arr = arr.map(item => String.fromCharCode(parseInt(item, 16)));
    return arr.join("");
}
// 将字符串转换为 UTF-8 编码的16进制字符串
common.strToUtf8Hex = function (str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code < 0x80) {
            bytes.push(code);
        } else if (code < 0x800) {
            bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
            bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        } else {
            // 处理 Unicode 编码
            i++;
            code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            bytes.push(
                0xf0 | (code >> 18),
                0x80 | ((code >> 12) & 0x3f),
                0x80 | ((code >> 6) & 0x3f),
                0x80 | (code & 0x3f)
            );
        }
    }
    return this.arrToHex(bytes);
}
/**
 * 传递过来的utf-8的16进制字符串转换成字符串
 * @param {string} hex 
 * @returns 
 */
common.utf8HexToStr = function (hex) {
    let array = this.hexToArr(hex)
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}
/**
 * 字符串转十六进制 eg:123abc->313233616263
 * @param {string} str 要转的字符串
 * @returns 
 */
common.stringToHex = function (str) {
    if (str === undefined || str === null || typeof (str) != "string") {
        return null
    }
    let val = "";
    for (let i = 0; i < str.length; i++) {
        val += str.charCodeAt(i).toString(16)
    }
    return val
}

/**
 * 小端格式转十进制数 eg:001001->69632
 * @param {string} hexString 16进制字符串 小写且中间无空隔的十六进制字符串
 * @returns 数字
 */
common.littleEndianToDecimal = function (hexString) {
    // 将小端格式的十六进制字符串进行反转
    let reversedHexString = hexString
        .match(/.{2}/g)  // 每两个字符分隔
        .reverse()  // 反转数组
        .join("");  // 合并为字符串

    // 将反转后的十六进制字符串转换为十进制数
    let decimal = parseInt(reversedHexString, 16);
    return decimal;
}


/**
 * 十进制数转换为16进制小端格式字符串
 * eg:300->2c01
 * eg:230->e600
 * @param {number} decimalNumber 十进制数字,必填
 * @param {number} byteSize 生成位数 字节的个数，如果超出实际字节个数，会在右边补0，低于会截取，非必填，缺省是2
 * @returns 
 */
common.decimalToLittleEndianHex = function (decimalNumber, byteSize) {
    if (decimalNumber === undefined || decimalNumber === null || (typeof decimalNumber) != 'number') {
        throw new Error("dxCommon.decimalToLittleEndianHex:'decimalNumber' parameter should be number")
    }
    if (byteSize === undefined || byteSize === null || (typeof byteSize) != 'number' || byteSize <= 0) {
        byteSize = 2
    }
    const littleEndianBytes = [];
    for (let i = 0; i < byteSize; i++) {
        littleEndianBytes.push(decimalNumber & 0xFF);
        decimalNumber >>= 8;//相当于除以256
    }
    const littleEndianHex = littleEndianBytes
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    return littleEndianHex;
}

/**
 * 将16进制字符串转换为ArrayBuffer
 * @param {*} hexString 要转换的16进制字符串
 * @returns 
 */
common.hexStringToArrayBuffer = function (hexString) {
    return this.hexStringToUint8Array(hexString).buffer;
}

/**
 * 将16进制字符串转换为Uint8Array
 * @param {string} hexString 要转换的16进制字符串，小写且中间无空隔的十六进制字符串
 * @returns Uint8Array对象
 */
common.hexStringToUint8Array = function (hexString) {
    if (hexString === undefined || hexString === null || (typeof hexString) != 'string' || hexString.length <= 0) {
        throw new Error("dxCommon.hexStringToUint8Array:'hexString' parameter should not be empty")
    }
    let byteString = hexString.match(/.{1,2}/g);
    let byteArray = byteString.map(function (byte) {
        return parseInt(byte, 16);
    });
    let buffer = new Uint8Array(byteArray);
    return buffer;
}

/**
 * 将 ArrayBuffer 转换为十六进制字符串格式
 * @param {ArrayBuffer} buffer 
 * @returns 小写且中间无空隔的十六进制字符串
 */
common.arrayBufferToHexString = function (buffer) {
    return this.uint8ArrayToHexString(new Uint8Array(buffer))
}
/**
 * 将 Uint8Array 转换为十六进制字符串格式
 * @param {Uint8Array} array 
 * @returns 小写且中间无空隔的十六进制字符串
 */
common.uint8ArrayToHexString = function (array) {
    let hexString = '';
    for (let i = 0; i < array.length; i++) {
        const byte = array[i].toString(16).padStart(2, '0');
        hexString += byte;
    }
    return hexString
}
/**
 * 设置/获取组件句柄id通用方法
 * @param {string} name 组件名，必填
 * @param {string} id 句柄id，非必填
 * @param {number} pointer 句柄指针数字，非必填
 * @returns 
 */
common.handleId = function (name, id, pointer) {
    // 组件名不能为空
    if (name === undefined || name === null || name === "" || typeof name !== 'string') {
        return
    }
    let map = dxMap.get('handleIds')
    // 句柄id
    if (id === undefined || id === null || id === "" || typeof id !== 'string') {
        id = "__" + name + "_default"
    }
    if (pointer === undefined || pointer === null || typeof pointer !== 'number') {
        // pointer为空则为获取
        return map.get(id)
    } else {
        // pointer不为空则为设置
        let isExist = map.get(id)
        if (isExist) {
            // 句柄已存在
            return
        }
        map.put(id, pointer)
    }
}


export default common