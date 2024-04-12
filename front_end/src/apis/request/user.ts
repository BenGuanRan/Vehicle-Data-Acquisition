import {MyUrl} from "@/apis/url/myUrl.ts";
import {request} from "@/utils/request.ts";

export const getUserList = async () => {
    const api = MyUrl.user.getUserList;
    return request({
        url: api.url,
        method: api.method
    });
}

interface createProps {
    childrenUsername: string,
    childPassword: string
}

//创建子用户
export const createUser = async (data: createProps) => {
    const api = MyUrl.user.createUser;
    return request({
        url: api.url,
        method: api.method,
        params: data
    });
}

//关闭子用户服务
export const closeUser = async (childrenUserId: string) => {
    const api = MyUrl.user.closeUser;
    return request({
        url: api.url,
        method: api.method,
        params: childrenUserId
    });
}

export const openUser = async (childrenUserId: string) => {
    const api = MyUrl.user.openUser;
    return request({
        url: api.url,
        method: api.method,
        params: childrenUserId
    })
}

//删除用户
export const deleteUser = async (childrenUserId: string) => {
    const api = MyUrl.user.deleteUser;
    return request({
        url: api.url,
        method: api.method,
        params: childrenUserId
    });
}

interface changePassProps {
    childUseId?: number
    password: string
}

export const changePassword = async (data: changePassProps) => {
    const api = MyUrl.user.changePassword
    return request({
        url: api.url,
        method: api.method,
        params: data
    })
}