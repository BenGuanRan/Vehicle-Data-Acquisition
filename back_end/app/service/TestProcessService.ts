import { sequelize } from '../db'
import CollectorSignal from '../model/CollectorSignal.model'
import TestObject from '../model/TestObject.model'
import TestProcess, { ITestProcessModel } from '../model/TestProcess.model'
import CollectorSignalService from './CollectorSignalService'
import TestObjectService from './TestObjectService'

export interface ITestProcess {
    testProcessId?: number
    testName: string
    testObjects: {
        objectId?: number
        objectName: string
        collectorSignals: {
            collectorSignalId?: number
            collectorSignalName: string
            controllerId: number
            collectorId: number
            signal: string
        }[]
    }[]
}

class TestProcessService {
    // 创建一个测试流程
    async createTestProcess(param: ITestProcess): Promise<boolean> {
        const { testName, testObjects } = param
        const transaction = await sequelize.transaction()
        try {
            const { id: testProcessId } = (await TestProcess.create({ testName }))?.dataValues!
            for (const { objectName, collectorSignals } of testObjects) {
                const { id: testObjectId } = (await TestObjectService.createTestObject({ objectName: objectName, testProcessId: testProcessId! }))?.dataValues!
                for (const collectItem of collectorSignals) {
                    await CollectorSignalService.createSignal({ ...collectItem, testObjectId: testObjectId! })
                }
            }
            await transaction.commit()
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    // 通过id查询一个测试流程
    async getTestProcessById(id: number): Promise<TestProcess | null> {
        try {
            const testProcess = await TestProcess.findOne({
                where: { id },
                attributes: [['id', 'testProcessId'], 'testName'],
                include: {
                    model: TestObject,
                    attributes: [['id', 'objectId'], 'objectName'],
                    include: [{
                        model: CollectorSignal,
                        attributes: [['id', 'collectorSignalId'], 'collectorSignalName', 'controllerId', 'collectorId', 'signal']
                    }]
                }
            })
            return testProcess
        } catch (error) {
            console.log(error);
            return null
        }
    }
    // 通过id编辑一个测试流程
    async editProcessById(data: ITestProcess & { testProcessId: number }): Promise<any | null> {
        const { testProcessId, testObjects, testName } = data
        const transaction = await sequelize.transaction()
        try {
            // 删除所有testProcessId的testObject
            await TestObjectService.deleteTestObjectsByTestProcessId(Number(testProcessId))
            // 修改testName
            await TestProcess.update({ testName }, {
                where: {
                    id: testProcessId
                }
            })
            // 创建新的testObjects和采集信号
            for (const { objectName, collectorSignals } of testObjects) {
                const { id: testObjectId } = (await TestObjectService.createTestObject({ objectName: objectName, testProcessId: testProcessId! }))?.dataValues!
                for (const collectItem of collectorSignals) {
                    await CollectorSignalService.createSignal({ ...collectItem, testObjectId: testObjectId! })
                }
            }
            await transaction.commit()
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    // 获取测试流程列表
    async getTestProcessList(): Promise<TestProcess[] | null> {
        try {
            const tests = await TestProcess.findAll()
            return tests
        } catch (error) {
            console.log(error);
            return null
        }
    }
}
export default new TestProcessService