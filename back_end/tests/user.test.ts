import run from '../app'
import request, { Agent } from 'supertest'
import BE_CONFIG from '../app/config/be_config'
import OT_CONFIG from '../app/config/ot_config'
import { Server } from 'http'
import DB_OPT from '../app/db'
import { TOKEN_USER_HAS_BEEN_DISABLED_CODE, TOKEN_USER_LOGOUT, WRITE_SUCCESS_MSG } from '../app/constants'

describe('测试用户接口', () => {
    let backendServer: Server
    let tokenRequest: Agent
    beforeAll(async () => {
        backendServer = await run(BE_CONFIG.BE_PORT!)
        // 登录root账户
        const { body: { data: { token } } } = await request(backendServer).post('/login').send({
            username: OT_CONFIG.TEST_ROOT_USERNAME,
            password: OT_CONFIG.TEST_ROOT_PASSWORD
        })
        tokenRequest = request.agent(backendServer).set('Authorization', token)


    })

    // 创建用户
    it('POST:/createUser', async () => {
        const { status, body: { data } } = await tokenRequest.post('/createUser').send({
            childUsername: 'user01',
            childPassword: '000000'
        })
        expect(status).toBe(200)
        expect(data.username).toBe(`${OT_CONFIG.TEST_ROOT_USERNAME}_user01`)
    })

    // 获取用户列表
    it('GET:/getUserList', async () => {
        const { status, body: { data } } = await tokenRequest.get('/getUserList')
        expect(status).toBe(200)
        expect(data).toHaveLength(1)
    })

    // 关闭子用户服务
    it('POST:/closeUser', async () => {
        const { status, body: { msg } } = await tokenRequest.post('/closeUser').send({
            childUserId: '3'
        })
        expect(status).toBe(200)
        expect(msg).toBe(WRITE_SUCCESS_MSG)
    })

    // 子用户登录
    it('POST:/login', async () => {
        // 登录root账户
        const { body: { data: { token } } } = await request(backendServer).post('/login').send({
            username: `${OT_CONFIG.TEST_ROOT_USERNAME}_user01`,
            password: '000000'
        })
        expect(token).toBeDefined
        tokenRequest = request.agent(backendServer).set('Authorization', token)
    })

    // 测试子用户操作权限
    it('GET:/', async () => {
        const { status, body: { code } } = await tokenRequest.get('/')
        expect(status).toBe(200)
        expect(code).toBe(TOKEN_USER_HAS_BEEN_DISABLED_CODE)
    })

    // 管理员登录
    it('POST:/login', async () => {
        // 登录root账户
        const { body: { data: { token } } } = await request(backendServer).post('/login').send({
            username: OT_CONFIG.TEST_ROOT_USERNAME,
            password: OT_CONFIG.TEST_ROOT_PASSWORD
        })
        expect(token).toBeDefined
        tokenRequest = request.agent(backendServer).set('Authorization', token)
    })

    // 开启子用户权限
    it('POST:/openUser', async () => {
        const { status, body: { msg } } = await tokenRequest.post('/openUser').send({
            childUserId: '3'
        })
        expect(status).toBe(200)
        expect(msg).toBe(WRITE_SUCCESS_MSG)
    })

    // 管理员退出登录
    it('POST:/logout', async () => {
        const { status, body: { msg } } = await tokenRequest.post('/logout')
        expect(status).toBe(200)
        expect(msg).toBe(WRITE_SUCCESS_MSG)
    })

    // 管理员token加入黑名单
    it('GET:/', async () => {
        const { status, body: { code } } = await tokenRequest.get('/')
        expect(status).toBe(200)
        expect(code).toBe(TOKEN_USER_LOGOUT)
    })

    afterAll(async () => {
        await DB_OPT.closeConnection()
        backendServer.close()
    })
})