import { Context } from "koa";
import tokenUtils from "./token";

export function getUserIdFromCtx(ctx: Context): number {
    const token = ctx.header.authorization
    return tokenUtils.getUserIdByToken(token!)!
}
export function getUsernameFromCtx(ctx: Context): number {
    const token = ctx.header.authorization
    return tokenUtils.getUsernameByToken(token!)!
}