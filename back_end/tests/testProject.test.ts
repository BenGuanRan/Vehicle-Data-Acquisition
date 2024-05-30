import {SEARCH_SUCCESS_MSG} from "../app/constants";
import request, {Agent} from "supertest";
import run from "../app";
import BE_CONFIG from "../app/config/be_config";
import OT_CONFIG from "../app/config/ot_config";
import {Server} from "http";

describe('测试项目接口', () => {
    ////项目管理接口
    // router.get('/getProjectList', ProjectController.getProjects)
    // router.post('/createProject', ProjectController.createProject)
    // router.get('/getProjectById/:id', ProjectController.getProjectById)
    // router.post('/updateProject/:id', ProjectController.updateProject)
    // router.post('/deleteProject/:id', ProjectController.deleteProject)

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

    //获取所有项目
    it('GET:/getProjectList', async () => {
        const {status, body: {msg}} = await tokenRequest.get('/getProjectList')
        expect(status).toBe(200)
        expect(msg).toBe(SEARCH_SUCCESS_MSG)
    })

    //创建项目
    it('POST:/createProject', async () => {
        const {status, body: {msg}} = await tokenRequest.post('/createProject').send({
            projectName: 'project_01'
        })
        expect(status).toBe(200)
        expect(msg).toBe(SEARCH_SUCCESS_MSG)
    })

    //根据Id获取项目
    it('GET:/getProjectById/:id', async () => {
        const {status, body: {msg}} = await tokenRequest.get('/getProjectById/1')
        expect(status).toBe(200)
        expect(msg).toBe(SEARCH_SUCCESS_MSG)
    })

    //更新项目
    it('POST:/updateProject/:id', async () => {
        const {status, body: {msg}} = await tokenRequest.post('/updateProject/1').send({
            projectName: 'project_02'
        })
        expect(status).toBe(200)
        expect(msg).toBe(SEARCH_SUCCESS_MSG)
    })

    //删除项目
    it('POST:/deleteProject/:id', async () => {
        const {status, body: {msg}} = await tokenRequest.post('/deleteProject/1')
        expect(status).toBe(200)
        expect(msg).toBe(SEARCH_SUCCESS_MSG)
    })

    //每个结束之后都要打印一遍getProjectList
    afterEach(async () => {
        const {body: {data}} = await tokenRequest.get('/getProjectList')
        console.log(data)
    })
})