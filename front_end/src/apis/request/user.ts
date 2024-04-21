import {MyUrl} from "@/apis/url/myUrl.ts";
import {request} from "@/utils/request.ts";

export const getUserList = async () => {
    const api = MyUrl.USER.getUserList;
    return request({
        url: api.url,
        method: api.method
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
        url: api.url,
        method: api.method,
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
        url: api.url,
        method: api.method,
        params: data
    });
}


//开启子用户服务
export const openUser = async (data: ocdUserProps) => {
    const api = MyUrl.USER.openUser;
    console.log(data)
    return request({
        url: api.url,
        method: api.method,
        params: data
    })
}

//删除用户
export const deleteUser = async (data: ocdUserProps) => {
    const api = MyUrl.USER.deleteUser;
    return request({
        url: api.url,
        method: api.method,
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
        url: api.url,
        method: api.method,
        params: data
    })
}