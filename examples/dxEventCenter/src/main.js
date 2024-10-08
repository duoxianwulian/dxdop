//通过dxui文件来构建ui的示例
import logger from '../dxmodules/dxLogger.js'
import center from '../dxmodules/dxEventCenter.js'
import * as os from "os";
center.init()
new os.Worker('./worker1.js')
new os.Worker('./worker2.js')
center.on('topic_1_to_ui', refershData1, 'main')
center.on('topic_1_to_worker2', refershData2, 'main')
center.on('topic_1_to_worker2', refershData3, 'main1')
center.on('topic_1_to_worker2', function(data){
    logger.info("refershData4:" + data) 
}, 'main2')
function refershData1(data) {
    logger.info("refershData1:" + data)
}
function refershData2(data) {
    logger.info("refershData2:" + data)
}
function refershData3(data) {
    logger.info("refershData3:" + data)
}
while (true) {
    center.getEvent();//轮询获取一下事件
    os.sleep(10)
}
