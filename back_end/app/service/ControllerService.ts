import path from "node:path";
import { excelReader } from "../../utils/excelReader";
import { CONTROLLER_WORKSHEET, DEVICE_CONFIG_FILE_NAME } from "../constants";
import Controller, { IControllerModel } from "../model/Controller.model";
import { sequelize } from "../db";
import TestProcess from "../model/1TestProcess.model";
import SendTestConfigRecord from "../model/SendTestConfigRecord.model";

class ControllerService {
    async initControllers(config?: { userId: number, data: IControllerModel[] }): Promise<boolean> {
        try {
            const transaction = await sequelize.transaction()
            let data = null
            if (!config)
                data = (await excelReader({
                    path: path.join(__dirname, `../../assets/${DEVICE_CONFIG_FILE_NAME}`),
                    workSheetName: CONTROLLER_WORKSHEET,
                    keys: ['controllerName', 'controllerAddress']
                })) as IControllerModel[]
            else {

                const { userId, data: srcData } = config
                // 删除所有用户id所对应的测试流程
                TestProcess.destroy({
                    where: { userId }
                })
                // 删除所有userId对应的配置
                await Controller.destroy({
                    where: { userId }
                })
                // 删除所有用户id所对应的下发记录
                SendTestConfigRecord.destroy({
                    where: { userId }
                })
                data = srcData
            }
            data = data.map(i => ({ ...i, userId: config?.userId }))
            Controller.bulkCreate(data)
            await transaction.commit()
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    async getControllers(userId?: number) {
        const data = await Controller.findAll({
            attributes: ['id', ['controllerName', 'name']],
            where: userId ? { userId } : { userId: null }
        })
        return data
    }
    async getcontrollersConfig(userId?: number) {
        const data = await Controller.findAll({
            where: userId ? { userId } : { userId: null }
        })
        return data
    }
}
export default new ControllerService