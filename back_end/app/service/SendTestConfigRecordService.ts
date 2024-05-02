import TokenBlackListItem from "../model/TokenBlackListItem.model"
import OT_CONFIG from '../config/ot_config'
import Sequelize from "sequelize"
import SendTestConfigRecord, { IDragItem } from "../model/SendTestConfigRecord"
import { sequelize } from "../db"
import { ITestProcessConfig } from "../../utils/turnTestProcessConfigIntoExcel"

class SendTestConfigRecordService {

    // 添加一条测试配置下发记录
    async addTestConfigRecord(userId: number, testProcessConfig: { testProcessId: number } & ITestProcessConfig, dashbordConfig: IDragItem[] = []) {
        return await SendTestConfigRecord.create({
            userId, dashbordConfig, timestamp: +new Date(), testProcessConfig
        })
    }
    // 获取当前用户下发的测试配置文件
    async getSendedTestProcessId(userId: number): Promise<null | ITestProcessConfig> {
        const res = await SendTestConfigRecord.findOne({
            where: { userId },
            attributes: [
                'testProcessConfig'
            ],
            order: [['timestamp', 'DESC']]
        })
        return res?.get('testProcessConfig') || null
    }
    // 获取当前用户数据面板的配置
    async getDashbordConfig(userId: number): Promise<null | IDragItem[]> {
        const res = await SendTestConfigRecord.findOne({
            where: { userId },
            attributes: [
                'dashbordConfig'
            ],
            order: [['timestamp', 'DESC']]
        })
        return res?.get('dashbordConfig') || null
    }
}
export default new SendTestConfigRecordService