import { Context } from "koa"

class IndexController {
    async index(ctx: Context) {
        console.log(111);

        ctx.body = [1, 2, 3, 4, 5, 6, 7, 8]
    }
}

export default new IndexController