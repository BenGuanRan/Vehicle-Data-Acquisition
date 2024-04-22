import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";


export const USER: UrlMap = {
    login: {
        url: '/login',
        method: Method.POST,
        format: ContentType.WWW_FORM
    },
    logout: {
        url: '/logout',
        method: Method.POST,
        format: ContentType.WWW_FORM
    },
    getUserList: {
        url: '/getUserList',
        method: Method.GET,
        format: ContentType.WWW_FORM
    },
    createUser: {
        url: '/createUser',
        method: Method.POST,
        format: ContentType.WWW_FORM
    },
    closeUser: {
        url: '/closeUser',
        method: Method.POST,
        format: ContentType.WWW_FORM
    },
    openUser: {
        url: '/openUser',
        method: Method.POST,
        format: ContentType.WWW_FORM
    },
    deleteUser: {
        url: '/deleteUser',
        method: Method.POST,
        format: ContentType.WWW_FORM
    },
    changePassword: {
        url: '/changePassword',
        method: Method.POST,
        format: ContentType.WWW_FORM
    }
}
