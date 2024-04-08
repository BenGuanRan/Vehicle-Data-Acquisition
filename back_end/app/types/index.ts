import { SUCCESS_CODE, FAIL_CODE } from "../constants"

export interface IResBody {
    code: typeof SUCCESS_CODE | typeof FAIL_CODE
    msg: string
    data: any
}