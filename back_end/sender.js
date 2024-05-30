const net = require('net');

// 创建 TCP 客户端
const client = new net.Socket();
const client2 = new net.Socket();

// 连接到服务器
const PORT = 3578;
const HOST = 'localhost';
client.connect(PORT, HOST, () => {
    console.log('Connected to server');
    //5A A5  AA  00  00  FF
    client.write(Buffer.from([0x5a, 0xa5, 0xbb, 0x00, 0x00, 0xff]));
});

client.on('data', data => {
    console.log('Received from server:', data);
});

client.on('close', () => {
    console.log('Connection closed');
});


client2.connect(4000, HOST, () => {
    console.log('Connected to server');
});

client2.on('data', data => {
    console.log('Received from server:', data);
});

client2.on('close', () => {
    console.log('Connection closed');
});




