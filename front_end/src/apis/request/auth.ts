import {loginParams} from "@/apis/standard/auth.ts";
import {request} from "@/utils/request.ts";
import {MyUrl} from "@/apis/url/myUrl.ts";
import {SUCCESS_CODE} from "@/constants";
import userUtils from "@/utils/UserUtils.ts";


export const loginApi = async (data: loginParams) => {
    const api = MyUrl.USER.login;
    const response = await request({
        api: api,
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
    const api = MyUrl.USER.logout;
    return request({
        api: api
    });
}