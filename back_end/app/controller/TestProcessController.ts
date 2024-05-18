import { Context } from "koa"
import { IResBody } from "../types"
import { BODY_INCOMPLETENESS, FAIL_CODE, QUERY_INCOMPLETENESS, SEARCH_FAIL_MSG, SEARCH_NO_DATA, SEARCH_SUCCESS_MSG, SUCCESS_CODE, USER_UN_SENT, WRITE_FAIL_MSG, WRITE_SUCCESS_MSG } from "../constants"
import TestProcessService, { ITestProcess } from "../service/TestProcessService"
import { getUserIdFromCtx } from "../../utils/getUserInfoFromCtx"
import UserService from "../service/UserService";
import ControllerService from "../service/ControllerService"
import CollectorService from "../service/CollectorService"
import SignalService from "../service/SignalService"
import { sequelize } from "../db"
import SendTestConfigRecordService from "../service/SendTestConfigRecordService"
import BE_CONFIG from '../../app/config/be_config'
import net from 'node:net'
import SendTestConfigVerifyCacheService from "../service/SendTestConfigVerifyCacheService"

class TestProcessController {
    // 新建一个测试流程
    async createTestProcess(ctx: Context) {
        try {
            const userId = getUserIdFromCtx(ctx)
            const jsonData: ITestProcess = ctx.request.body as ITestProcess
            const res = await TestProcessService.createTestProcess(userId, jsonData)
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
    // 拷贝一个测试流程
    async copyTestProcess(ctx: Context) {
        try {
            const { testProcessId } = ctx.request.body as any
            if (testProcessId === undefined) { throw new Error(BODY_INCOMPLETENESS); }
            const userId = getUserIdFromCtx(ctx)
            const testProcess = await TestProcessService.getTestProcessDataById(userId, Number(testProcessId))
            if (!testProcess) {
                { throw new Error(SEARCH_NO_DATA); }
            }
            testProcess.testName = `copy_${testProcess.testName}`
            console.log(testProcess.toJSON());

            const res = await TestProcessService.createTestProcess(userId, testProcess.toJSON() as any)
            if (res) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: WRITE_SUCCESS_MSG,
                    data: testProcess
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
                msg: (error as Error).toString(),
                data: null
            }

        }
    }
    // 查看测试流程详情
    async getTestProcessDetails(ctx: Context) {
        try {
            const { testProcessId } = ctx.request.query as any
            if (testProcessId === undefined) { throw new Error(QUERY_INCOMPLETENESS); }
            const userId = getUserIdFromCtx(ctx)
            const testProcess = await TestProcessService.getTestProcessById(userId, Number(testProcessId))
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
            const userId = getUserIdFromCtx(ctx)
            if (testProcessId === undefined) { throw new Error(BODY_INCOMPLETENESS); }
            const testProcess = await TestProcessService.getTestProcessById(userId, Number(testProcessId))
            if (!testProcess) {
                { throw new Error(SEARCH_NO_DATA); }
            }
            const res = await TestProcessService.editProcessById(userId, { ...jsonData, testProcessId: Number(testProcessId) })

            if (res) {
                const testProcess = await TestProcessService.getTestProcessById(userId, Number(testProcessId));
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
            const userId = getUserIdFromCtx(ctx)
            const { keywords, pageNum, pageSize } = ctx.request.query as any
            if ([pageNum, pageSize].includes(undefined) || ![pageNum, pageSize].every(i => /^\d+$/.test(i)) || Number(pageNum) < 1 || Number(pageSize) < 1) {
                throw new Error(BODY_INCOMPLETENESS)
            }
            const res = await TestProcessService.getTestProcessList(userId, {
                keywords, pageNum, pageSize
            })
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
            const userId = getUserIdFromCtx(ctx)
            const res = await TestProcessService.deleteTestProcessById(userId, Number(testProcessId))
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
    // 获取测试配置
    async getTestProcessConfig(ctx: Context) {
        try {
            const { testProcessId } = ctx.request.query as any
            if (testProcessId === undefined) { throw new Error(QUERY_INCOMPLETENESS); }
            const userId = getUserIdFromCtx(ctx)
            const testProcess = await TestProcessService.getTestConfigById(userId, Number(testProcessId))
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

    // 同步测试预配置文件
    async syncPreTestConfig(ctx: Context) {
        try {
            await UserService.onlyRootCanDo(ctx, async (ctx) => {
                const transaction = await sequelize.transaction()
                const userId = getUserIdFromCtx(ctx)
                const { controllersConfig, collectorsConfig, signalsConfig } = ctx.request.body as any
                // 初始化核心板卡
                await ControllerService.initControllers({ data: controllersConfig, userId })
                // 初始化采集板卡
                await CollectorService.initCollectors({ data: collectorsConfig, userId })
                // 初始化采集信号
                await SignalService.initSignals({ data: signalsConfig, userId })
                await transaction.commit();
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: WRITE_SUCCESS_MSG,
                    data: null
                }
            });
        }
        catch (error) {
            console.log(error);
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: WRITE_FAIL_MSG,
                data: null
            }
        }
    }
    // 进入配置模式
    async enterConfigurationMode(ctx: Context) {
        try {
            const { testProcessId } = ctx.request.body as any
            const userId = getUserIdFromCtx(ctx)
            const testProcess = await TestProcessService.getTestConfigById(userId, Number(testProcessId))
            if (!testProcess) {
                { throw new Error(SEARCH_NO_DATA); }
            }
            // 清除userId所对应的cache
            await SendTestConfigVerifyCacheService.clearCache(userId)
            // 将该条记录写入到待对比的数据库记录中
            testProcess.testObjects.forEach(({ collectorSignals }) => {
                collectorSignals.forEach(async ({ controllerInfo: { controllerAddress }, collectorInfo: { collectorAddress }, signalInfo: { innerIndex } }) => {
                    await SendTestConfigVerifyCacheService.addACache({
                        userId,
                        controllerAddress,
                        collectorAddress,
                        testProcessId,
                        controllerServerPort: Number(BE_CONFIG.TCP_PORT),
                    })
                })
            });
            // userId processid 核心卡addr 核心卡端口 板卡addr 采集信号
            // 向核心板发送数据进入配置模式
            const client = new net.Socket();
            client.connect(Number(BE_CONFIG.TCP_PORT!), BE_CONFIG.LOACAL_HOST!, () => {
                // 向核心控制器下发《进入配置模式》指令
                client.write(JSON.stringify({ type: 'ORDER', message: 'CM', data: testProcess }));
            });
            // 监听来自服务器的数据
            client.on('data', async res => {
                if (!Buffer.isBuffer(res)) {
                    const { type, message, data } = JSON.parse(res)
                    if (type === 'ORDER' && message === 'CM_BACK') {
                        await SendTestConfigVerifyCacheService.addACache({
                            userId,
                            testProcessId,
                            controllerAddress: data?.controllerAddress,
                            controllerServerPort: data?.controllerServerPort,
                            collectorAddress: data?.collectorAddress
                        })
                    }
                }
            });
            // 监听服务器关闭连接
            client.on('close', () => {
                console.log('核心控制器关闭');
            });
        } catch (error) {
            console.log(error);
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }
    // 下发测试配置文件
    async sendTestConfig(ctx: Context) {
        try {
            const { testProcessId, dashbordConfig } = ctx.request.body as any
            if (testProcessId === undefined) { throw new Error(BODY_INCOMPLETENESS); }
            const userId = getUserIdFromCtx(ctx)
            const testProcess = await TestProcessService.getTestConfigById(userId, Number(testProcessId))
            if (!testProcess) {
                { throw new Error(SEARCH_NO_DATA); }
            }
            const res = await SendTestConfigRecordService.addTestConfigRecord(Number(userId), { testProcessId, ...testProcess }, dashbordConfig || [])
            if (!res) throw new Error(WRITE_FAIL_MSG)

            ctx.body = {
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
    }
    // 获取当前用户下发的的测试配置详情
    async getSendedTestConfig(ctx: Context) {
        try {
            const userId = getUserIdFromCtx(ctx)
            const testProcessConfig = await SendTestConfigRecordService.getSendedTestProcessId(Number(userId))
            if (testProcessConfig === null) throw new Error(USER_UN_SENT)
            ctx.body = {
                code: SUCCESS_CODE,
                msg: SEARCH_SUCCESS_MSG,
                data: testProcessConfig
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
    // 获取用户dashbord配置
    async getUserTestDashbordConfig(ctx: Context) {
        try {
            const userId = getUserIdFromCtx(ctx)
            const dashbordConfig = await SendTestConfigRecordService.getDashbordConfig(Number(userId))
            ctx.body = {
                code: SUCCESS_CODE,
                msg: SEARCH_SUCCESS_MSG,
                data: dashbordConfig || []
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