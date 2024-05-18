const bufferUtils = {
    verify(buffer) {
        return buffer[0] === 0x5a && buffer[1] === 0xa5 && buffer[buffer.length - 1] == 0xff
    },
    analyse(buffer) {
        return buffer.subarray(2, -1)
    },
    isConfigBackBuffer(buffer) {
        return data.length === 9 && this.verify(buffer) && data[2] === 0xaa && data[3] === 0x02
    }
}

export default bufferUtils