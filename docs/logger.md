<p align="right">
    <b>English</b>| <a href="./logger_CN.md">中文</a>
</p>

# dxLogger and Debugging Introduction  

During the application development process in dejaOS, step-by-step debugging is currently not supported. Instead, developers must rely on logging to debug runtime data. The basic `console.log` in JavaScript is **not recommended** for use in dejaOS, as it cannot provide real-time printing. Instead, we use `dxLogger` as a replacement, which is simple to use. Refer to the following example: 

``` js
import log from '../dxmodules/dxLogger.js'

log.debug("debug..................")
log.info("info..................")
log.error("error..................")

let obj ={a:1,b:"b"}
log.info('object:',obj)

let arr = ['a','b','c']
log.info('array:',arr)

let err = new Error("file not existed")
log.error(err)
```
It supports three levels of logging, with different text colors displayed in the OUTPUT area based on the level.

If an Error object is printed, it will automatically display the detailed error stack, making it easier to locate the line in the code where the error occurred.

![alt text](image/logger.png)
