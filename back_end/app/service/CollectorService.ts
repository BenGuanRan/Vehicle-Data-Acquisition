import path from "node:path";
import { excelReader } from "../../utils/excelReader";
import { COLLECTOR_WORKSHEET, DEVICE_CONFIG_FILE_NAME } from "../constants";
import Collector, { ICollectorModel } from "../model/Collector.model";
import { sequelize } from "../db";
import TestProcess from "../model/TestProcess.model";
import SendTestConfigRecord from "../model/SendTestConfigRecord.model";

class CollectorService {
    async initCollectors(config?: { userId: number, data: ICollectorModel[] }): Promise<boolean> {
        try {
            const transaction = await sequelize.transaction()
            let data = null
            if (!config)
                data = (await excelReader({
                    path: path.join(__dirname, `../../assets/${DEVICE_CONFIG_FILE_NAME}`),
                    workSheetName: COLLECTOR_WORKSHEET,
                    keys: ['collectorName', 'collectorAddress']
                })) as ICollectorModel[]
            else {
                const { userId, data: srcData } = config!
                // 删除所有用户id所对应的测试流程
                TestProcess.destroy({
                    where: { userId }
                })
                // 删除所有userId对应的配置
                Collector.destroy({
                    where: { userId }
                })
                // 删除所有用户id所对应的下发记录
                SendTestConfigRecord.destroy({
                    where: { userId }
                })
                data = srcData
            }
            data = data.map(i => ({ ...i, userId: config?.userId }))
            await Collector.bulkCreate(data)
            await transaction.commit()
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    async getcollectorsConfig(userId?: number) {
        const data = await Collector.findAll({
            where: userId ? { userId } : { userId: null }
        })
        return data
    }
    async getCollectors(userId?: number) {
        const data = await Collector.findAll({
            attributes: ['id', ['collectorName', 'name']],
            where: userId ? { userId } : { userId: null }
        })
        return data
    }
}
export default new CollectorService