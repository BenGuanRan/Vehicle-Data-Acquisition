import {Select} from 'antd';
import {getCollectorFromLocal, getControllerFromLocal} from "@/utils/DataUtils.ts";
import {useContext, useEffect} from "react";
import {CreateTestContext} from "@/views/demo/test_process/test_modal/create_test_function.ts";
import {getSignalListByCollectorId} from "@/apis/request/test.ts";

const onChange = (value: string) => {
    console.log(`selected ${value}`);
};

const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export enum BoardType {
    CORE_CONTROL = '核心控制板卡',
    CORE_COLLECT = '采集板卡',
    SIGNAL = '信号关联',
}


export const BoardSelect = ({type}: { type: BoardType }) => {

    let options: { id: number, name: string }[] = []
    const createTestObject = useContext(CreateTestContext)

    useEffect(() => {
        (async () => {
            if (type === BoardType.CORE_CONTROL) {
                options = await getControllerFromLocal()
            } else if (type === BoardType.CORE_COLLECT) {
                options = await getCollectorFromLocal()
            } else if (type === BoardType.SIGNAL) {
                options = await getSignalListByCollectorId(createTestObject.currentSignal?.collectorSignalId!)
            }
        })()
    }, [type])

    return <div>
        <h1>{type}</h1>
        <Select
            showSearch
            placeholder="请选择"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={filterOption}
            options={switchToBoardOptions(options)}
            onClick={() => {
                if (type === BoardType.SIGNAL && !createTestObject.currentSignal?.collectorSignalId) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    document.activeElement.blur();
                    alert('请先选择一个采集指标')
                }
            }}
        />
    </div>
};

const switchToBoardOptions = (options: { id: number, name: string }[]): {
    label: string,
    value: string
}[] => {
    return options.map(option => {
        return {
            label: option.name,
            value: String(option.id)
        }
    })
}