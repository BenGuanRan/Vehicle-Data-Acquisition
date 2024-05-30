import {SEARCH_SUCCESS_MSG, WRITE_SUCCESS_MSG} from "../app/constants";
import run from "../app";
import BE_CONFIG from "../app/config/be_config";
import request, {Agent} from "supertest";
import OT_CONFIG from "../app/config/ot_config";
import {Server} from "http";

describe('测试车辆接口', () => {
    ////车辆管理接口
    // router.get('/getVehicleList', VehicleController.getVehicles)
    // router.post('/createVehicle', VehicleController.createVehicle)
    // router.get('/getVehicleById/:id', VehicleController.getVehicleById)
    // router.post('/updateVehicle/:id', VehicleController.updateVehicle)
    // router.post('/deleteVehicle/:id', VehicleController.deleteVehicle)

    let backendServer: Server
    let tokenRequest: Agent

    beforeAll(async () => {
        backendServer = await run(BE_CONFIG.BE_PORT!)
        // 登录root账户
        const {body: {data: {token}}} = await request(backendServer).post('/login').send({
            username: OT_CONFIG.TEST_ROOT_USERNAME,
            password: OT_CONFIG.TEST_ROOT_PASSWORD
        })
        tokenRequest = request.agent(backendServer).set('Authorization', token)
    })

    //获取所有车辆
    it('GET:/getVehicleList', async () => {
        const {status, body: {msg}} = await tokenRequest.get('/getVehicleList')
        expect(status).toBe(200)
        expect(msg).toBe(SEARCH_SUCCESS_MSG)
    })

    //创建车辆
    it('POST:/createVehicle', async () => {
        const {status, body: {msg}} = await tokenRequest.post('/createVehicle').send({
            vehicleName: 'vehicle_01'
        })
        expect(status).toBe(200)
        expect(msg).toBe(SEARCH_SUCCESS_MSG)
    })

    //根据Id获取车辆
    it('GET:/getVehicleById/:id', async () => {
        const {status, body: {msg}} = await tokenRequest.get('/getVehicleById/1')
        expect(status).toBe(200)
        expect(msg).toBe(SEARCH_SUCCESS_MSG)
    })

    //更新车辆
    it('POST:/updateVehicle/:id', async () => {
        const {status, body: {msg}} = await tokenRequest.post('/updateVehicle/1').send({
            vehicleName: 'vehicle_02'
        })
        expect(status).toBe(200)
        expect(msg).toBe(SEARCH_SUCCESS_MSG)
    })

    //删除车辆
    it('POST:/deleteVehicle/:id', async () => {
        const {status, body: {msg}} = await tokenRequest.post('/deleteVehicle/1')
        expect(status).toBe(200)
        expect(msg).toBe(SEARCH_SUCCESS_MSG)
    })

    //每个结束之后都要打印一遍getVehicleList
    afterEach(async () => {
        const {status, body: {msg,data}} = await tokenRequest.get('/getVehicleList')
        console.log(data)
        expect(status).toBe(200)
    })
})