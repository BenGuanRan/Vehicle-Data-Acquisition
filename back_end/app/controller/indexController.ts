import { Context } from "koa"

class IndexController {
    async index(ctx: Context) {
        ctx.body = [1, 2, 3, 4, 5, 6, 7, 8]
    }
}

export default new IndexController