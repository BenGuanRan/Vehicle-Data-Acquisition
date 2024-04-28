export interface APIStandard {
    url: string
    method: Method
    format?: ContentType
    params?: any,
    responseType?: ResponseType
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
    FORM_DATA = 'form-data',
    FILE = 'application/octet-stream'
}

export enum ResponseType {
    ARRAY_BUFFER = 'arraybuffer',
    JSON = 'json',
    BLOB = 'blob',
    DOCUMENT = 'document',
    TEXT = 'text'
}
