import Koa from 'koa'
import router from './router'
import { Server } from 'http'
import DB from '../app/db'

DB.connectDB()
DB.initDB()
const app = new Koa

app.use(router.routes())

const run = (port: string): Server => {
    return app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    })
}

export default run