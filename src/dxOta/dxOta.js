//build:20240429
// 负责固件的升级
import log from './dxLogger.js'
import com from './dxCommon.js'
import * as os from 'os';

const ota = {}
//获取当前磁盘剩余大小（k）可能不同的操作系统指令不一样
ota.DF_CMD = `df -k / | awk 'NR==2 {print $4}'`
ota.OTA_ROOT = '/ota'
ota.OTA_RUN = ota.OTA_ROOT + '/run.sh'
/**
 * 升级分二大步骤，第一步是在应用端下载升级包（zip），解压升级包
 * 第二步包括重启设备，利用脚本复制目录和文件或额外一些操作
 * @param {string} url 必填，下载升级包的http url地址 
 * @param {string} md5 必填，升级包的md5标识，下载完通过md5来判断是否完整。32长度的全小写16进制字符串
 * @param {number} size 非必填，升级包的大概大小，单位是k，如果文件太大而剩余磁盘不够，会提前报错误，不会开始启动下载 
 * @param {string} shell 非必填，重启设备后的升级脚本内容，解压后的文件夹缺省是 /ota/temp,升级会缺省把/ota/temp下所有文件拷贝复制到/app/code/下
 * @param {number} timeout 非必填，尝试链接下载地址的超时时间（不是下载完成的时间），缺省是3秒
 */
ota.update = function (url, md5, size, shell, timeout = 3) {
    if (!url || !md5) {
        throw new Error("The 'url' and 'md5' param should not be null")
    }
    if (size && (typeof size != 'number')) {
        throw new Error("The 'size' param should be a number")
    }
    //1. 查看磁盘还剩余的大小
    let df = parseInt(com.systemWithRes(ota.DF_CMD, 1000))
    if (size) {
        if (df < (3 * size)) {//大概本地必须有安装包3倍大小的空间
            throw new Error('The upgrade package is too large, and not be enough space on the disk to download it')
        }
    }
    //2. 下载文件到特定目录
    const firmware = ota.OTA_ROOT + '/download.zip'
    const temp = ota.OTA_ROOT + '/temp'
    com.systemBrief(`rm -rf ${ota.OTA_ROOT} && mkdir ${ota.OTA_ROOT} `) //先删除ota根目录
    let download = `wget --no-check-certificate --timeout=${timeout} -c "${url}" -O ${firmware} 2>&1`
    com.systemBrief(download, 1000)
    let fileExist = (os.stat(firmware)[1] === 0)
    if (!fileExist) {
        throw new Error('Download failed, please check the url:' + url)
    }
    //3. 计算并比较md5是否一样
    let md5Hash = com.md5HashFile(firmware)
    md5Hash = md5Hash.map(v => v.toString(16).padStart(2, 0)).join('')
    if (md5Hash != md5) {
        throw new Error('Download failed with wrong md5 value')
    }
    //4. 解压
    com.systemBrief(`mkdir ${temp} && unzip -o ${firmware} -d ${temp}`)
    //5. 构建脚本文件
    if (!shell) {
        //缺省只是拷贝目录并删除ota根目录
        shell = `cp -r ${temp}/* /app/code \n rm -rf ${ota.OTA_ROOT}`
    }

    com.systemBrief(`echo "${shell}" > ${ota.OTA_RUN} && chmod +x ${ota.OTA_RUN}`)
    fileExist = (os.stat(ota.OTA_RUN)[1] === 0)
    if (!fileExist) {
        throw new Error('Build shell file failed')
    }
    com.systemWithRes(`${ota.OTA_RUN}`)
}
//兼容旧的升级格式，必须是tar.xz格式，且只用来升级资源文件
ota.updateResource = function (url, md5, size, shell, timeout = 3) {
    if (!url || !md5) {
        throw new Error("The 'url' and 'md5' param should not be null")
    }
    if (size && (typeof size != 'number')) {
        throw new Error("The 'size' param should be a number")
    }
    //1. 查看磁盘还剩余的大小
    let df = parseInt(com.systemWithRes(ota.DF_CMD, 1000))
    if (size) {
        if (df < (3 * size)) {//大概本地必须有安装包3倍大小的空间
            throw new Error('The upgrade package is too large, and not be enough space on the disk to download it')
        }
    }
    //2. 下载文件到特定目录
    const firmware = ota.OTA_ROOT + '/download.tar.xz'
    const temp = ota.OTA_ROOT + '/temp'
    com.systemBrief(`rm -rf ${ota.OTA_ROOT} && mkdir ${ota.OTA_ROOT} `) //先删除ota根目录
    let download = `wget --no-check-certificate --timeout=${timeout} -c "${url}" -O ${firmware} 2>&1`
    com.systemBrief(download, 1000)
    let fileExist = (os.stat(firmware)[1] === 0)
    if (!fileExist) {
        throw new Error('Download failed, please check the url:' + url)
    }
    //3. 计算并比较md5是否一样
    let md5Hash = com.md5HashFile(firmware)
    md5Hash = md5Hash.map(v => v.toString(16).padStart(2, 0)).join('')
    if (md5Hash != md5) {
        throw new Error('Download failed with wrong md5 value')
    }
    //4. 解压
    //tar -xJvf test.tar.xz -C /path/
    com.systemBrief(`mkdir ${temp} && tar -xJvf ${firmware} -C ${temp}`)
    //5. 构建脚本文件
    if (!shell) {
        shell = `
        source=${temp}/vgapp/res/image/bk.png
        target=/app/code/resource/image/bg.png
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        source=${temp}/vgapp/res/image/bk_90.png
        target=/app/code/resource/image/bg_90.png
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        source=${temp}/vgapp/res/font/AlibabaPuHuiTi-2-65-Medium.ttf
        target=/app/code/resource/font.ttf
        if test -e "\\$source"; then
            cp "\\$source" "\\$target"
        fi
        source=${temp}/vgapp/wav/*.wav
        target=/app/code/resource/wav/
        cp "\\$source" "\\$target"
        rm -rf ${ota.OTA_ROOT}
        `
    }

    com.systemBrief(`echo "${shell}" > ${ota.OTA_RUN} && chmod +x ${ota.OTA_RUN}`)
    fileExist = (os.stat(ota.OTA_RUN)[1] === 0)
    if (!fileExist) {
        throw new Error('Build shell file failed')
    }
    com.systemWithRes(`${ota.OTA_RUN}`)
}
/**
 * 由调用者来启动重启，一般是update函数没有错误，运行完成并向北向汇报结果后再调用重启
 */
ota.reboot = function () {
    com.asyncReboot(2)
}
//-------------------------private-------------------

export default ota