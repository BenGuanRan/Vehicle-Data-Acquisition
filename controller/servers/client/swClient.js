import {Socket} from "net";

const swClient = new Socket();

const POST = 4000;
const HOST = 'localhost';

swClient.connect(POST, HOST, () => {
    console.log('Connected to server');
});

swClient.on('data', data => {
    console.log('Received from server:', data);
});

swClient.on('close', () => {
    console.log('Connection closed');
});

export default swClient;