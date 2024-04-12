import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const request = ({url, method, params}: { url: string; method: string; params?: any }) => {
    return axios({
        baseURL: 'http://localhost:88',
        headers: {},
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

