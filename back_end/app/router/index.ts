import KoaRouter from 'koa-router'
import indexController from '../controller/indexController'
import UserController from '../controller/UserController'
import AuthMiddleware from '../middleware/AuthMiddleware'
import RequestBodyVerifyMiddleware from '../middleware/RequestBodyVerifyMiddleware'
import TestProcessController from '../controller/TestProcessController'
import BaseInfoController from '../controller/BaseInfoController'

const router = new KoaRouter({
    prefix: ''
})
router.use(RequestBodyVerifyMiddleware)

// 用户权限相关接口
router.post('/login', UserController.login)
router.use(AuthMiddleware)
router.get('/', indexController.index)
router.get('/getUserList', UserController.getUserList)
router.post('/createUser', UserController.createUser)
router.post('/closeUser', UserController.closeUser)
router.post('/openUser', UserController.openUser)
router.post('/deleteUser', UserController.deleteUser)
router.post('/changePassword', UserController.changePassword)
router.post('/logout', UserController.logout)

// 测试流程相关接口
router.post('/createTestProcess', TestProcessController.createTestProcess)
router.get('/getTestProcessDetails', TestProcessController.getTestProcessDetails)
router.post('/editTestProcess', TestProcessController.editTestProcess)
router.get('/getTestProcessList', TestProcessController.getTestProcessList)
router.post('/deleteTestProcess', TestProcessController.deleteTestProcess)

// 基本信息获取接口
router.get('/getControllerList', BaseInfoController.getControllerList)
router.get('/getCollectorList', BaseInfoController.getCollectorList)
router.get('/getSignalListByCollectorId', BaseInfoController.getSignalListByCollectorId)

export default router