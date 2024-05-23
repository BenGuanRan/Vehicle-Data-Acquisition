import * as os from "os";

/**
 * 获取当前机器的IPv4地址
 */
function getLocalIPv4Address() {
    const networkInterfaces = os.networkInterfaces();

    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];

        for (const iface of interfaces) {
            const {family, address, internal} = iface;
            if (family === 'IPv4' && !internal) {
                return address;
            }
        }
    }
}

export default getLocalIPv4Address;