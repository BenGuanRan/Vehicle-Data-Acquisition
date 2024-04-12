import { Context, Next } from 'koa'
import tokenUtils from '../../utils/token'
import { TOKEN_MSG, TOKEN_NOTFOUND_CODE } from '../constants'

async function AuthMiddleware(ctx: Context, next: Next) {
    const token = ctx.headers['authorization']
    if (!!token) {
        const { err } = await tokenUtils.verify(token)
        if (!!err) {
            ctx.body = { ...err, data: null }
            return
        } else {
            return next()
        }
    }
    else {
        ctx.body = {
            code: TOKEN_NOTFOUND_CODE,
            msg: TOKEN_MSG[TOKEN_NOTFOUND_CODE],
            data: null
        }
        return
    }
}

export default AuthMiddleware