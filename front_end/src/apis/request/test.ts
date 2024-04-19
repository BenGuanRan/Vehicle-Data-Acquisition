import {ContentType, request} from "@/utils/request.ts";
import {MyUrl} from "@/apis/url/myUrl.ts";
import {ITestProcess} from "@/apis/standard/test.ts";


/// TODO createTest  by   Post

//创建测试
const createTest = (icreateTestProcess: ITestProcess) => {
    const api = MyUrl.TEST.createTestProcess
    return request({
        url: api.url,
        method: api.method,
        params: icreateTestProcess,
        format: ContentType.JSON
    })
}

//获取测试详情
const fetchTestDetail = async (id: string) => {
    const api = MyUrl.TEST.getTestProcessDetails
    const res = {"testProcessId": Number(id)}
    return request({
        url: api.url,
        method: api.method,
        params: res,
    });
}

//删除测试
const deleteTest = async (id: string) => {
    const api = MyUrl.TEST.deleteTestProcess
    const res = {"testProcessId": Number(id)}
    return request({
        url: api.url,
        method: api.method,
        params: res,
    });
}

//编辑测试
const editTest = async (data: ITestProcess) => {
    const api = MyUrl.TEST.editTestProcess
    return request({
        url: api.url,
        method: api.method,
        params: data,
        format: ContentType.JSON
    });
}

//获取测试列表
const getTestList = async () => {
    const api = MyUrl.TEST.getTestProcessList
    return request({
        url: api.url,
        method: api.method
    });
}

export {
    createTest,
    fetchTestDetail,
    deleteTest,
    editTest,
    getTestList
}