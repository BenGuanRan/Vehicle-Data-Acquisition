import CollectorSignal, { ICollectorSignalModel } from '../model/4CollectorSignal.model'

class CollectorSignalService {

    // 创建一个采集器信号
    async createSignal(param: ICollectorSignalModel): Promise<CollectorSignal | null> {
        try {
            const collectorSignal = await CollectorSignal.create(param)
            return collectorSignal
        } catch (error) {
            console.log(error);
            return null
        }
    }
}
export default new CollectorSignalService