import net from 'net'
import {scSocket} from '../../index.js'
import handleMessages from "./handleMessages.js";

const scServer = net.createServer(socket => {
    scSocket.instance = socket
    console.log('采集器连接');

    // 监听采集器断开连接
    socket.on('end', () => {
        scSocket.instance = null
        console.log('采集器断开连接');
    });

    socket.on('data', data => {
        handleMessages(socket, data)
    });

    socket.on('error', (err) => {
        console.log('error:', err);
    });
});

export default scServer