import log from '../dxmodules/dxLogger.js'
import ota from './dxOta.js'

try {
    let url = 'http://koodle-clouddisk.oss-cn-hangzhou.aliyuncs.com/%E5%9B%A2%E9%98%9F%E6%96%87%E4%BB%B6/%E5%88%98%E5%90%9F/%E5%88%98%E5%90%9F%E7%9A%84%E5%9B%A2%E9%98%9F%E6%96%87%E4%BB%B6%E5%A4%B9/Matter/paho.zip?Expires=1706884706&OSSAccessKeyId=LTAI5tQBUZMVM5QwRWNHL1Bs&Signature=wwAHb3cQIXkGyIIHGecKtVhTLnc%3D'
    let md5 = 'cb2896783b84f8d351e8b7776bde9493'
    ota.update(url, md5, 2000)
} catch (err) {
    log.error('update failed...')
    log.error(err.message)
}