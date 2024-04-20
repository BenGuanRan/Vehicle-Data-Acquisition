export interface APIStandard {
    url: string
    method: Method
    format?: ContentType
    params?: any
}

export enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export enum ContentType {
    JSON = 'application/json',
    WWW_FORM = 'application/x-www-form-urlencoded',
    FORM_DATA = 'form-data'
}
