import {loginParams} from "@/apis/standard/auth.ts";
import {request} from "@/utils/request.ts";
import {MyUrl} from "@/apis/url/myUrl.ts";
import {SUCCESS_CODE} from "@/constants";
import userUtils from "@/utils/userUtils.ts";


export const loginApi = async (data: loginParams) => {
    const api = MyUrl.user.login;
    const response = await request({
        url: api.url,
        method: api.method,
        params: data
    });
    // 如果登录成功，将用户信息保存到本地
    if (response.code === SUCCESS_CODE && response.data !== null) {
        response.data.lastLoginTime = new Date().getTime()
        userUtils.saveUserInfo(response.data)
    } else {
        alert(response.msg)
    }

    return response
}

export const logout = async () => {
    const api = MyUrl.user.logout;
    return request({
        url: api.url,
        method: api.method
    });
}