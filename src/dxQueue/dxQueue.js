import { queueClass } from './libvbar-m-dxqueue.so'

const queueObj = new queueClass();

function base(name) {

    /**
     * 取出队列顶端数据
     * @param {*} topic 队列名称
     * @returns 
     */
    function pop() {
        if (!name || name.length < 1) {
            throw new Error("dxQueue.pop:name should not be null or empty")
        }
        return queueObj.pop(name)
    }
    /**
     * @brief   向queue中放入数据
     * @param {*} name 队列名称
     * @param {*} value 要放入到队列的数据
     */
    function push(value) {
        if (!name || name.length < 1) {
            throw new Error("dxQueue.push:name should not be null or empty")
        }
        if (!value || value.length < 1) {
            throw new Error("dxQueue.push:value should not be null or empty")
        }
        return queueObj.push(name, value)
    }

    function size() {
        return queueObj.size(name)
    }
    function destroy() {
        return queueObj.destroy(name)
    }
    return { pop, push, size, destroy };
}


const queue = {
    get: function (name) {
        if (!name || name.length == 0) {
            throw new Error("dxQueue.get:name should not be null or empty")
        }
        queueObj.create(name)
        return base(name)
    },
}


export default queue;

