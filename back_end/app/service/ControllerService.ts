import path from "node:path";
import { excelReader } from "../../utils/excelReader";
import { CONTROLLER_WORKSHEET, DEVICE_CONFIG_FILE_NAME } from "../constants";
import Controller, { IControllerModel } from "../model/Controller.model";
import { sequelize } from "../db";

class ControllerService {
    async initControllers(data?: IControllerModel[]): Promise<boolean> {
        try {
            const transaction = await sequelize.transaction()
            await Controller.destroy({
                where: {},
            })
            if (!data)
                data = (await excelReader({
                    path: path.join(__dirname, `../../assets/${DEVICE_CONFIG_FILE_NAME}`),
                    workSheetName: CONTROLLER_WORKSHEET,
                    keys: ['controllerName', 'controllerAddress']
                })) as IControllerModel[]
            Controller.bulkCreate(data)
            await transaction.commit()
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    async getControllers() {
        const data = await Controller.findAll({
            attributes: ['id', ['controllerName', 'name']]
        })
        return data
    }
    async getcontrollersConfig() {
        const data = await Controller.findAll()
        return data
    }
}
export default new ControllerService