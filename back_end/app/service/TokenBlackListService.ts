import TokenBlackListItem from "../model/TokenBlackListItem.model"
import OT_CONFIG from '../config/ot_config'
import Sequelize from "sequelize"

class TokenBlackListService {
    // 将当前用户token添加到黑名单中，并携带时间戳
    async addToken2BlackList(token: string): Promise<boolean> {
        try {
            await TokenBlackListItem.create({
                token,
                timestamp: Date.now()
            })
            return true
        } catch (error) {
            return false
        }
    }
    // 删除过期的token
    async deleteExpiredToken(expireTime: number = OT_CONFIG.TOKEN_EXPIRE): Promise<boolean> {
        try {
            await TokenBlackListItem.destroy({
                where: {
                    timestamp: {
                        [Sequelize.Op.lt]: Date.now() - expireTime
                    }
                }
            })
            return true
        } catch (error) {
            return false
        }
    }
    // 查找token是否在黑名单中
    async checkIfTokenInBlackList(token: string): Promise<boolean> {
        try {
            const tbli = await TokenBlackListItem.findOne({
                where: {
                    token
                }
            })
            return tbli ? true : false
        } catch (error) {
            console.error(error);
            return false
        }
    }
}
export default new TokenBlackListService