import {MyUrl} from "@/apis/url/myUrl.ts";
import { request} from "@/utils/request.ts";

const defaultPageSize = 7;

interface listParams {
    pageSize: number
    pageNum: number
    keywords?: string
}

export const getUserList = async (pageNum: number, pageSize?: number, keywords?: string) => {
    const api = MyUrl.USER.getUserList;

    const requestData: listParams = {
        pageNum: pageNum,
        pageSize: pageSize ?? defaultPageSize,
        keywords: keywords ?? "test"
    }

    return request({
        api: api,
        params: requestData
    });
}

interface createProps {
    childUsername: string,
    childPassword: string
}

//创建子用户
export const createUser = async (data: createProps) => {
    const api = MyUrl.USER.createUser;
    console.log(data)
    return request({
        api: api,
        params: data
    });
}


interface ocdUserProps {
    childUserId: number
}

//关闭子用户服务
export const closeUser = async (data: ocdUserProps) => {
    const api = MyUrl.USER.closeUser;
    return request({
        api: api,
        params: data
    });
}


//开启子用户服务
export const openUser = async (data: ocdUserProps) => {
    const api = MyUrl.USER.openUser;
    console.log(data)
    return request({
        api: api,
        params: data
    })
}

//删除用户
export const deleteUser = async (data: ocdUserProps) => {
    const api = MyUrl.USER.deleteUser;
    return request({
        api: api,
        params: data
    });
}

export interface changePassProps {
    childUserId?: number
    password: string
}

export const changePassword = async (data: changePassProps) => {
    const api = MyUrl.USER.changePassword
    return request({
        api: api,
        params: data
    })
}