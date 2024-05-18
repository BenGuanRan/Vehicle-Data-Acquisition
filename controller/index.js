import { SW_SERVER_PORT, SC_SERVER_PORT } from "./constants/index.js";
import swServer from "./servers/swServer/index.js";
import scServer from "./servers/scServer/index.js";

// 上位机软件server
swServer.listen(SW_SERVER_PORT, () => {
    console.log(`上位机软件server listening on port ${SW_SERVER_PORT}`);
})

// 采集器server
scServer.listen(SC_SERVER_PORT, () => {
    console.log(`采集器server listening on port ${SC_SERVER_PORT}`);
})


export const scSocket = {
    instance: null
}