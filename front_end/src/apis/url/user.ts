import {UrlMap} from "@/apis/url/myUrl.ts";


export const USER: UrlMap = {
    login: {
        url: '/login',
        method: 'POST'
    },
    getUserList: {
        url: '/getUserList',
        method: 'GET'
    },
    createUser: {
        url: '/createUser',
        method: 'POST'
    },
    closeUser: {
        url: '/closeUser',
        method: 'POST'
    },
    openUser: {
        url: '/openUser',
        method: 'POST'
    },
    deleteUser: {
        url: '/deleteUser',
        method: 'POST'
    },
    changePassword: {
        url: '/changePassword',
        method: 'POST'
    }
}
