import {USER} from "@/apis/url/user.ts";

interface Url {
    url: string;
    method: string;
}

export interface UrlMap {
    [key: string]: Url;
}

export const MyUrl = {
    user: USER,
}