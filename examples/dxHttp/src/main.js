import http from '../dxmodules/dxHttp.js'
import log from '../dxmodules/dxLogger.js'
import * as os from "os";


// 设置请求头
let requestHeaders = []
requestHeaders[0] = "Accept-Charset: utf-8"
requestHeaders[1] = "Content-Type: application/json;charset=utf-8"
requestHeaders[2] = "Connection: keep-alive"

//get请求
let res
try {
    res = http.get("tools.dxiot.com/dxdop/webadmin/componentModel/findAll?page=1&size=10&modelName=mqtt", requestHeaders)
} catch (error) {
    log.error('请求失败:', error)
    return
}
let response = JSON.parse(res);
// get请求返回内容
log.info("get请求返回内容", response.body)

os.sleep(3000)
//post请求
let res1
try {
    res1 = http.post("http://101.200.139.97:8391/webadmin/tools/vg/passCode/getQrcode/v103", JSON.stringify({ code: '1234', expireTime: '123', orgCode: '123' }), requestHeaders)
} catch (error) {
    log.error('请求失败:', error)
    return
}

let response1 = JSON.parse(res1);
log.info("post请求返回内容", response1.body)



//下载文件 url 和 文件保存路径加后缀
let downloadRes = http.download('http://101.200.139.97:8391/webadmin/firmware/downloadFile/APP_3_8.zip', '/app.zip')
log.info(downloadRes);