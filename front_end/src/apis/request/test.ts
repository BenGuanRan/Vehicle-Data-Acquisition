import {request} from "@/utils/request.ts";

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

interface addTestParams {
    title: string;
    equipment_number: string;
    equipment_category: string;
    test_parameter: string;
    status: string;
}

//新增测试
const addTest = async (data: addTestParams) => {
    return request({
        url: '/test',
        method: 'POST',
        params: data
    });
}


//编辑测试
const editTest = async (id: string, data: addTestParams) => {
    return request({
        url: `/test/${id}`,
        method: 'PUT',
        params: data
    });
}

export {
    getTestList,
    getTestDetail,
    deleteTest,
    addTest,
    editTest
}
