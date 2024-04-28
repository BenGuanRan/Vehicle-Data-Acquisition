import {USER} from "@/apis/url/user.ts";
import {TEST} from "@/apis/url/test.ts";
import {APIStandard} from "@/apis/standard/all.ts";

export const BASE_URL = 'http://localhost:3000/api';

export interface UrlMap {
    [key: string]: APIStandard;
}

export const MyUrl = {
    USER,
    TEST,
}
