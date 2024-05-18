import { SUCCESS_CODE } from '../../constants/index.js'
import { scSocket } from '../../index.js'
import bufferUtils from '../../utils/bufferUtils.js'

const handleFuncs = {
    // 进入配置模式
    CM(socket, data) {
        if (!scSocket.instance) return socket.write(SUCCESS_CODE)
        // 下发5A A5  AA  00  00  FF给采集器
        scSocket.instance?.write(Buffer.from([0x5a, 0xa5, 0xaa, 0x00, 0x00, 0xff]))
        // 监听来自采集器的数据
        scSocket.instance?.on('data', data => {
            // 将每一个采集器信号上发给上位机
            // 对采集器上的信号进行转义，且只接收第3，4字节为AA 02的数据帧
            if (bufferUtils.isConfigBackBuffer(data)) {
                const buffer = bufferUtils.analyse(data)
                const res = {
                    controllerAddress: `127.0.0.${parseInt(buffer[2], 16)}`,
                    controllerServerPort: buffer.subarray(3, 5).readInt16BE(),
                    collectorAddress: parseInt(buffer[5], 16) + ''
                }
                // console.log("第三和第四字节为 0xaa 和 0x02");
                // 进行解析
                socket.write(JSON.stringify({ type: 'ORDER', message: 'CM_BACK', data: res }))
            }
            console.log('Received:', data);
        });
    }
}

export default function handleOrders(socket, message, data) {
    return handleFuncs[message](socket, data)
}