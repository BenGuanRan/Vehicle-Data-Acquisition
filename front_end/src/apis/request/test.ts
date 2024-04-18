import {request} from "@/utils/request.ts";
import {MyUrl} from "@/apis/url/myUrl.ts";


//删除测试
const deleteTest = async (id: string) => {
    return request({
        url: `/test/delete/${id}`,
        method: 'DELETE'
    });
}

/// TODO createTest  by   Post
export interface ICreateTestProcess {
    testProcessName: string
    testContents: {
        testObjectName: string
        collectItems: {
            collectorSignalName: string
            controllerId: number
            collectorId: number
            signal: string
        }[]
    }[]
}

export interface ICreateTestObject {
    testObjectName: string
    collectItems: {
        collectorSignalName: string
        controllerId: number
        collectorId: number
        signal: string
    }[]
}


/// finish
const createTest = (icreateTestProcess: ICreateTestProcess) => {
    const api = MyUrl.TEST.createTestProcess
    return request({
        url: api.url,
        method: api.method,
        params: icreateTestProcess
    })
}

export interface ITestProcess {
    testProcessId?: number
    testName: string
    testObjects: {
        objectId?: number
        objectName: string
        collectorSignals: {
            collectorSignalId?: number
            collectorSignalName: string
            controllerId: number
            collectorId: number
            signal: string
        }[]
    }[]
}

const getTestDetail = async (id: string):Promise<ITestProcess> => {
    const api = MyUrl.TEST.getTestProcessDetails
    return request({
        url: api.url,
        method: api.method,
        params: id
    });
}

export {
    getTestDetail,
    deleteTest,
    createTest,
}
