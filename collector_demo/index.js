const net = require('net');

// 创建 TCP 客户端
const client = new net.Socket();

// 连接到服务器
const PORT = 4000;
const HOST = 'localhost';
client.connect(PORT, HOST, () => {
    console.log('Connected to server');
});

// 监听来自服务器的数据
client.on('data', data => {
    // 模拟接收到了进入配置模式信号：5A A5  AA  00  00  FF
    if (Buffer.isBuffer() && Buffer.from([0x5a, 0xa5, 0xaa, 0x00, 0x00, 0xff]).equals(data))
        
        client.write(Buffer.from([0x5a, 0xa5, 0xaa, 0x00, 0x00, 0xff]))
    console.log('Received from server:', data);
});

// 监听服务器关闭连接
client.on('close', () => {
    console.log('Connection closed');
});
