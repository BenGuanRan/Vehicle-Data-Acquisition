import { Context } from "koa"
import userService from "../service/UserService"
import tokenUtils from "../../utils/token";
import { BODY_INCOMPLETENESS, FAIL_CODE, HORIZONTAL_OVERREACH_IS_PROHIBITED, INSUFFICIENT_AUTHORITY, LOGIN_FAIL, LOGIN_SUCCESS, QUERY_INCOMPLETENESS, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE, USER_EXISTED, WRITE_SUCCESS_MSG } from '../constants'
import { IResBody } from "../types";
import User from "../model/User.model";

class UserController {
    // 用户登录
    async login(ctx: Context) {
        const { username, password } = ctx.request.body as any
        const res = await userService.findUserByUsernameAndPassword({ username, password })

        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: LOGIN_SUCCESS,
            data: {
                username: res.username,
                isRootUser: res.root_user_id === null ? true : false,
                userId: res.id,
                token: tokenUtils.sign({ username: res.username, password: res.password, userId: res.id! }),
                disabled: res.disabled
            }
        })
        !res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: LOGIN_FAIL,
            data: null
        })
    }
    // 根据root用户id获取子用户列表
    async getUserList(ctx: Context) {
        const { userId } = ctx.request.query
        if (userId === undefined) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: QUERY_INCOMPLETENESS,
                data: null
            }
        } else {
            await userService.onlyRootCanDo(Number(userId), ctx, async (ctx) => {
                const userList = await User.findAll({
                    attributes: { exclude: ['root_user_id', 'password'] },
                    where: {
                        root_user_id: userId
                    }
                });
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: SEARCH_SUCCESS_MSG,
                    data: userList
                }
            })
        }
    }
    // 创建子用户 默认会添加root用户名前缀
    async createUser(ctx: Context) {
        const { child_username, child_password, userId } = ctx.request.body as any
        if ([userId, child_username, child_password].includes(undefined)) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: BODY_INCOMPLETENESS,
                data: null
            }
        } else {
            await userService.onlyRootCanDo(Number(userId), ctx, async (ctx) => {
                // 从token中拿取用户名
                const username = tokenUtils.getUsernameByToken(ctx.header.authorization)
                // 查询该子用户名用户是否已存在
                if (await userService.checkIfUserExisted(Number(userId), `${username}_${child_username}`) === false) {
                    const user = await User.create({
                        username: `${username}_${child_username}`,
                        password: child_password,
                        root_user_id: Number(userId)
                    })
                    const { username: ua, id, root_user_id } = user.dataValues
                        ; (ctx.body as IResBody) = {
                            code: SUCCESS_CODE,
                            msg: WRITE_SUCCESS_MSG,
                            data: {
                                username: ua,
                                userId: id,
                                rootUserId: root_user_id
                            }
                        }
                } else {
                    (ctx.body as IResBody) = {
                        code: FAIL_CODE,
                        msg: USER_EXISTED,
                        data: null
                    }
                }
            })
        }
    }
}

export default new UserController