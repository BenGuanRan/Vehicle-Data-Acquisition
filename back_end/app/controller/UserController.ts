import { Context } from "koa"
import tokenUtils from "../../utils/token";
import { BODY_INCOMPLETENESS, FAIL_CODE, HAS_BEEN_DISABLED, HAS_BEEN_START, HORIZONTAL_OVERREACH_IS_PROHIBITED, INSUFFICIENT_AUTHORITY, LOGIN_FAIL, LOGIN_SUCCESS, PLEASE_BAN_FIRST, QUERY_INCOMPLETENESS, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE, USER_EXISTED, USER_UNEXIST, WRITE_FAIL_MSG, WRITE_SUCCESS_MSG } from '../constants'
import { IResBody } from "../types";
import { getUserIdFromCtx, getUsernameFromCtx } from "../../utils/getUserInfoFromCtx";
import UserService from "../service/UserService";
import TokenBlackListService from "../service/TokenBlackListService";

class UserController {
    // 用户登录
    async login(ctx: Context) {
        const { username, password } = ctx.request.body as any
        const res = await UserService.findUserByUsernameAndPassword({ username, password })

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
        const userId = getUserIdFromCtx(ctx)
        const { keywords, pageNum, pageSize } = ctx.request.query as any
        if ([userId, pageNum, pageSize].includes(undefined) || ![userId, pageNum, pageSize].every(i => /^\d+$/.test(i)) || Number(pageNum) < 1 || Number(pageSize) < 1) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: QUERY_INCOMPLETENESS,
                data: null
            }
        } else {
            await UserService.onlyRootCanDo(ctx, async (ctx) => {
                const userList = await UserService.getUserList(userId, {
                    keywords, pageNum, pageSize
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
        const { childUsername, childPassword } = ctx.request.body as any
        if ([childUsername, childPassword].includes(undefined)) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: BODY_INCOMPLETENESS,
                data: null
            }
        } else {
            await UserService.onlyRootCanDo(ctx, async (ctx) => {
                const username = getUsernameFromCtx(ctx)
                const userId = getUserIdFromCtx(ctx)
                // 查询该子用户名用户是否已存在
                if (await UserService.checkIfUserExisted(Number(userId), `${username}_${childUsername}`) === false) {
                    const userInfo = await UserService.createUser({
                        username: `${username}_${childUsername}`,
                        password: childPassword,
                        rootUserId: Number(userId)
                    })
                    userInfo && ((ctx.body as IResBody) = {
                        code: SUCCESS_CODE,
                        msg: WRITE_SUCCESS_MSG,
                        data: {
                            ...userInfo
                        }
                    })
                    !userInfo && (
                        (ctx.body as IResBody) = {
                            code: FAIL_CODE,
                            msg: WRITE_FAIL_MSG,
                            data: null
                        }
                    )
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
    // 关闭子用户服务
    async closeUser(ctx: Context) {
        const { childUserId } = ctx.request.body as any
        if (childUserId === undefined) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: BODY_INCOMPLETENESS,
                data: null
            }
            return
        }
        await UserService.onlyRootCanDo(ctx, async (ctx) => {
            const userId = getUserIdFromCtx(ctx)
            if (await UserService.checkIfUserBelong2RootUser(Number(userId), Number(childUserId))) {
                const ifUserDisabled = await UserService.checkUserStatusById(Number(childUserId))
                if (ifUserDisabled === null) {
                    // 用户不存在
                    (ctx.body as IResBody) = {
                        code: FAIL_CODE,
                        msg: USER_UNEXIST,
                        data: null
                    }
                } else if (ifUserDisabled) {
                    // 已经处于禁用状态
                    (ctx.body as IResBody) = {
                        code: FAIL_CODE,
                        msg: HAS_BEEN_DISABLED,
                        data: null
                    }
                } else {
                    // 禁用子用户服务
                    const flag = await UserService.changeUserStatus(Number(childUserId), true);
                    if (flag) {
                        (ctx.body as IResBody) = {
                            code: SUCCESS_CODE,
                            msg: WRITE_SUCCESS_MSG,
                            data: null
                        }
                    } else {
                        (ctx.body as IResBody) = {
                            code: FAIL_CODE,
                            msg: WRITE_FAIL_MSG,
                            data: null
                        }
                    }

                }
            } else {
                (ctx.body as IResBody) = {
                    code: FAIL_CODE,
                    msg: HORIZONTAL_OVERREACH_IS_PROHIBITED,
                    data: null
                }
            }
        })

    }
    // 开启子用户服务
    async openUser(ctx: Context) {
        const { childUserId } = ctx.request.body as any
        if (childUserId === undefined) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: BODY_INCOMPLETENESS,
                data: null
            }
            return
        }
        await UserService.onlyRootCanDo(ctx, async (ctx) => {
            const userId = getUserIdFromCtx(ctx)
            if (await UserService.checkIfUserBelong2RootUser(Number(userId), Number(childUserId))) {
                const ifUserDisabled = await UserService.checkUserStatusById(Number(childUserId))
                if (ifUserDisabled === null) {
                    // 用户不存在
                    (ctx.body as IResBody) = {
                        code: FAIL_CODE,
                        msg: USER_UNEXIST,
                        data: null
                    }
                } else if (!ifUserDisabled) {
                    // 已经处于开启状态
                    (ctx.body as IResBody) = {
                        code: FAIL_CODE,
                        msg: HAS_BEEN_START,
                        data: null
                    }
                } else {
                    // 启用子用户服务
                    const flag = await UserService.changeUserStatus(Number(childUserId), false);
                    if (flag) {
                        (ctx.body as IResBody) = {
                            code: SUCCESS_CODE,
                            msg: WRITE_SUCCESS_MSG,
                            data: null
                        }
                    } else {
                        (ctx.body as IResBody) = {
                            code: FAIL_CODE,
                            msg: WRITE_FAIL_MSG,
                            data: null
                        }
                    }

                }
            } else {
                (ctx.body as IResBody) = {
                    code: FAIL_CODE,
                    msg: HORIZONTAL_OVERREACH_IS_PROHIBITED,
                    data: null
                }
            }
        })

    }
    // 删除子用户
    async deleteUser(ctx: Context) {
        const { childUserId } = ctx.request.body as any
        if (childUserId === undefined) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: BODY_INCOMPLETENESS,
                data: null
            }
            return
        }
        await UserService.onlyRootCanDo(ctx, async (ctx) => {
            const userId = getUserIdFromCtx(ctx)
            if (await UserService.checkIfUserBelong2RootUser(Number(userId), Number(childUserId))) {
                const ifUserDisabled = await UserService.checkUserStatusById(Number(childUserId))
                if (ifUserDisabled === null) {
                    // 用户不存在
                    (ctx.body as IResBody) = {
                        code: FAIL_CODE,
                        msg: USER_UNEXIST,
                        data: null
                    }
                } else if (!ifUserDisabled) {
                    // 先禁用子用户
                    (ctx.body as IResBody) = {
                        code: FAIL_CODE,
                        msg: PLEASE_BAN_FIRST,
                        data: null
                    }
                } else {
                    // 删除子用户
                    const flag = await UserService.deleteUserById(Number(childUserId));
                    if (flag) {
                        (ctx.body as IResBody) = {
                            code: SUCCESS_CODE,
                            msg: WRITE_SUCCESS_MSG,
                            data: null
                        }
                    } else {
                        (ctx.body as IResBody) = {
                            code: FAIL_CODE,
                            msg: WRITE_FAIL_MSG,
                            data: null
                        }
                    }

                }
            } else {
                (ctx.body as IResBody) = {
                    code: FAIL_CODE,
                    msg: HORIZONTAL_OVERREACH_IS_PROHIBITED,
                    data: null
                }
            }
        })

    }
    // 修改用户·密码
    async changePassword(ctx: Context) {
        const { childUserId, password } = ctx.request.body as any
        // 按照有无childUserId区分，若是有的话，则视为子用户修改密码模式，否则视为管理员模式
        enum CHANGE_PASSWORD_MODE {
            ROOT_USER, // 管理员模式
            CHILD_USER, // 子用户模式
            BODY_ERROR // BODY参数不全
        }
        // 判断模式
        let mode = null
        if (![childUserId, password].includes(undefined)) mode = CHANGE_PASSWORD_MODE.CHILD_USER
        else if (![password].includes(undefined)) mode = CHANGE_PASSWORD_MODE.ROOT_USER
        else mode = CHANGE_PASSWORD_MODE.BODY_ERROR
        // 处理模式
        switch (mode) {
            case CHANGE_PASSWORD_MODE.CHILD_USER:
                const res = await UserService.changePasswordById(Number(childUserId), password)
                res && (
                    (ctx.body as IResBody) = {
                        code: SUCCESS_CODE,
                        msg: WRITE_SUCCESS_MSG,
                        data: { ...res }
                    }
                )
                !res && (
                    (ctx.body as IResBody) = {
                        code: FAIL_CODE,
                        msg: WRITE_FAIL_MSG,
                        data: null
                    }
                )
                break
            case CHANGE_PASSWORD_MODE.ROOT_USER:
                await UserService.onlyRootCanDo(ctx, async (ctx) => {
                    const userId = getUserIdFromCtx(ctx)
                    const res = await UserService.changePasswordById(Number(userId), password)
                    res && (
                        (ctx.body as IResBody) = {
                            code: SUCCESS_CODE,
                            msg: WRITE_SUCCESS_MSG,
                            data: { ...res }
                        }
                    )
                    !res && (
                        (ctx.body as IResBody) = {
                            code: FAIL_CODE,
                            msg: WRITE_FAIL_MSG,
                            data: null
                        }
                    )
                })
                break
            case CHANGE_PASSWORD_MODE.BODY_ERROR:
                (ctx.body as IResBody) = {
                    code: FAIL_CODE,
                    msg: BODY_INCOMPLETENESS,
                    data: null
                }
                break
            default:
                (ctx.body as IResBody) = {
                    code: FAIL_CODE,
                    msg: WRITE_FAIL_MSG,
                    data: null
                }
        }
    }
    // 登出
    async logout(ctx: Context) {
        const token = ctx.header.authorization
        const f1 = await TokenBlackListService.addToken2BlackList(token!)
        const f2 = await TokenBlackListService.deleteExpiredToken()
            ; (f1 && f2) && ((ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: WRITE_SUCCESS_MSG,
                data: null
            })
            ; !(f1 && f2) && ((ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: WRITE_FAIL_MSG,
                data: null
            })
    }
}

export default new UserController