import Mock from 'mockjs'
import {TestItem} from "@/views/demo/test_process/test_process.tsx";
import {data} from "@/mock/testlistdata.ts";

export const getTestList = Mock.mock('api/test', 'get', () => {
    return Mock.mock({
        'list': data
    }) as TestItem[]
})

export const getTestDetail = Mock.mock('api/test/detail', 'get', () => {
    return Mock.mock({
        'data': data.find(item => item.id === 2) as TestItem
    }) as TestItem
})
