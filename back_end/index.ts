import run from "./app";
import BE_CONFIG from './app/config/be_config'
import net from 'node:net'

run(BE_CONFIG.BE_PORT!)

export const TCPServer: {
    server: null | net.Server,
    getPort: () => string
} = {
    server: null,
    getPort() {
        return BE_CONFIG.TCP_PORT!
    }
}