import path from "node:path";
import { excelReader } from "../../utils/excelReader";
import { COLLECTOR_WORKSHEET, DEVICE_CONFIG_FILE_NAME } from "../constants";
import Collector, { ICollectorModel } from "../model/Collector.model";
import { sequelize } from "../db";

class CollectorService {
    async initCollectors(): Promise<boolean> {
        try {
            const transaction = await sequelize.transaction()
            const data = (await excelReader({
                path: path.join(__dirname, `../../assets/${DEVICE_CONFIG_FILE_NAME}`),
                workSheetName: COLLECTOR_WORKSHEET,
                keys: ['collectorName', 'collectorAddress']
            })) as ICollectorModel[]
            Collector.bulkCreate(data)
            await transaction.commit()
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    async getCollectorsData() {
        const data = await Collector.findAll()
        return data
    }
    async getCollectors() {
        const data = await Collector.findAll({
            attributes: ['id', ['collectorName', 'name']]
        })
        return data
    }
}
export default new CollectorService