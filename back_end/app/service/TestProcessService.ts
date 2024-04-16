import CollectorSignal from '../model/CollectorSignal.model'
import TestObject from '../model/TestObject.model'
import TestProcess, { ITestProcessModel } from '../model/TestProcess.model'

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
    async createTestProcess(param: ITestProcessModel): Promise<TestProcess | null> {
        try {
            const testProcess = await TestProcess.create(param)
            return testProcess
        } catch (error) {
            console.log(error);
            return null
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
}
export default new TestProcessService