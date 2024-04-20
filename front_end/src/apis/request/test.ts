import {request} from "@/utils/request.ts";
import {MyUrl} from "@/apis/url/myUrl.ts";
import {ITestProcess} from "@/apis/standard/test.ts";

const defaultPageSize: number = 7

//获取测试列表
const getTestList = async (pageNum: number, pageSize?: number, keywords?: string) => {
    const api = MyUrl.TEST.getTestProcessList

    const requestData = {
        pageNum: pageNum,
        pageSize: pageSize ?? defaultPageSize,
        keywords: keywords ?? ""
    }

    return request({
        api: api,
        params: requestData
    });
}


/// TODO createTest  by   Post

//创建测试
const createTest = (icreateTestProcess: ITestProcess) => {
    const api = MyUrl.TEST.createTestProcess
    return request({
        api: api,
        params: icreateTestProcess,
    })
}

//获取测试详情
const fetchTestDetail = async (id: string) => {
    const api = MyUrl.TEST.getTestProcessDetails
    const res = {"testProcessId": Number(id)}
    return request({
        api: api,
        params: res,
    });
}

//删除测试
const deleteTest = async (id: string) => {
    const api = MyUrl.TEST.deleteTestProcess
    const res = {"testProcessId": Number(id)}
    return request({
        api: api,
        params: res,
    });
}

//编辑测试
const editTest = async (data: ITestProcess) => {
    const api = MyUrl.TEST.editTestProcess
    return request({
        api: api,
        params: data,
    });
}


export {
    createTest,
    fetchTestDetail,
    deleteTest,
    editTest,
    getTestList
}