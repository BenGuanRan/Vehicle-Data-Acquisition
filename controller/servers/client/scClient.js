// 创建 TCP 客户端
import {Socket} from "net";

const scClient = new Socket();

// 连接到服务器
const PORT = 3578;
const HOST = 'localhost';

scClient.connect(PORT, HOST, () => {
    console.log('Connected to server');
    //5A A5  AA  00  00  FF
    scClient.write(Buffer.from([0x5a, 0xa5, 0xaa, 0x00, 0x00, 0xff]));
});

scClient.on('data', data => {
    console.log('Received from server:', data);
});

scClient.on('close', () => {
    console.log('Connection closed');
});

export default scClient;

