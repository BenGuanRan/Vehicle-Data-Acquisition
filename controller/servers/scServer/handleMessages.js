import {CONFIG_DOWN, DATA_UPLOAD, INTO_CONFIG} from "../../constants/index.js";
import bufferUtils from "../../utils/bufferUtils.js";
import {Buffer} from "buffer";
import getLocalIPv4Address from "../../utils/index.js";

function resIntoConfig(socket) {
    console.log('sc resIntoConfig')
    let ip = getLocalIPv4Address()
    let buffer = Buffer.from([0x5a, 0xa5, 0xaa, 0x00, 0x00, 0xff])
    console.log("进入配置模式回发 buffer:", buffer)
    socket.write(buffer)
}

function resConfigDown(socket, id) {
    console.log('sc resConfigDown')
    let ip = getLocalIPv4Address()
    let buffer = Buffer.from([0x5a, 0xa5, 0xaa, 0x02, ip ?? 0x00, id ?? 0x00, 0xff])
    console.log("配置下发回发 buffer:", buffer)
    socket.write(buffer)
}

function resDataUpload(socket) {
    console.log('sc resDataUpload')
    let ip = getLocalIPv4Address()
    let buffer = Buffer.from([0x5a, 0xa5, 0xaa, 0x02, ip ?? 0x00, id ?? 0x00, 0xff])
    console.log("数据上传回发 buffer:", buffer)
    socket.write(buffer)
}

const handleMessages = (socket, message) => {
    let functionCode = bufferUtils.getFunctionCode(message)
    console.log('sc Received:', message, "functionCode:", functionCode);
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

export default handleMessages