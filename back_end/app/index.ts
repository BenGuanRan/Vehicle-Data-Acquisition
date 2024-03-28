import Koa from 'koa'
import router from './router'
import { Server } from 'http'

const app = new Koa

app.use(router.routes())

const run = (port: number): Server => {
    return app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    })
}

export default run