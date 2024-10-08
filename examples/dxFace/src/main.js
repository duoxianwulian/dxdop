import logger from '../dxmodules/dxLogger.js'
import capturer from '../dxmodules/dxCapturer.js'
import center from '../dxmodules/dxEventCenter.js'
import alsa from '../dxmodules/dxAlsa.js'
import face from '../dxmodules/dxFace.js'
import dxui from '../dxmodules/dxUi.js'
import pwm from '../dxmodules/dxPwm.js'
import * as os from "os"


center.init()
alsa.init()

center.on(face.RECEIVE_MSG, faceService, "service")


let time1 = new Date().getTime()

const capturerRgbId = 'capturerRgb1'
const capturerNirId = 'capturerNir1'


// 彩色摄像头配置参数
let options1 = {
    id: capturerRgbId,
    path: "/dev/video3",
    width: 1280,
    height: 720,
    preview_width: 1020,
    preview_height: 600,
    preview_mode: 2,
    preview_screen_index: 0 // 先后顺序，数字越大越在前面
}


// 红外摄像头配置参数
let options2 = {
    id: capturerNirId,
    path: "/dev/video0",
    width: 800,
    height: 600,
    preview_width: 150,
    preview_height: 200,
    preview_mode: 1,
    preview_screen_index: 1 // 先后顺序，数字越大越在前面
}


// 初始化摄像头
capturer.worker.beforeLoop(options1)
capturer.worker.beforeLoop(options2)



// 初始化红外补光灯
pwm.request(4);
pwm.setPeriodByChannel(4, 366166)
pwm.enable(4, true);
pwm.setDutyByChannel(4, 366166 * 50 / 255)



// UI绘制人脸边框
dxui.init({ orientation: 1 }, {});
let screen_main = dxui.View.build('screen_main', dxui.Utils.LAYER.MAIN)
screen_main.scroll(false)
screen_main.bgOpa(0)
let l1 = dxui.Line.build('l1', screen_main)
l1.lineColor(0xff6600)
l1.lineWidth(8)
dxui.loadMain(screen_main)
let points







// 人脸模块配置参数
let options = {
    dbPath: "/vgmj.db",
    rgbPath: "/dev/video3",
    nirPath: "/dev/video0",
    capturerRgbId: capturerRgbId,
    capturerNirId: capturerNirId,
    score: 0.61,
    mapPath: "/app/path.txt",
    // 保存完整人脸照片路径
    saveFacePath: "/app/code/resource/image/dxl1.jpg",
    // 保存人脸缩略图照片路径
    saveFaceThumbnailPath: "/app/code/resource/image/dxl2.jpg"
}

os.sleep(1000)



// 初始化人脸模块
face.worker.beforeLoop(options)


// 0 人脸识别模式；1 人脸注册模式
// demo临时逻辑，先修改为注册人脸模式，再手动改为识别模式，实际逻辑可以根据业务调整
face.setRecgMode(0)


// 修改人脸比对分数
options.score = 0.7
face.faceUpdateConfig(options)




while (true) {

    face.worker.loop()

    if (dxui.handler() < 0) {
        break
    }
    if (points) {
        l1.setPoints(points, points.length)
    }
    center.getEvent()
    os.sleep(10)
}






// 识别到人脸后2秒开始注册
let toReg = false
let toRegTime = new Date().getTime()


function faceService(data){
    switch (data.status) {
        case "track":
            if (data.rect_smooth) {
                data.rect_smooth = data.rect_smooth.map(v => parseInt(v))
                let x1 = data.rect_smooth[0]
                let y1 = data.rect_smooth[1]
                let x2 = data.rect_smooth[2]
                let y2 = data.rect_smooth[3]
                points = [[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]]
            }
            break;
        case "feature":
            let time2 = new Date().getTime()
            if (data.source == "real-time") {
                if (time2 - time1 > 5000) {
                    time1 = time2
                    // 每5秒识别到播报
                    alsa.ttsPlay("识别到人脸")

                    if (!toReg) {
                        toReg = true
                        toRegTime = time2
                    }
                }

                if (toReg && time2 - toRegTime > 2200) {
                    // 识别到人脸后等待2000ms自动注册，若超过2200ms则取消注册
                    toReg = false
                }
                if (toReg && time2 - toRegTime > 2000) {
                    let ret = face.addFaceFeatures("dxl", data);
                    if (ret) {
                        alsa.ttsPlay("注册成功")
                    } else {
                        alsa.ttsPlay("注册失败")
                    }

                    toReg = false
                }
            } else if (data.source == "picture") {
                logger.debug(data)
            }
            break;
        case "compare":
            alsa.ttsPlay("识别成功")

        default:
            logger.debug(data)
            break;
    }
}

