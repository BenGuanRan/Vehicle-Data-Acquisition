import jwt from 'jsonwebtoken'
import OT_CONFIG from '../app/config/ot_config'
import { TOKEN_EXPIRED_CODE, TOKEN_ILLEGAL_CODE, TOKEN_INNER_ERROR_CODE, TOKEN_MSG } from '../app/constants'

const tokenUtils = {
    sign(data: {
        username: string
        password: string
        userId: number
    }) {
        return jwt.sign(data, OT_CONFIG.TOKEN_PRIVATE_KEY, {
            expiresIn: OT_CONFIG.TOKEN_EXPIRE
        })
    },
    verify(token: string): {
        admin: jwt.JwtPayload | null,
        err: null | {
            code: typeof TOKEN_EXPIRED_CODE | typeof TOKEN_ILLEGAL_CODE | typeof TOKEN_INNER_ERROR_CODE
            msg: string
        }
    } {
        try {
            const res = jwt.verify(token, OT_CONFIG.TOKEN_PRIVATE_KEY) as jwt.JwtPayload
            return {
                admin: { username: res.username, userId: res.userId },
                err: null
            }
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                // 令牌已过期错误
                console.log('Token expired:', err.message);
                return {
                    admin: null,
                    err: {
                        code: TOKEN_EXPIRED_CODE,
                        msg: TOKEN_MSG[TOKEN_EXPIRED_CODE]
                    }
                }
            } else if (err instanceof jwt.JsonWebTokenError) {
                // 令牌格式错误
                console.log('Token format error:', err.message);
                return {
                    admin: null,
                    err: {
                        code: TOKEN_ILLEGAL_CODE,
                        msg: TOKEN_MSG[TOKEN_ILLEGAL_CODE]
                    }
                }
            } else {
                // 其他未知错误
                console.log('Unknown error:', err);
                return {
                    admin: null,
                    err: {
                        code: TOKEN_INNER_ERROR_CODE,
                        msg: TOKEN_MSG[TOKEN_INNER_ERROR_CODE]
                    }
                }
            }

        }
    },
    getUserIdByToken(token: string): number | null {
        try {
            const { userId } = jwt.verify(token, OT_CONFIG.TOKEN_PRIVATE_KEY) as jwt.JwtPayload
            return userId ? userId : null
        } catch (e) {
            console.log(e);
            return null
        }
    },
    getUsernameByToken(token: string): number | null {
        try {
            const { username } = jwt.verify(token, OT_CONFIG.TOKEN_PRIVATE_KEY) as jwt.JwtPayload
            return username ? username : null
        } catch (e) {
            console.log(e);
            return null
        }
    }
}

export default tokenUtils