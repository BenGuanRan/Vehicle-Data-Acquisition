import Mock from 'mockjs'
import {TestItem} from "@/views/demo/test_process/test_process.tsx";

export const getTestList = Mock.mock('api/test', 'get', () => {
    return Mock.mock({
        'list|1-10': [{
            'key|+1': 1,
            'id|+1': 1,
            'title': '@title',
            'equipment_number': '@integer(1, 100)',
            'equipment_category': '@word',
            'test_parameter': '@word',
            'status': '@word',
            'create_at': '@date',
        }]
    }) as TestItem[]
})
