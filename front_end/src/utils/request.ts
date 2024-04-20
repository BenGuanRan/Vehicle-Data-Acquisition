import axios, {AxiosRequestConfig} from 'axios';
import {BASE_URL} from "@/apis/url/myUrl.ts";
import userUtils from "@/utils/userUtils.ts";
import {APIStandard, ContentType} from "@/apis/standard/all.ts";

//规则
//1.默认x-www-form-urlencoded,如果不传递format，就是默认的
//2.根据method判断放到data还是params
//3.根据format判断Content-Type


export const request = ({api, params}: {
    api: APIStandard,
    params?: any,
}) => {
    const url = api.url
    const method = api.method
    const format = api.format


    const axiosConfig = getAxiosConfig(url, method, params, format || ContentType.WWW_FORM)
    console.log("正在通过", method + "方法\n", "向", url, "发送请求\n，请求参数为", JSON.stringify(params), "\n格式为", format)

    return axios(axiosConfig).then(response => {
        console.log(method, "     response.data", response.data)
        return response.data;
    }).catch(error => {
        console.error('There was an error with the request:', error);
    });
};

const getAxiosConfig = (url: string, method: string, params: any, format: ContentType): AxiosRequestConfig => {
    return {
        baseURL: BASE_URL,
        headers: {
            'authorization': userUtils.getToken(),
            'Content-Type': format
        },
        url: url,
        method: method,
        [shouldUseData(method) ? 'data' : 'params']: method === 'GET' ? params : getFormatData(format, params)
    }
}


function getFormatData(format: ContentType, params: any) {
    switch (format) {
        case ContentType.JSON:
            return JSON.stringify(params)
        case ContentType.FORM_DATA: {
            const formData = new FormData()
            console.log(params)

            for (const key in params) {
                console.log(key)
                formData.append(key, params[key])
            }
            return formData
        }
        case ContentType.WWW_FORM: {
            let paramsStr = '';
            for (const key in params) {
                paramsStr += `${key}=${params[key]}&`;
            }
            return paramsStr.slice(0, -1);
        }
        default:
            return params
    }
}

function shouldUseData(method: string) {
    return method === 'PUT' || method === 'POST' || method === 'DELETE' || method === 'PATCH';
}
