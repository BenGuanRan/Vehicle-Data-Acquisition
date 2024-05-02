import { Context } from "koa"
import path from "node:path";
import { getPreTestProcessConfigTempBuffer, getPreTestProcessConfigBuffer } from "../../utils/getPreTestProcessBuffer";
import { SEARCH_SUCCESS_MSG, SUCCESS_CODE } from "../constants";
import TestProcessService from "../service/TestProcessService";
import { getUserIdFromCtx } from "../../utils/getUserInfoFromCtx";
import { turnTestProcessConfigIntoExcel } from "../../utils/turnTestProcessConfigIntoExcel";
import SendTestConfigRecordService from "../service/SendTestConfigRecordService";

class AssetsController {
    async downloadPreTestConfigFile(ctx: Context) {
        const fileName = 'preTestConfig.xlsx';
        const buffer = await getPreTestProcessConfigBuffer()
        // 设置响应头，告诉浏览器这是一个文件下载
        ctx.set('Content-disposition', `attachment; filename=${fileName}`);
        ctx.set('Content-type', 'application/octet-stream');
        // 发送文件
        ctx.body = buffer
    }
    async downloadPreTestConfigFileTemp(ctx: Context) {
        const fileName = 'preTestTempConfig.xlsx';
        const buffer = await getPreTestProcessConfigTempBuffer(path.join(__dirname, `../../assets`))
        // 设置响应头，告诉浏览器这是一个文件下载
        ctx.set('Content-disposition', `attachment; filename=${fileName}`);
        ctx.set('Content-type', 'application/octet-stream');
        // 发送文件
        ctx.body = buffer
    }
    async downloadTestProcessConfigFileById(ctx: Context) {
        try {
            const fileName = 'testProcessConfig.xlsx';
            const { testProcessId } = ctx.request.query as any
            const userId = getUserIdFromCtx(ctx)
            // 查找测试配置对象
            const testProcessConfigObj = await TestProcessService.getTestConfigById(userId, Number(testProcessId))
            // 将测试配置对象转换成buffer
            const buffer = await turnTestProcessConfigIntoExcel(testProcessConfigObj!)
            // 设置响应头，告诉浏览器这是一个文件下载
            ctx.set('Content-disposition', `attachment; filename=${fileName}`);
            ctx.set('Content-type', 'application/octet-stream');
            // 发送文件
            ctx.body = buffer
        } catch (error) {
            console.log(error);
            ctx.body = new ArrayBuffer(0)
        }
    }
    // 获取用户已下发的测试配置文件
    async downloadUserSendedTestProcessConfig(ctx: Context) {
        try {
            const fileName = 'sendedTestProcessConfig.xlsx';
            const userId = getUserIdFromCtx(ctx)
            // 查找测试配置对象
            const testProcessConfigObj = await SendTestConfigRecordService.getSendedTestProcessId(userId)
            if (!testProcessConfigObj) ctx.body = null
            // 将测试配置对象转换成buffer
            const buffer = await turnTestProcessConfigIntoExcel(testProcessConfigObj!)
            // 设置响应头，告诉浏览器这是一个文件下载
            ctx.set('Content-disposition', `attachment; filename=${fileName}`);
            ctx.set('Content-type', 'application/octet-stream');
            // 发送文件
            ctx.body = buffer
        } catch (error) {
            console.log(error);
            ctx.body = new ArrayBuffer(0)
        }
    }
}

export default new AssetsController