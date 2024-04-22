//POST: /createTestProcess
import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

export const TEST: UrlMap = {
    createTestProcess: {
        url: '/createTestProcess',
        method: Method.POST,
        format: ContentType.JSON
    },
    getTestProcessDetails: {
        url: '/getTestProcessDetails',
        method: Method.GET
    },
    editTestProcess: {
        url: '/editTestProcess',
        method: Method.POST,
        format: ContentType.JSON
    },
    deleteTestProcess: {
        url: '/deleteTestProcess',
        method: Method.POST,
        format: ContentType.WWW_FORM
    },
    getTestProcessList: {
        url: '/getTestProcessList',
        method: Method.GET
    },
    getControllList: {
        url: '/getControllerList',
        method: Method.GET
    },
    getCollectorList: {
        url: '/getCollectorList',
        method: Method.GET
    },
    getSignalListByCollectorId: {
        url: '/getSignalListByCollectorId',
        method: Method.GET
    },
}