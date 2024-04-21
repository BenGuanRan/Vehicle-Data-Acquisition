import path from "node:path";
import { excelReader } from "../../utils/excelReader";
import { CONTROLLER_WORKSHEET, DEVICE_CONFIG_FILE_NAME } from "../constants";
import Controller, { IControllerModel } from "../model/Controller.model";

class ControllerService {
    async initControllers(): Promise<boolean> {
        try {
            const data = (await excelReader({
                path: path.join(__dirname, `../../assets/${DEVICE_CONFIG_FILE_NAME}`),
                workSheetName: CONTROLLER_WORKSHEET,
                keys: ['controllerName', 'controllerAddress']
            })) as IControllerModel[]
            Controller.bulkCreate(data)
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
}
export default new ControllerService