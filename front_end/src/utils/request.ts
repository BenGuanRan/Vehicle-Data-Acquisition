import axios from 'axios';
import tokenUtils from "@/utils/tokenUtils.ts";
import {BASE_URL} from "@/apis/url/myUrl.ts";

export const request = ({url, method, params}: { url: string; method: string; params?: any }) => {
    //正在通过method向url发送请求，请求参数为params

    if (params) {
        let paramsStr = '';
        for (const key in params) {
            paramsStr += `${key}=${params[key]}&`;
        }
        params = paramsStr.slice(0, -1);
    }
    console.log("正在通过", method + "方法", "向", url, "发送请求，请求参数为", params)

    return axios({
        baseURL: BASE_URL,
        headers: {
            'authorization': tokenUtils.getToken(),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: url,
        method: method,
        [shouldUseData(method) ? 'data' : 'params']: params
    }).then(response => {
        console.log(method, "     response.data", response.data)
        return response.data;
    }).catch(error => {
        console.error('There was an error with the request:', error);
    });
};

function shouldUseData(method: string) {
    return method === 'PUT' || method === 'POST' || method === 'DELETE' || method === 'PATCH';
}

