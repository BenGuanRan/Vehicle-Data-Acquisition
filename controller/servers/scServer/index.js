import net from 'net'
import { scSocket } from '../../index.js'

const scServer = net.createServer(socket => {
    scSocket.instance = socket
    console.log('采集器连接');


    // 监听采集器断开连接
    socket.on('end', () => {
        scSocket.instance = null
        console.log('采集器断开连接');
    });
});

export default scServer