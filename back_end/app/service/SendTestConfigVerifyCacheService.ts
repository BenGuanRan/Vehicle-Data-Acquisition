import SendTestConfigVeriftCache, { ISendTestConfigVerifyCacheModel } from "../model/SendTestConfigVerifyCache.model";

class SendTestConfigVerifyCacheService {
    async addACache(data: ISendTestConfigVerifyCacheModel) {
        await SendTestConfigVeriftCache.create({
            ...data
        })
    }
    // 将一条cache置为pass
    async passACache(data: ISendTestConfigVerifyCacheModel) {
        await SendTestConfigVeriftCache.update(
            { checkPass: true }, {
            where: { ...data }
        })
    }
    // 查看当前测试是否通过
    async checkPass(userId: number) {
        const caches = await SendTestConfigVeriftCache.findAll({
            where: { userId }
        })
        if (!caches || caches.length === 0) return false
        return caches.every(({ checkPass }) => checkPass)
    }
    // 清空当前用户的cache
    async clearCache(userId: number) {
        await SendTestConfigVeriftCache.destroy({
            where: { userId }
        })
    }
}

export default new SendTestConfigVerifyCacheService