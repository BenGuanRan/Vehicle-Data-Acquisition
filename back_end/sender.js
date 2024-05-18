const net = require('net');

// 创建 TCP 客户端
const client = new net.Socket();

// 连接到服务器
const PORT = 4000;
const HOST = 'localhost';
client.connect(PORT, HOST, () => {
    console.log('Connected to server');

    // 发送数据给服务器
    client.write(Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72])); // 创建一个包含指定字节的 Buffer
});

// 监听来自服务器的数据
client.on('data', data => {
    console.log('Received from server:', data.toString());
});

// 监听服务器关闭连接
client.on('close', () => {
    console.log('Connection closed');
});
