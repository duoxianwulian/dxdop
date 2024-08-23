import std from '../dxmodules/dxStd.js'
import dxCommon from '../dxmodules/dxCommon.js'
import dxUart from '../dxmodules/dxUart.js'
import gpio from '../dxmodules/dxGpio.js'
import dxNet from '../dxmodules/dxNet.js'

const driver = {}

driver.gpio = {
    RELAY1: 0,
    RELAY2: 1,
    RELAY3: 2,
    RELAY4: 3,
    CARD_LED:22,
    WORK_LED: 23,
    NET_LED: 98,
    init: function () {
        gpio.init()
        gpio.request(this.RELAY1)
        gpio.request(this.RELAY2)
        gpio.request(this.RELAY3)
        gpio.request(this.RELAY4)
        gpio.request(this.CARD_LED)
        gpio.request(this.WORK_LED)
        gpio.request(this.NET_LED)
    },
    open: function () {
        gpio.setValue(this.RELAY1, 1)
    },
    close: function () {
        gpio.setValue(this.RELAY1, 0)
    },
    setValue: function (id, value) {
        gpio.setValue(id, value)
    }
    
}


driver.uart4850 = {
    id: 'uart4850',
    init: function () {
        dxUart.runvg({ id: this.id, type: dxUart.TYPE.UART, path: '/dev/ttyS0', result: 0, passThrough: false })
        std.sleep(500)
        dxUart.ioctl(1, '115200-8-N-1', this.id)
    },
    ioctl: function (data) {
        dxUart.ioctl(1, data, this.id)
    },
    send: function (data) {
        dxUart.send(data, this.id)
    },
    sendVg: function (data) {
        if (typeof data == 'object') {
            data.length = data.length ? data.length : (data.data ? data.data.length / 2 : 0)
        }
        dxUart.sendVg(data, this.id)
    }
}


driver.uart4851 = {
    id: 'uart4851',
    init: function () {
        dxUart.runvg({ id: this.id, type: dxUart.TYPE.UART, path: '/dev/ttyS1', result: 0, passThrough: false })
        std.sleep(500)
        dxUart.ioctl(1, '115200-8-N-1', this.id)
    },
    ioctl: function (data) {
        dxUart.ioctl(1, data, this.id)
    },
    send: function (data) {
        dxUart.send(data, this.id)
    },
    sendVg: function (data) {
        if (typeof data == 'object') {
            data.length = data.length ? data.length : (data.data ? data.data.length / 2 : 0)
        }
        dxUart.sendVg(data, this.id)
    }
}


driver.uart4852 = {
    id: 'uart4852',
    init: function () {
        dxUart.runvg({ id: this.id, type: dxUart.TYPE.UART, path: '/dev/ttyS2', result: 0, passThrough: false })
        std.sleep(500)
        dxUart.ioctl(1, '115200-8-N-1', this.id)
    },
    ioctl: function (data) {
        dxUart.ioctl(1, data, this.id)
    },
    send: function (data) {
        dxUart.send(data, this.id)
    },
    sendVg: function (data) {
        if (typeof data == 'object') {
            data.length = data.length ? data.length : (data.data ? data.data.length / 2 : 0)
        }
        dxUart.sendVg(data, this.id)
    }
}


driver.net = {
    options : {
        type: dxNet.TYPE.ETHERNET,
        dhcp: dxNet.DHCP.DYNAMIC,
        macAddr: dxCommon.getUuid2mac(),
    },
    init: function () {
        dxNet.worker.beforeLoop(this.options)
    },
    loop: function () {
        dxNet.worker.loop()
    }
}

export default driver
