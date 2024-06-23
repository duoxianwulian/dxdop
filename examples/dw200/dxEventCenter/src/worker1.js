import * as os from "os";
import center from '../dxmodules/dxEventCenter.js'
let i = 0;
while (true) {
    i++;
    center.fire('topic_1_to_ui', 'aaaaaass' + i)
    center.fire('topic_1_to_worker2', 'aaaaaass' + i)
    center.fire('tttttt', 'aaaaaass' + i)
    os.sleep(1000)
}