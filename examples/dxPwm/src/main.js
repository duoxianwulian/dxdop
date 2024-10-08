import pwm from '../dxmodules/dxPwm.js'
import * as os from "os"

// DW200 蜂鸣/亮灯
const PWM_BEEP_CHANNEL_DW200 = 4
const PWM_BEEP_PERIOD_NS_DW200 = 366166
// 占空比，这里的50可以认为是响度/亮度
const PWM_DUTY_DW200 = PWM_BEEP_PERIOD_NS_DW200 * 50 / 255

// 初始化PWM
let resp = pwm.request(PWM_BEEP_CHANNEL_DW200);

// 设置PWM周期
resp = pwm.setPeriodByChannel(PWM_BEEP_CHANNEL_DW200, PWM_BEEP_PERIOD_NS_DW200)

// 申请通道
resp = pwm.enable(PWM_BEEP_CHANNEL_DW200, true)

// PWM-短鸣/闪烁
pwm.setDutyByChannel(PWM_BEEP_CHANNEL_DW200, PWM_DUTY_DW200)

// 短鸣/闪烁100ms
os.sleep(100)

// 关闭PWM,否则会一直蜂鸣/亮灯
pwm.setDutyByChannel(PWM_BEEP_CHANNEL_DW200, 0)


