import User from '../model/User.model'
import OT_CONFIG from '../config/ot_config'
import { Context } from 'koa';
import tokenUtils from '../../utils/token';
import { IResBody } from '../types';
import { FAIL_CODE, HORIZONTAL_OVERREACH_IS_PROHIBITED, INSUFFICIENT_AUTHORITY, SEARCH_SUCCESS_MSG, SUCCESS_CODE } from '../constants';


class UserService {
    // 核对账户密码
    async findUserByUsernameAndPassword({ username, password }: { username: string, password: string }) {
        try {
            const user = await User.findOne({
                where: {
                    username,
                    password
                }
            });
            // 如果找到用户，则返回用户对象，否则返回 null
            return user ? user.dataValues : null
        } catch (error) {
            console.error('Error finding user:', error);
            return null
        }
    }

    // 初始化root用戶
    async initRootUser() {
        try {
            await User.bulkCreate([{
                username: OT_CONFIG.ROOT_USERNAME,
                password: OT_CONFIG.ROOT_PASSWORD,
                root_user_id: null
            }, {
                username: OT_CONFIG.TEST_ROOT_USERNAME,
                password: OT_CONFIG.TEST_ROOT_PASSWORD,
                root_user_id: null
            }]);
            console.log('The root_user was successfully initialized. Procedure.');
        } catch (error) {
            console.error('Description Failed to initialize the root_user:', error);
        }
    }

    // 判断当前用户是否处于disabled状态 null代表无此用户
    async checkUserStatusById(id: number): Promise<boolean | null> {
        try {
            const user = await User.findOne({
                attributes: ['disabled'],
                where: {
                    id
                }
            })
            // 如果找到用户，则返回用户对象，否则返回 null
            return user ? user.dataValues.disabled! : null
        } catch (error) {
            console.error(error);
            return null
        }
    }

    // 判断该root用户下的子用户名是否存在
    async checkIfUserExisted(root_user_id: number, username: string): Promise<boolean | null> {
        try {
            const user = await User.findOne({
                where: {
                    root_user_id,
                    username
                }
            })
            // 如果找到用户，则返回用户对象，否则返回 null
            return user ? true : false
        } catch (error) {
            console.error(error);
            return null
        }
    }

    // 判断该子用户是否被root用户所有
    async checkIfUserBelong2RootUser(root_user_id: number, id: number): Promise<boolean> {
        try {
            const user = await User.findOne({
                where: {
                    root_user_id,
                    id
                }
            })
            console.log(user);

            // 如果找到用户，则返回true，否则返回 false
            return user ? true : false
        } catch (error) {
            console.error(error);
            return false
        }
    }
    // 根据id查询指定用户，获取实例
    async getUserById(id: number): Promise<User | null> {
        try {
            const user = await User.findOne({
                where: {
                    id
                }
            })
            return user ? user : null
        } catch (error) {
            console.error(error);
            return null
        }
    }

    // 判断当前用户是否为root用户
    async isRootUser(id: number): Promise<boolean> {
        try {
            const user = await User.findOne({
                attributes: ['root_user_id'],
                where: {
                    id
                }
            })
            return user ? (user.dataValues.root_user_id === null ? true : false) : false
        } catch (error) {
            console.error(error);
            return false
        }
    }

    // 只有Root用户才能执行操作,否则不执行任何操作
    async onlyRootCanDo(ctx: Context, rootFunc: (ctx: Context) => Promise<void>) {
        const token = ctx.header['authorization']
        const userId = tokenUtils.getUserIdByToken(token || '')
        // 验证用户权限是否足够
        if (await this.isRootUser(Number(userId))) {
            // 验证是否水平越权
            // const tokenUserId = tokenUtils.getUserIdByToken(token || '')
            // if (tokenUserId !== Number(userId)) {
            //     (ctx.body as IResBody) = {
            //         code: FAIL_CODE,
            //         msg: HORIZONTAL_OVERREACH_IS_PROHIBITED,
            //         data: null
            //     }
            // } else {
            //     await rootFunc(ctx)
            // }
            await rootFunc(ctx)
        } else {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: INSUFFICIENT_AUTHORITY,
                data: null
            }
        }

    }

    // 修改用户disabled状态
    async changeUserStatus(userId: number, disabled: boolean): Promise<boolean> {
        try {
            const user = await this.getUserById(userId)
            if (user) {
                user.disabled = disabled
                user.save()
                return true
            }
            return false
        } catch (error) {
            console.log(error);
            return false
        }
    }
    // 根据id删除用户
    async deleteUserById(userId: number): Promise<boolean> {
        try {
            await User.destroy({
                where: {
                    id: userId
                }
            })
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    // 创建用户
    async createUser({ username, password, rootUserId: root_user_id }: { username: string, password: string, rootUserId: number }): Promise<{
        username: string
        userId: number
        rootUserId: number
    } | null> {
        try {
            const user = await User.create({
                username,
                password,
                root_user_id
            })
            const { username: ua, id, root_user_id: ru_id } = user.dataValues
            return {
                username: ua,
                userId: id!,
                rootUserId: ru_id!
            }
        } catch (error) {
            console.log(error);
            return null
        }
    }
    // 通过用户id修改密码
    async changePasswordById(id: number, newPassword: string): Promise<{
        targetUserId: number
        password: string
    } | null> {
        try {
            const user = await this.getUserById(id)
            if (user?.password === newPassword) return null
            if (user) {
                user.password = newPassword
                user.save()
                return {
                    targetUserId: id,
                    password: user.password
                }
            }
            return null
        } catch (error) {
            console.log(error);
            return null
        }
    }
}
export default new UserService