import { Context, Next } from 'koa'
import tokenUtils from '../../utils/token'
import { BODY_INCOMPLETENESS, FAIL_CODE, TOKEN_MSG, TOKEN_NOTFOUND_CODE } from '../constants'

// post请求时，请求体必须有含义，不能为空白字符、undefined或NULL
function RequestBodyVerifyMiddleware(ctx: Context, next: Next) {
    if (ctx.method !== 'POST') return next()
    const requestBody = ctx.request.body as Object
    // 检查请求体中各个参数是否无意义
    const pass = Object.values(requestBody).every(v => ![null, undefined].includes(v) && (typeof v === 'string' && v.trim() !== ''))
    if (pass) {
        return next()
    } else {
        ctx.body = {
            code: FAIL_CODE,
            msg: BODY_INCOMPLETENESS,
            data: null
        }
        return
    }

}

export default RequestBodyVerifyMiddleware