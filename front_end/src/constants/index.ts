export const LOGIN_SUCCESS = "登录成功"
export const LOGIN_FAIL = "用户名或密码错误"
export const SUCCESS_CODE = 0
export const SEARCH_SUCCESS_MSG = '查询成功'
export const WRITE_SUCCESS_MSG = '操作成功'
export const FAIL_CODE = -1
export const SEARCH_FAIL_MSG = "查询失败"
export const WRITE_FAIL_MSG = "操作失败"
export const TOKEN_VALID_CODE = 0 // 有效
export const TOKEN_EXPIRED_CODE = 1 // 过期
export const TOKEN_ILLEGAL_CODE = 2 // 不合法
export const TOKEN_NOTFOUND_CODE = 3 // token不存在
export const TOKEN_INNER_ERROR_CODE = 4 // 服务器内部错误
export const TOKEN_MSG = [
    'TOKEN_VALID:token有效',
    'TOKEN_EXPIRED:token过期',
    'TOKEN_ILLEGAL:token不合法',
    'TOKEN_NOTFOUND:token不存在',
    'TOKEN_INNER_ERROR:服务器内部错误'
]
export const QUERY_INCOMPLETENESS = 'query参数不完整'
export const BODY_INCOMPLETENESS = 'body参数不完整'
export const HORIZONTAL_OVERREACH_IS_PROHIBITED = '禁止水平越权'
export const INSUFFICIENT_AUTHORITY = '非法用户'
export const USER_EXISTED = '该用户已存在'

//错误提示
export enum ERROR_MSG {
    NETWORK_ERROR = '  请检查网络连接后重试',
}
