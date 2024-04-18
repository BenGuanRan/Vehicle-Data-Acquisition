//POST: /createTestProcess
import {UrlMap} from "@/apis/url/myUrl.ts";

export const TEST: UrlMap = {
    createTestProcess: {
        url: '/createTestProcess',
        method: 'POST'
    },
    getTestProcessDetails: {
        url: '/getTestProcessDetails',
        method: 'GET'
    },
}