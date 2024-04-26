import { Context } from "koa"
import fs from 'node:fs'
import path from "node:path";
import send from "koa-send";
import { getPreTestProcessConfigBuffer } from "../../utils/getPreTestProcessConfigBuffer";
import { SEARCH_SUCCESS_MSG, SUCCESS_CODE } from "../constants";

class AssetsController {
    async downloadPreTestConfigFile(ctx: Context) {
        const fileName = '1.xlsx'; // 下载时的文件名
        const buffer = await getPreTestProcessConfigBuffer(path.join(__dirname, `../../assets`))
        // 设置响应头，告诉浏览器这是一个文件下载
        ctx.set('Content-disposition', `attachment; filename=${fileName}`);
        ctx.set('Content-type', 'application/octet-stream');
        // 发送文件
        ctx.body = buffer
    }
}

export default new AssetsController