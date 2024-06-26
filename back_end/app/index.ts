import Koa from 'koa'
import router from './router'
import { Server } from 'http'
import DB from '../app/db'
import koaBodyParser from 'koa-bodyparser'
import fileServer from 'koa-static'
import path from 'node:path'


const app = new Koa

app.use(fileServer(path.join(__dirname, 'assets')))
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