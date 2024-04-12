import {loginParams} from "@/apis/standard/auth.ts";
import {request} from "@/utils/request.ts";
import {MyUrl} from "@/apis/url/myUrl.ts";


export const loginApi = async (data: loginParams) => {
    const api = MyUrl.user.login;
    return request({
        url: api.url,
        method: api.method,
        params: data
    });
}

export const logout = async () => {
    const api = MyUrl.user.logout;
    return request({
        url: api.url,
        method: api.method
    });
}