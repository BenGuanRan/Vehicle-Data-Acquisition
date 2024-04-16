import {request} from "@/utils/request.ts";
import {MyUrl} from "@/apis/url/myUrl.ts";

interface getListParams {
    page?: number;
    limit?: number;
}

//获取测试列表
const getTestList = async (params: getListParams) => {
    return request({
        url: 'api/test',
        method: 'GET',
        params: params
    });
}


//查看详情
const getTestDetail = async (id: string) => {
    console.log(id)
    return request({
        url: `api/test/detail`,
        method: 'GET'
    });
}

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


export {
    getTestList,
    getTestDetail,
    deleteTest,
    createTest,
}
