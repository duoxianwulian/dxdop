import log from '../dxmodules/dxLogger.js';
import map from '../dxmodules/dxMap.js'
import * as os from "os";


//获取实例
let map1 = map.get("aaa")

//put数据
let res = map1.put("key1", "value1")
log.info('添加key1数据 : ', res);

//获取数据
res = map1.get("key1")
log.info('获取的key1: ', res);

//删除数据
res = map1.del('key1')
log.info('删除结果: ',res)
log.info('删除后获取key1: ', map1.get("key1"));

map1.put("key1", "value1")
map1.put("key2", "value2")
map1.put("key3", "value3")
map1.put("key4", "value4")
map1.put("key5", "value5")
//获取实例下map 中所有的key
log.info('获取实例aaa下所有的内容:', JSON.stringify(map1.keys()))