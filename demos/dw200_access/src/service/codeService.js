import common from '../../dxmodules/dxCommon.js';
import log from '../../dxmodules/dxLogger.js'
import qrRule from '../../dxmodules/dxQrRule.js'
import std from '../../dxmodules/dxStd.js'
import config from '../../dxmodules/dxConfig.js'
import base64 from '../../dxmodules/dxBase64.js'
import ota from "../../dxmodules/dxOta.js";
import sqliteService from "./sqliteService.js";
import driver from '../driver.js';
import utils from '../common/utils/utils.js';
import configConst from '../common/consts/configConst.js';
import queueCenter from '../queueCenter.js'
import mqttService from './mqttService.js';
import * as os from 'os';
let sqliteFuncs = sqliteService.getFunction()
const codeService = {}
codeService.code = function (data) {
    // log.info('[codeService] code :' + data)
    data = qrRule.formatCode(data, sqliteFuncs)
    if (data.type == 'config') {
        // 配置码
        configCode(data.code)
    } else {
        // 通行码
        // log.info("解析通行码：", JSON.stringify(data))
        queueCenter.push("access", data);
    }
}

// 配置码处理
function configCode(code) {
    if (!checkConfigCode(code)) {
        driver.pwm.fail()
        log.error("配置码校验失败")
        return
    }
    let json = utils.parseString(code)
    log.info("解析配置码：", JSON.stringify(json))
    //切换模式
    if (!utils.isEmpty(json.w_model)) {
        try {
            common.setMode(json.w_model)
            driver.pwm.success()
            common.asyncReboot(1)
        } catch (error) {
            log.error(error, error.stack)
            log.info('切换失败不做任何处理');
            driver.pwm.fail()
        }
        return
    }
    // 扫码升级相关
    if (json.update_flag === 1) {
        // 本机升级
        return resourceDownload(json.update_addr, json.update_md5, "/app/data/upgrades/APP_1_0.zip")
    } else if ([2, 3].includes(json.update_flag)) {
        if (utils.isEmpty(json.update_name) || utils.isEmpty(json.update_path)) {
            driver.pwm.fail()
            return
        }
        let downloadPath = "/app/data/upgrades/" + json.update_name
        if (json.update_flag === 2) {
            // 下载图片、SO等
            return resourceDownload(json.update_addr, json.update_md5, downloadPath, () => {
                common.systemBrief(`mv "${downloadPath}" "${json.update_path}"`)
            })
        } else if (json.update_flag === 3) {
            // 下载压缩包
            return resourceDownload(json.update_addr, json.update_md5, downloadPath, () => {
                common.systemBrief(`unzip -o "${downloadPath}" -d "${json.update_path}"`)
            })
        }
    }
    if (!utils.isEmpty(json.update_flg)) {
        // 兼容旧的升级格式
        if (utils.isEmpty(json.update_haddr) || utils.isEmpty(json.update_md5)) {
            driver.pwm.fail()
            return
        }
        try {
            driver.pwm.warning()
            updateResource(json.update_haddr, json.update_md5)
            common.asyncReboot(3)
            return
        } catch (error) {
            log.error(error, error.stack)
            driver.pwm.fail()
            return
        }
    }
    // 设备配置相关
    let configData = {}
    for (let key in json) {
        let transKey = configConst.getValueByKey(key)
        if (transKey == undefined) {
            continue
        }
        let keys = transKey.split(".")
        if (transKey == 'netInfo.dhcp') {
            json[key] = json[key] == 1 ? 0 : 1
        }
        if (transKey == 'uiInfo.language') {
            json[key] = json[key] == 1 ? 'EN' : 'CH'
        }
        if (utils.isEmpty(configData[keys[0]])) {
            configData[keys[0]] = {}
        }
        configData[keys[0]][keys[1]] = json[key]
    }
    let res = false
    if (Object.keys(configData).length > 0) {
        res = mqttService.configVerifyAndSave(configData)
    }
    if (typeof res != 'boolean') {
        log.error(res)
        driver.pwm.fail()
        return
    }
    if (res) {
        driver.pwm.success()
    } else {
        driver.pwm.fail()
        log.error("配置失败")
    }
    if (json.reboot === 1) {
        common.asyncReboot(1)
    }
}

