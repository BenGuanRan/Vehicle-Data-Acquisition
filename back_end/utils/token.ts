import jwt from 'jsonwebtoken'
import OT_CONFIG from '../app/config/ot_config'
import { TOKEN_EXPIRED_CODE, TOKEN_ILLEGAL_CODE, TOKEN_INNER_ERROR_CODE, TOKEN_MSG, TOKEN_USER_HAS_BEEN_DELETED_CODE, TOKEN_USER_HAS_BEEN_DISABLED_CODE, TOKEN_USER_LOGOUT, TOKEN_USER_PASSWORD_HAS_BEEN_CHANGED_CODE } from '../app/constants'
import { get } from 'http'
import UserService from '../app/service/UserService'
import TokenBlackListService from '../app/service/TokenBlackListService'

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
    async verify(token: string): Promise<{
        admin: jwt.JwtPayload | null
        err: null | {
            code:
            typeof TOKEN_EXPIRED_CODE |
            typeof TOKEN_ILLEGAL_CODE |
            typeof TOKEN_INNER_ERROR_CODE |
            typeof TOKEN_USER_HAS_BEEN_DELETED_CODE |
            typeof TOKEN_USER_HAS_BEEN_DISABLED_CODE |
            typeof TOKEN_USER_LOGOUT |
            typeof TOKEN_USER_PASSWORD_HAS_BEEN_CHANGED_CODE
            msg: string
        }
    }> {
        try {
            const res = jwt.verify(token, OT_CONFIG.TOKEN_PRIVATE_KEY) as jwt.JwtPayload
            const user = await UserService.getUserById(res.userId)
            if (!user) { // 用户已经被删除
                return {
                    admin: null,
                    err: {
                        code: TOKEN_USER_HAS_BEEN_DELETED_CODE,
                        msg: TOKEN_MSG[TOKEN_USER_HAS_BEEN_DELETED_CODE]
                    }
                }
            } else if (user.disabled) { // 用户被禁用
                return {
                    admin: null,
                    err: {
                        code: TOKEN_USER_HAS_BEEN_DISABLED_CODE,
                        msg: TOKEN_MSG[TOKEN_USER_HAS_BEEN_DISABLED_CODE]
                    }
                }
            } else if (user.password !== res.password) { // 用户密码已修改
                return {
                    admin: null,
                    err: {
                        code: TOKEN_USER_PASSWORD_HAS_BEEN_CHANGED_CODE,
                        msg: TOKEN_MSG[TOKEN_USER_PASSWORD_HAS_BEEN_CHANGED_CODE]
                    }
                }
            } else { // 验证通过
                // 校验用户是否退出登录了
                if (await TokenBlackListService.checkIfTokenInBlackList(token)) {
                    return {
                        admin: null,
                        err: {
                            code: TOKEN_USER_LOGOUT,
                            msg: TOKEN_MSG[TOKEN_USER_LOGOUT]
                        }
                    }
                }
                return {
                    admin: { username: res.username, userId: res.userId },
                    err: null
                }
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
            return userId ? Number(userId) : null
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