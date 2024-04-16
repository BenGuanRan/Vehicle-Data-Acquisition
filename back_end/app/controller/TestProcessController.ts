import { Context } from "koa"
import { IResBody } from "../types"
import { BODY_INCOMPLETENESS, FAIL_CODE, QUERY_INCOMPLETENESS, SEARCH_NO_DATA, SEARCH_SUCCESS_MSG, SUCCESS_CODE, WRITE_SUCCESS_MSG } from "../constants"
import { sequelize } from '../db'
import TestProcessService, { ITestProcess } from "../service/TestProcessService"
import TestObjectService from "../service/TestObjectService"
import CollectorSignalService from "../service/CollectorSignalService"

class TestProcessController {
    // 新建一个测试流程
    async createTestProcess(ctx: Context) {
        try {
            const jsonData: ITestProcess = ctx.request.body as ITestProcess

            const { testName, testObjects } = jsonData
            const transaction = await sequelize.transaction()
            try {
                const { id: testProcessId } = (await TestProcessService.createTestProcess({ testName: testName }))?.dataValues!
                for (const { objectName, collectorSignals } of testObjects) {
                    const { id: testObjectId } = (await TestObjectService.createTestObject({ objectName: objectName, testProcessId: testProcessId! }))?.dataValues!
                    for (const collectItem of collectorSignals) {
                        await CollectorSignalService.createSignal({ ...collectItem, testObjectId: testObjectId! })
                    }
                }
                await transaction.commit()
                    ; (ctx.body as IResBody) = {
                        code: SUCCESS_CODE,
                        msg: WRITE_SUCCESS_MSG,
                        data: null
                    }
            } catch (error) {
                console.log(error);
                (ctx.body as IResBody) = {
                    code: FAIL_CODE,
                    msg: (error as Error).toString(),
                    data: null
                }
            }
        } catch (error) {
            console.log(error);
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: BODY_INCOMPLETENESS,
                data: null
            }

        }
    }
    // 查看测试流程详情
    async getTestProcessDetails(ctx: Context) {
        try {
            const { testProcessId } = ctx.request.query as any
            if (testProcessId === undefined) { throw new Error(QUERY_INCOMPLETENESS); }
            const testProcess = await TestProcessService.getTestProcessById(Number(testProcessId))
            if (!testProcess) {
                { throw new Error(SEARCH_NO_DATA); }
            }
            ctx.body = {
                code: SUCCESS_CODE,
                msg: SEARCH_SUCCESS_MSG,
                data: testProcess
            }
        } catch (error) {
            console.log(error);
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }

        }
    }
}

export default new TestProcessController