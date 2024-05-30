import KoaRouter from 'koa-router'
import indexController from '../controller/indexController'
import UserController from '../controller/UserController'
import AuthMiddleware from '../middleware/AuthMiddleware'
import RequestBodyVerifyMiddleware from '../middleware/RequestBodyVerifyMiddleware'
import TestProcessController from '../controller/TestProcessController'
import BaseInfoController from '../controller/BaseInfoController'
import AssetsController from '../controller/AssetsController'
import VehicleController from "../controller/VehicleController";
import ProjectController from "../controller/ProjectController";

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
router.get('/getTestProcessConfig', TestProcessController.getTestProcessConfig)
router.post('/syncPreTestConfig', TestProcessController.syncPreTestConfig)
router.post('/sendTestConfig', TestProcessController.sendTestConfig)
router.get('/getSendedTestConfig', TestProcessController.getSendedTestConfig)
router.get('/getUserTestDashbordConfig', TestProcessController.getUserTestDashbordConfig)
router.post('/copyTestProcess', TestProcessController.copyTestProcess)

// 基本信息获取接口
router.get('/getControllerList', BaseInfoController.getControllerList)
router.get('/getCollectorList', BaseInfoController.getCollectorList)
router.get('/getSignalListByCollectorId', BaseInfoController.getSignalListByCollectorId)
router.get('/getTestDevicesInfo', BaseInfoController.getTestDevicesInfo)

//车辆管理接口
router.get('/getVehicleList', VehicleController.getVehicles)
router.post('/createVehicle', VehicleController.createVehicle)
router.get('/getVehicleById/:id', VehicleController.getVehicleById)
router.post('/updateVehicle/:id', VehicleController.updateVehicle)
router.post('/deleteVehicle/:id', VehicleController.deleteVehicle)

//Project管理接口
router.get('/getProjectList', ProjectController.getProjectList)
router.post('/createProject', ProjectController.createProject)
router.post('/updateProject/:id', ProjectController.updateProject)
router.get('/getProjectById/:id', ProjectController.getProjectById)
router.post('/deleteProject/:id', ProjectController.deleteProject)

// 资源下载接口
router.get('/downloadPreTestConfigFile', AssetsController.downloadPreTestConfigFile)
router.get('/downloadPreTestConfigFileTemp', AssetsController.downloadPreTestConfigFileTemp)
router.get('/downloadTestProcessConfigFileById', AssetsController.downloadTestProcessConfigFileById)
router.get('/downloadUserSendedTestProcessConfig', AssetsController.downloadUserSendedTestProcessConfig)

export default router