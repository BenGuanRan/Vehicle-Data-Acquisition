import {CONFIG_DOWN, DATA_UPLOAD, INTO_CONFIG} from "../constants/index.js";

const bufferUtils = {
    verify(buffer) {
        return buffer[0] === 0x5a && buffer[1] === 0xa5 && buffer[buffer.length - 1] == 0xff
    },
    analyse(buffer) {
        return buffer.subarray(2, -1)
    },
    isConfigBackBuffer(buffer) {
        return data.length === 9 && this.verify(buffer) && data[2] === 0xaa && data[3] === 0x02
    },
    getFunctionCode(buffer) {
        if (!this.verify(buffer)) return null
        switch (buffer[2]) {
            case 0xaa:
                return INTO_CONFIG
            case 0xbb:
                return CONFIG_DOWN
            case 0xcc:
                return DATA_UPLOAD
            default:
                return null
        }
    },
}

export default bufferUtils