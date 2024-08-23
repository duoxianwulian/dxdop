import dxAlsaplay from "../dxmodules/dxAlsaplay.js";

const id = 'alsaplay1'

dxAlsaplay.init(id)

let ret = dxAlsaplay.setVolume(4, id)

export function playAudio (index) {
  switch (index) {
    case 1:
      dxAlsaplay.play("/app/code/resource/medio/1722570475293.wav", id) // 已切换至睡眠模式
      break;
    case 2:
      dxAlsaplay.play("/app/code/resource/medio/1722575853508.wav", id) // 窗帘已打开
      break;
    case 3:
      dxAlsaplay.play("/app/code/resource/medio/1722575932378.wav", id) // 窗帘已关闭
      break;
    case 4:
      dxAlsaplay.play("/app/code/resource/medio/1722576470245.wav", id) // 游戏模式已开启
      break;
    case 5:
      dxAlsaplay.play("/app/code/resource/medio/1722576084201.wav", id) // 设备已开启，欢迎回家
      break;
  }
}