import { Context } from "koa"
import { IResBody } from "../types"
import { BODY_INCOMPLETENESS, FAIL_CODE, QUERY_INCOMPLETENESS, SEARCH_FAIL_MSG, SEARCH_NO_DATA, SEARCH_SUCCESS_MSG, SUCCESS_CODE, WRITE_FAIL_MSG, WRITE_SUCCESS_MSG } from "../constants"
import { sequelize } from '../db'
import TestProcessService, { ITestProcess } from "../service/TestProcessService"
import TestObjectService from "../service/TestObjectService"
import CollectorSignalService from "../service/CollectorSignalService"
import TestProcess from "../model/TestProcess.model"

class TestProcessController {
    // 新建一个测试流程
    async createTestProcess(ctx: Context) {
        try {
            const jsonData: ITestProcess = ctx.request.body as ITestProcess
            const res = await TestProcessService.createTestProcess(jsonData)
            if (res) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: WRITE_SUCCESS_MSG,
                    data: null
                }
            } else {
                (ctx.body as IResBody) = {
                    code: FAIL_CODE,
                    msg: WRITE_FAIL_MSG,
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
    // 编辑测试流程
    async editTestProcess(ctx: Context) {
        try {
            const jsonData = ctx.request.body as ITestProcess
            const { testProcessId } = jsonData
            if (testProcessId === undefined) { throw new Error(BODY_INCOMPLETENESS); }
            const testProcess = await TestProcess.findByPk(Number(testProcessId))
            if (!testProcess) {
                { throw new Error(SEARCH_NO_DATA); }
            }
            const res = await TestProcessService.editProcessById({ ...jsonData, testProcessId: Number(testProcessId) })

            if (res) {
                const testProcess = await TestProcessService.getTestProcessById(Number(testProcessId));
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: WRITE_SUCCESS_MSG,
                    data: testProcess
                }
            } else {
                throw new Error(WRITE_FAIL_MSG)
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
    // 获取测试流程列表
    async getTestProcessList(ctx: Context) {
        try {
            const res = await TestProcessService.getTestProcessList()
            if (res) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: SEARCH_SUCCESS_MSG,
                    data: res
                }
            } else {
                throw new Error(SEARCH_FAIL_MSG)
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }
    // 删除测试流程
    async deleteTestProcess(ctx: Context) {
        try {
            const { testProcessId } = ctx.request.body as any
            if (testProcessId === undefined) { throw new Error(BODY_INCOMPLETENESS); }
            const res = await TestProcessService.deleteTestProcessById(Number(testProcessId))
            res &&
                ((ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: WRITE_SUCCESS_MSG,
                    data: null
                })
            if (!res) throw new Error(WRITE_FAIL_MSG)
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