import Koa from 'koa'
import router from './router'
import { Server } from 'http'
import DB from '../app/db'
import koaBodyParser from 'koa-bodyparser'


const app = new Koa

app.use(koaBodyParser())
app.use(router.routes())

const run = async (port: string): Promise<Server> => {
    await DB.connectDB()
    await DB.initDB()
    return app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    })
}

export default run