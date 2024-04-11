import KoaRouter from 'koa-router'
import indexController from '../controller/indexController'
import UserController from '../controller/UserController'
import AuthMiddleware from '../middleware/AuthMiddleware'
import RequestBodyVerifyMiddleware from '../middleware/RequestBodyVerifyMiddleware'

const router = new KoaRouter({
    prefix: ''
})
router.use(RequestBodyVerifyMiddleware)
router.post('/login', UserController.login)
router.use(AuthMiddleware)
router.get('/', indexController.index)
router.get('/getUserList', UserController.getUserList)
router.post('/createUser', UserController.createUser)
router.post('/closeUser', UserController.closeUser)
router.post('/openUser', UserController.openUser)
router.post('/deleteUser', UserController.deleteUser)
router.post('/changePassword', UserController.changePassword)

export default router