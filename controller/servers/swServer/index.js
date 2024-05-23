import net from 'net'
import handleOrders from './handleOrders.js';

const swServer = net.createServer(socket => {
    console.log('上位机连接');

    // 监听来自客户端的数据
    socket.on('data', res => {
        const { type, data, message } = JSON.parse(res)
        switch (type) {
            case 'ORDER':
                handleOrders(socket, message, data)
                break
            case 'CONFIG':
                // syncConfig(data)
                break
            case 'DATA':
            default:
        }
        console.log('Received:', data);
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