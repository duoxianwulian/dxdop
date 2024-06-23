import common from "../dxmodules/dxCommon.js";
import log from "../dxmodules/dxLogger.js"

//获取系统运行时间
let time = common.getUptime();
log.info("系统运行时间 :" + time)
//获取系统剩余内存
let freemem = common.getFreemem();
log.info("系统剩余内存 :" + freemem)

//获取系统的总内存
let totalmem = common.getTotalmem();
log.info("系统的总内存 :" + totalmem)

//获取系统可用磁盘总量
let totaldisk = common.getTotaldisk()
log.info("系统可用磁盘总量 :" + totaldisk)

//获取系统磁盘剩余可用量
let freedisk = common.getFreedisk()
log.info("系统磁盘剩余可用量 :" + freedisk)

//获取cpuId
let cpuId = common.getCpuid()
log.info("cpuId:" + cpuId)
//获取 uuid
let uuid = common.getUuid()
log.info("uuid :" + uuid)
//获取设备唯一标识
let sn = common.getSn()
log.info("设备唯一标识 :" + sn)
//mac地址
let mac = common.getUuid2mac()
log.info("mac地址 :" + mac)
//获取c cpu 占用率
let freecpu = common.getFreecpu()
log.info("cpu 占用率 :" + freecpu)

//123456对应数组[49, 50, 51, 52, 53, 54] MD5一下
let ret = common.md5Hash([49, 50, 51, 52, 53, 54])
//公钥
let pubkey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIhGA5XLhPR22MRf7ms4R3NeUyV4UvnUiu2YIrxB4RMojK8QY90760Otx6fWZsEi0gY5ysLWPZSZdu92vA4s1BsCAwEAAQ=='
//16 进制内容
let hexData = '0c5cf58609504d91c21bf3d7275644229ca47099fb1f452336d943456caa5c305f5be1ba799b76444c7bdee7e0c33f6d9754a2281dda2a04a2a67b7ae846b0e4'
//16 进制内容转化成ArrayBuffer
let data = common.hexStringToArrayBuffer(hexData)
//解密使用公钥解密
ret = common.arrayBufferRsaDecrypt(data, pubkey)

log.info("解密后内容数组长度" + ret.byteLength);
//arrayBuffer转成16 进制字符串
log.info('arrayBuffer转成16进制字符串:', common.arrayBufferToHexString(data))
//10 进制转化为 16 进制小端格式
log.info('10进制 300 转化为16进制小端格式:', common.decimalToLittleEndianHex(300, 4))
//
log.info('16进制小端格式2c01 转化为10进制:', common.littleEndianToDecimal('2c01'))

//字节数组转十六进制
log.info('字节数组转十六进制:', common.arrToHex([10]))
//十六进制转字节数组
log.info('十六进制转字节数组:', common.hexToArr(common.stringToHex('123456')))
//
log.info('计算 MD5哈希值:', common.arrToHex(common.md5Hash([49, 50, 51, 52, 53, 54])))



//传入前需要转化成ArrayBuffer
ret = common.hmacMd5Hash(str2ab('abcdefg'), str2ab("1234567887654321"))
log.info("hmacMd5Hash结果: ", arrayBufferToHexString(ret));
//可以直接写入字符串  效果和hmacMd5Hash一样
ret = common.hmac('abcdefg', "1234567887654321")
log.info("hmac结果: ", arrayBufferToHexString(ret));








//--------------------------------------私有方法----------------------------------
// 字符串转arraybuffer
function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function arrayBufferToHexString(buffer) {
  const view = new Uint8Array(buffer);
  let hexString = '';

  for (let i = 0; i < view.length; i++) {
    const byte = view[i].toString(16).padStart(2, '0');
    hexString += byte;
  }

  return hexString
}
