import net from 'net'
import {handleMessages} from "./handleOrders.js";
import {swSocket} from "../../index.js";

const swServer = net.createServer(socket => {
    console.log('上位机连接')
    swSocket.instance = socket

    socket.on('data', data => {
        handleMessages(socket, data)
    });

    // 监听客户端断开连接
    socket.on('end', () => {
        console.log('上位机断开连接');
    });

    socket.on('error', (err) => {
        console.log('error:', err);
    });
});


export default swServer