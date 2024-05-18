import { Context } from "koa";
import ControllerService from "../service/ControllerService";
import { IResBody } from "../types";
import { FAIL_CODE, QUERY_INCOMPLETENESS, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE } from "../constants";
import CollectorService from "../service/CollectorService";
import SignalService from "../service/SignalService";
import { getUserIdFromCtx } from "../../utils/getUserInfoFromCtx";

class BaseInfoController {
    // 获取核心卡列表
    async getControllerList(ctx: Context) {
        try {
            let list = undefined
            list = await ControllerService.getControllers(getUserIdFromCtx(ctx))
            if (!list.length) {
                list = await ControllerService.getControllers()
            }
            if (list !== undefined) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: SEARCH_SUCCESS_MSG,
                    data: list
                }
            } else {
                throw new Error(SEARCH_FAIL_MSG)
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }
    // 获取采集卡列表
    async getCollectorList(ctx: Context) {
        try {
            let list = undefined
            list = await CollectorService.getCollectors(getUserIdFromCtx(ctx))
            if (!list.length) {
                list = await CollectorService.getCollectors()
            }
            if (list !== undefined) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: SEARCH_SUCCESS_MSG,
                    data: list
                }
            } else {
                throw new Error(SEARCH_FAIL_MSG)
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }
    // 根据采集卡id获取采集信号列表
    async getSignalListByCollectorId(ctx: Context) {
        try {
            const { collectorId } = ctx.request.query
            if (collectorId === undefined)
                throw new Error(QUERY_INCOMPLETENESS)
            const list = await SignalService.getSignalListByCollectorId(Number(collectorId))
            if (!list) throw new Error(SEARCH_FAIL_MSG);
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: SEARCH_SUCCESS_MSG,
                data: list
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }
    // 获取测试设备信息
    async getTestDevicesInfo(ctx: Context) {
        try {
            const userId = getUserIdFromCtx(ctx)
            const controllersConfig = await ControllerService.getcontrollersConfig(userId)
            const collectorsConfig = await CollectorService.getcollectorsConfig(userId)
            const signalsConfig = await SignalService.getsignalsConfig(userId);
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: SEARCH_SUCCESS_MSG,
                data: {
                    controllersConfig: controllersConfig.length === 0 ? await ControllerService.getcontrollersConfig() : controllersConfig,
                    collectorsConfig: collectorsConfig.length === 0 ? await CollectorService.getcollectorsConfig() : collectorsConfig,
                    signalsConfig: signalsConfig.length === 0 ? await SignalService.getsignalsConfig() : signalsConfig
                }
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }
}

export default new BaseInfoController