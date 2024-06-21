// build : 20240419
// PWM代表脉冲宽度调制（Pulse Width Modulation）被用来模拟输出电压或功率，以控制蜂鸣器、电机的速度、LED的亮度、温度调节器的温度等等
import { pwmClass } from './libvbar-b-dxpwm.so'
import * as os from "os"
const pwmObj = new pwmClass();

const pwm = {}

/**
 * 申请pwm通道,申请一次即可
 * @param {number} channel 申请的通道号，支持0~7通道
 * @returns true/false
 */
pwm.request = function (channel) {
	return pwmObj.request(channel)
}
/**
 * 设置PWM模式
 * @param {number} mode  
	0 --> CPU mode,连续波形.
	1 --> DMA mode,指定数量的波形.
	2 --> DMA mode,连续波形.
 * @returns true/false
 */
pwm.setMode = function (mode) {
	return pwmObj.setMode(mode)
}
/**
 * 设置PWM周期 是指一个完整的PWM信号周期所花费的时间
 * @param {number} periodNs  待设置的PWM周期值(单位: ns)
 * @returns true/false
 */
pwm.setPeriod = function (periodNs) {
	return pwmObj.setPeriod(periodNs)
}
/**
 * 设置PWM占空比 是指高电平（脉冲）在一个完整的周期内所占的时间
 * @param {number} dutyNs  待设置的PWM占空比(设置高电平的时间, 单位: ns)
 * @returns true/false
 */
pwm.setDuty = function (dutyNs) {
	return pwmObj.setDuty(dutyNs)
}
/**
 * 设置PWM mode 2，指令数量的波形模式的数量
 * @param {number} dutyNs 
 * @returns true/false
 */
pwm.setDmaDuty = function (dutyNs) {
	return pwmObj.setDmaDuty(dutyNs)
}
/**
 * 使能指定通道
 * @param {number} channel  申请的通道号，支持0~7通道
 * @param {boolean} on 
 * @returns true/false
 */
pwm.enable = function (channel, on) {
	return pwmObj.enable(channel, on)
}
/**
 * 关闭所选通道
 * @param {number} channel 输入参数, 申请的通道号，支持0~7通道
 * @returns true/false
 */
pwm.free = function (channel) {
	return pwmObj.free(channel)
}
/**
 * 设置指定通道的PWM周期
 * @param {number} channel  申请的通道号，支持0~7通道
 * @param {number} periodNs  待设置的PWM周期值(单位: ns)
 * @returns true/false
 */
pwm.setPeriodByChannel = function (channel, periodNs) {
	return pwmObj.setPeriodByChannel(channel, periodNs)
}
/**
 * 设置指定通道的PWM占空比
 * @param {number} channel  申请的通道号，支持0~7通道
 * @param {number} dutyNs 待设置的PWM占空比(设置高电平的时间, 单位: ns)
 * @returns true/false
 */
pwm.setDutyByChannel = function (channel, dutyNs) {
	return pwmObj.setDutyByChannel(channel, dutyNs);
}
/**
* 蜂鸣,需要先request，setPeriodByChannel和enable之后才可以使用
* @param {object} options 蜂鸣的参数 
* 		@param {number} options.channel  申请的通道号，支持0~7通道，必填
* 		@param {number} options.period  待设置的PWM周期值(单位: ns) 缺省是366166
* 		@param {number} options.count 蜂鸣的次数，缺省是1次 
* 		@param {number} options.time 蜂鸣的时间，缺省是50毫秒，如果想长鸣，一般是500毫秒
* 		@param {number} options.interval 2次蜂鸣之间的间隔，缺省是50毫秒
* 		@param {number} options.volume 蜂鸣的音量，缺省是50
*/
pwm.beep = function (options) {
	const {
		count = 1,
		time = 50,
		interval = 50,
		volume = 50,
		period = 366166,
	} = options;
	for (let i = 0; i < count; i++) {
		pwm.setDutyByChannel(options.channel, period * volume / 255)
		os.sleep(time)
		pwm.setDutyByChannel(options.channel, 0)
		if (i < (count - 1)) {
			// 最后一次蜂鸣无间隔
			os.sleep(interval)
		}
	}
}

export default pwm;
