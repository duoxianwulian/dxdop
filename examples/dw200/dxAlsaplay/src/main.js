import log from '../dxmodules/dxLogger.js'
import dxAlsaplay from '../dxmodules/dxAlsaplay.js'
import * as os from "os"


//句柄 id
const id = 'alsaplay1'

//初始化语音组件
dxAlsaplay.init(id)
log.info('vg alsaplay start......,id =', id)

//播放语音  路径如下需要设备对应目录存在此文件
dxAlsaplay.play("/app/code/resource/wav/mj_f.wav", id)

//设置音量 0-6
let ret = dxAlsaplay.setVolume(6, id)
log.info("设置音量:", ret ? "成功" : "失败")

//获取音量
let volume = dxAlsaplay.getVolume(id)
log.info("获取音量:", volume)

//获取支持的音量范围
let range = dxAlsaplay.getVolumeRange(id)
log.info("获取音量范围:", range)

//取消初始化 句柄id
let res = dxAlsaplay.deinit(id)
log.info("取消初始化:", res)

os.sleep(3000)
