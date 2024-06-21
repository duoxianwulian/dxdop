import { touchKeyClass } from './libvbar-m-dxtouchkey.so'

const touchKeyObj = new touchKeyClass();

const touchKey = {

	/**
	 * touchKey 初始化
	 * @returns true:成功,false:失败
	 */
	init: function () {
		return touchKeyObj.init()
	},

	/**
	 * touchKey 取消初始化
	 * @returns null
	 */
	deinit: function () {
		return touchKeyObj.deinit()
	},

	/**
	 * touchKey 回调方法注册
	 * @returns true:成功,false:失败
	 */
	registerCb: function () {
		return touchKeyObj.registerCb("touchKeyCb")
	},

	/**
	 * touchKey 取消回调方法注册
	 * @returns true:成功,false:失败
	 */
	unRegisterCb: function () {
		return touchKeyObj.unRegisterCb("touchKeyCb")
	},

	/**
	 * 判断touchKey消息队列是否为空
	 * @returns bool
	 */
	msgIsEmpty: function () {
		return touchKeyObj.msgIsEmpty()
	},

	/**
	 * 从touchKey消息队列中读取数据
	 * @returns json消息对象
	 */
	msgReceive: function () {
		let msg = touchKeyObj.msgReceive()
		return JSON.parse(msg);
	},

}

export default touchKey;