// 下载通用方法
function resourceDownload(url, md5, path, cb) {
    // 本机升级
    if (utils.isEmpty(url) || utils.isEmpty(md5)) {
        driver.pwm.fail()
        return false
    }
    driver.pwm.warning()
    let ret = utils.waitDownload(url, path, 60 * 1000, md5, utils.getUrlFileSize(url))
    if (!ret) {
        driver.pwm.fail()
        return false
    } else {
        driver.pwm.success()
    }
    if (cb) {
        cb()
    }
    // 下载完成，1秒后重启
    common.asyncReboot(0)
    std.sleep(2000)
    return true
}

//校验配置码
function checkConfigCode(code) {
    let password = config.get('sysInfo.com_passwd') || '1234567887654321'
    let lastIndex = code.lastIndexOf("--");
    let firstPart = code.substring(0, lastIndex);
    let secondPart = code.substring(lastIndex + 2);
    let res
    try {
        res = base64.fromHexString(common.arrayBufferToHexString(common.hmac(firstPart, password)))
    } catch (error) {
        log.error(error, error.stack)
        return false
    }
    return res == secondPart;
}

//兼容旧的升级格式，必须是tar.xz格式，且只用来升级资源文件
function updateResource(url, md5, size, shell, timeout = 3) {
    if (!url || !md5) {
        throw new Error("The 'url' and 'md5' param should not be null")
    }
    if (size && (typeof size != 'number')) {
        throw new Error("The 'size' param should be a number")
    }
    //1. 查看磁盘还剩余的大小
    let df = parseInt(common.systemWithRes(ota.DF_CMD, 1000))
    if (size) {
        if (df < (3 * size)) {//大概本地必须有安装包3倍大小的空间
            throw new Error('The upgrade package is too large, and not be enough space on the disk to download it')
        }
    }
    //2. 下载文件到特定目录
    const firmware = ota.OTA_ROOT + '/download.tar.xz'
    const temp = ota.OTA_ROOT + '/temp'
    common.systemBrief(`rm -rf ${ota.OTA_ROOT} && mkdir ${ota.OTA_ROOT} `) //先删除ota根目录
    let download = `wget --no-check-certificate --timeout=${timeout} -c "${url}" -O ${firmware} 2>&1`
    common.systemBrief(download, 1000)
    let fileExist = (os.stat(firmware)[1] === 0)
    if (!fileExist) {
        throw new Error('Download failed, please check the url:' + url)
    }
    //3. 计算并比较md5是否一样
    let md5Hash = common.md5HashFile(firmware)
    md5Hash = md5Hash.map(v => v.toString(16).padStart(2, 0)).join('')
    if (md5Hash != md5) {
        throw new Error('Download failed with wrong md5 value')
    }
    //4. 解压
    //tar -xJvf test.tar.xz -C /path/
    common.systemBrief(`mkdir ${temp} && tar -xJvf ${firmware} -C ${temp}`)
    //5. 构建脚本文件
    if (!shell) {
        shell = `
        source=${temp}/vgapp/res/image/bk.png
        target=/app/code/resource/image/background.png
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        source=${temp}/vgapp/res/image/bk_90.png
        target=/app/code/resource/image/background_90.png
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        source=${temp}/vgapp/res/font/AlibabaPuHuiTi-2-65-Medium.ttf
        target=/app/code/resource/font.ttf
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        source=${temp}/vgapp/wav/0.wav
        target=/app/code/resource/wav/o.wav
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        source=${temp}/vgapp/wav/1.wav
        target=/app/code/resource/wav/1.wav
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        source=${temp}/vgapp/wav/2.wav
        target=/app/code/resource/wav/2.wav
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        source=${temp}/vgapp/wav/3.wav
        target=/app/code/resource/wav/3.wav
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        source=${temp}/vgapp/wav/4.wav
        target=/app/code/resource/wav/4.wav
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        source=${temp}/vgapp/wav/5.wav
        target=/app/code/resource/wav/5.wav
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        rm -rf ${ota.OTA_ROOT}
        `
    }

    common.systemBrief(`echo "${shell}" > ${ota.OTA_RUN} && chmod +x ${ota.OTA_RUN}`)
    fileExist = (os.stat(ota.OTA_RUN)[1] === 0)
    if (!fileExist) {
        throw new Error('Build shell file failed')
    }
    common.systemWithRes(`${ota.OTA_RUN}`)
}

export default codeService
