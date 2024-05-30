import {Model} from "sequelize-typescript";

interface ITestObjectModel {
    id?: number
    testObjectName: string
}

/**
 * 新采集对象，包含
 * 1.采集对象，即车辆Vehicle.model
 * 2.采集项目，即Project
 * 3.采集模板，即TestModel
 */

class TestObjectN extends Model<ITestObjectModel> {
    id?: number

}