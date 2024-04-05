import axios from 'axios';
import {BASE_URL} from "../apis/url";

export const request = ({url, method, params}: { url: string; method: string; params?: any }) => {
    return axios({
        headers: {},
        baseURL: BASE_URL,
        url: url,
        method: method,
        params: method === 'GET' ? params : null,
        data: method === 'POST' ? params : null,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('There was an error with the request:', error);
    });
};

