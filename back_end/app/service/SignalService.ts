import path from "node:path";
import { excelReader } from "../../utils/excelReader";
import { DEVICE_CONFIG_FILE_NAME, SIGNAL_WORKSHEET } from "../constants";
import Signal, { ISignalModel } from "../model/Signal.model";
import CollectorService from "./CollectorService";
import Collector from "../model/Collector.model";
import { sequelize } from "../db";

class SignalService {
    async getSignalListByCollectorId(collectorId: number) {
        const data = await Signal.findAll({
            where: { collectorId },
            attributes: ['id', ['signalName', 'name']]
        })
        return data
    }
    async initSignals(): Promise<boolean> {
        try {
            const data = (await excelReader({
                path: path.join(__dirname, `../../assets/${DEVICE_CONFIG_FILE_NAME}`),
                workSheetName: SIGNAL_WORKSHEET,
                keys: ['innerIndex', 'collectorName', 'signalName', 'signalUnit', 'signalType', 'remark']
            })) as (ISignalModel & { collectorName?: string })[]
            const collectors = await CollectorService.getCollectorsData()
            data!.forEach((value) => {
                const { collectorName: cn } = value
                // 找到collectorName所对应的id
                const collectorId = collectors.filter(({ collectorName }) => collectorName === cn)[0]?.id
                if (collectorId !== undefined) {
                    value['collectorId'] = collectorId
                    delete value['collectorName']
                }
            })
            Signal.bulkCreate(data)
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    async getSignalsData() {
        return await Signal.findAll({
            include: [{
                model: Collector,
                attributes: [],
                as: 'collector'
            }],
            attributes: [
                'id',
                'signalName',
                'signalUnit',
                'signalType',
                'remark',
                'innerIndex',
                [sequelize.literal('collector.collectorName'), 'collectorName'] // 使用sequelize.literal来引用关联模型的字段
            ]
        })
    }
}
export default new SignalService