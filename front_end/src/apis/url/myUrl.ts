import { USER } from "@/apis/url/user.ts";
import { TEST } from "@/apis/url/test.ts";

interface Url {
    url: string;
    method: string;
}

export const BASE_URL = 'http://localhost:3000/api';

export interface UrlMap {
    [key: string]: Url;
}

export const MyUrl = {
    USER,
    TEST,
}
