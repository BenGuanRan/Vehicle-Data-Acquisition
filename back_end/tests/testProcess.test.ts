import run from '../app'
import request, { Agent } from 'supertest'
import BE_CONFIG from '../app/config/be_config'
import OT_CONFIG from '../app/config/ot_config'
import { Server } from 'http'
import DB_OPT from '../app/db'
import { WRITE_SUCCESS_MSG } from '../app/constants'

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

    // 开启子用户权限
    it('POST:/createTestProcess', async () => {
        const { status, body: { msg } } = await tokenRequest.post('/openUser').send({
            testProcessName: 'test_process_01',
            testContents: [
                {
                    testObjectName: 'test_object_01',
                    collectItems: [
                        {
                            collectorSignalName: 'signal_name_01',
                            controllerId: 0,
                            collectorId: 0,
                            signal: 'signal_01'
                        }
                    ]
                }
            ]
        })
        expect(status).toBe(200)
        expect(msg).toBe(WRITE_SUCCESS_MSG)
    })
    afterAll(async () => {
        await DB_OPT.closeConnection()
        backendServer.close()
    })
})