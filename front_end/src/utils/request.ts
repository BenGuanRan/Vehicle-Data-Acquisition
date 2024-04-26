import axios, { Axios, AxiosResponse } from 'axios';
import { BASE_URL } from "@/apis/url/myUrl.ts";
import userUtils from "@/utils/userUtils.ts";


//规则
//1.默认x-www-form-urlencoded,如果不传递format，就是默认的
//2.根据method判断放到data还是params
//3.根据format判断Content-Type

export const request = ({ url, method, params, format, responseType }: {
    url: string;
    method: string;
    params?: any,
    format?: ContentType
    responseType?: 'arraybuffer' | 'json' | 'blob' | 'document' | 'text'
}) => {
    if (!format) format = ContentType.FORM;
    if (params && format !== ContentType.JSON && method !== 'GET') {
        let paramsStr = '';
        for (const key in params) {
            paramsStr += `${key}=${params[key]}&`;
        }
        params = paramsStr.slice(0, -1);
    }

    console.log("正在通过", method + "方法", "向", url, "发送请求，请求参数为", JSON.stringify(params), "格式为", format)

    return axios({
        baseURL: BASE_URL,
        headers: {
            'authorization': userUtils.getToken(),
            'Content-Type': format,
        },
        url: url,
        method: method,
        [shouldUseData(method) ? 'data' : 'params']: params,
        responseType: responseType || 'json'
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

export enum ContentType {
    JSON = 'application/json',
    FORM = 'application/x-www-form-urlencoded',
    FILE = 'application/octet-stream'
}