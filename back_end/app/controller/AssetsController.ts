import { Context } from "koa"
import fs from 'node:fs'
import path from "node:path";
import send from "koa-send";
import { getPreTestProcessConfigBuffer } from "../../utils/getPreTestProcessConfigBuffer";
import { SEARCH_SUCCESS_MSG, SUCCESS_CODE } from "../constants";
import TestProcessService from "../service/TestProcessService";
import { getUserIdFromCtx } from "../../utils/getUserInfoFromCtx";
import { turnTestProcessConfigIntoExcel } from "../../utils/turnTestProcessConfigIntoExcel";

class AssetsController {
    async downloadPreTestConfigFile(ctx: Context) {
        const fileName = 'preTestConfig.xlsx';
        const buffer = await getPreTestProcessConfigBuffer(path.join(__dirname, `../../assets`))
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
}

export default new AssetsController