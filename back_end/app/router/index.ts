import KoaRouter from 'koa-router'
import indexController from '../controller/indexController'

const router = new KoaRouter({
    prefix: '/'
})

router.get('/', indexController.index)

export default router