import { Op } from 'sequelize'
import { getUserIdFromCtx } from '../../utils/getUserInfoFromCtx'
import { sequelize } from '../db'
import CollectorSignal from '../model/CollectorSignal.model'
import TestObject from '../model/TestObject.model'
import TestProcess, { ITestProcessModel } from '../model/TestProcess.model'
import CollectorSignalService from './CollectorSignalService'
import TestObjectService from './TestObjectService'
import Controller from '../model/Controller.model'
import Collector from '../model/Collector.model'
import Signal from '../model/Signal.model'
import { ITestProcessConfig } from '../../utils/turnTestProcessConfigIntoExcel'

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
            signalId: number
        }[]
    }[]
}

class TestProcessService {
    // 创建一个测试流程
    async createTestProcess(userId: number, param: ITestProcess): Promise<boolean> {
        const { testName, testObjects } = param
        const transaction = await sequelize.transaction()
        try {
            const { id: testProcessId } = (await TestProcess.create({ testName, userId }))?.dataValues!
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
    async getTestProcessById(userId: number, id: number): Promise<TestProcess | null> {
        try {
            const testProcess = await TestProcess.findOne({
                where: { id, userId },
                attributes: [['id', 'testProcessId'], 'testName'],
                include: {
                    model: TestObject,
                    attributes: [['id', 'objectId'], 'objectName'],
                    include: [{
                        model: CollectorSignal,
                        attributes: [['id', 'collectorSignalId'], 'collectorSignalName', 'controllerId', 'collectorId', 'signalId']
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
    async editProcessById(userId: number, data: ITestProcess & { testProcessId: number }): Promise<any | null> {
        const { testProcessId, testObjects, testName } = data
        const transaction = await sequelize.transaction()
        try {
            // 删除所有testProcessId的testObject
            await TestObjectService.deleteTestObjectsByTestProcessId(Number(testProcessId))
            // 修改testName
            await TestProcess.update({ testName }, {
                where: {
                    userId,
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
    async getTestProcessList(userId: number, config: {
        keywords?: string
        pageNum: number
        pageSize: number
    }): Promise<{ total: number, list: TestProcess[] } | null> {
        try {
            const { keywords, pageNum, pageSize } = config
            const total = await TestProcess.count({
                where: {
                    userId,
                    testName: {
                        [Op.like]: `%${keywords || ''}%`
                    }
                }
            })
            const list = await TestProcess.findAll({
                where: {
                    userId,
                    testName: {
                        [Op.like]: `%${keywords || ''}%`
                    }
                },
                attributes: {
                    exclude: ['userId']
                },
                offset: pageNum !== undefined ? (Number(pageNum) - 1) * Number(pageSize) : 0,
                limit: Number(pageSize)
            })
            return ({ total, list })
        } catch (error) {
            console.log(error);
            return null
        }
    }
    // 根据id删除测试流程
    async deleteTestProcessById(userId: number, id: number): Promise<boolean> {
        try {
            const res = await TestProcess.destroy({
                where: { id, userId }
            })
            return res !== 0
        } catch (error) {
            console.log(error);
            return false
        }
    }
    // 根据id查询测试配置文件
    async getTestConfigById(userId: number, id: number): Promise<ITestProcessConfig | null> {
        try {
            const testProcessConfig = await TestProcess.findOne({
                where: { id, userId },
                attributes: ['testName'],
                include: {
                    model: TestObject,
                    attributes: ['objectName'],
                    include: [{
                        model: CollectorSignal,
                        attributes: ['collectorSignalName'],
                        include: [
                            {
                                model: Controller,
                                attributes: ['controllerName', 'controllerAddress']
                            },
                            {
                                model: Collector,
                                attributes: ['collectorName', 'collectorAddress']
                            }, {
                                model: Signal,
                                attributes: ['signalName', 'signalUnit', 'signalType', 'remark', 'innerIndex']
                            }]
                    }]
                }
            })
            return testProcessConfig?.dataValues as any
        } catch (error) {
            console.log(error);
            return null
        }
    }
}
export default new TestProcessService