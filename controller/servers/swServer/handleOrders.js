import {CONFIG_DOWN, DATA_UPLOAD, INTO_CONFIG, SUCCESS_CODE} from '../../constants/index.js'
import {scSocket} from '../../index.js'
import bufferUtils from '../../utils/bufferUtils.js'

const resIntoConfig = (socket, data) => {
    console.log('resIntoConfig')
    if (!scSocket.instance) return socket.write(SUCCESS_CODE)
    // 下发5A A5  AA  00  00  FF给采集器
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
            socket.write(JSON.stringify({type: 'ORDER', message: 'CM_BACK', data: res}))
        }
        console.log('Received:', data);
    });
    scSocket.instance?.write(Buffer.from([0x5a, 0xa5, 0xaa, 0x00, 0x00, 0xff]))
}

const resConfigDown = (socket, id) => {
    console.log('resConfigDown')
    if (!scSocket.instance) return socket.write(SUCCESS_CODE)
    scSocket.instance?.on('data', data => {
        console.log('Received:', data);
    });

    scSocket.instance?.write(Buffer.from([0x5a, 0xa5, 0xbb, 0x00, id, 0x01, 0x01, 0xff]))
}

const resDataUpload = (socket) => {
    console.log('resDataUpload')
    if (!scSocket.instance) return socket.write(SUCCESS_CODE)
    scSocket.instance?.on('data', data => {
        console.log('Received:', data);
    });

    scSocket.instance?.write(Buffer.from([0x5a, 0xa5, 0xcc, 0x02, 0x00, 0x00, 0xff]))
}


export const handleMessages = (socket, message) => {
    let functionCode = bufferUtils.getFunctionCode(message)
    console.log('Received:', message, "functionCode:", functionCode);
    switch (functionCode) {
        case INTO_CONFIG:
            resIntoConfig(socket)
            break
        case CONFIG_DOWN:
            resConfigDown(socket, 0x01, 0x01)
            break
        case DATA_UPLOAD:
            resDataUpload(socket)
            break
        default:
            console.log('Invalid message:', message)
            break
    }
}