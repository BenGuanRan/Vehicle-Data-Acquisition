import {Select} from 'antd';
import {getCollectorFromLocal, getControllerFromLocal} from "@/utils/DataUtils.ts";
import {useContext, useEffect, useState} from "react";
import {CreateTestContext} from "@/views/demo/test_process/test_modal/CreateTestFunction.ts";
import {getSignalListByCollectorId} from "@/apis/request/test.ts";
import {CollectorSignalFormat} from "@/apis/standard/test.ts";

const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export enum BoardType {
    CORE_CONTROL = '核心控制板卡',
    CORE_COLLECT = '采集板卡',
    SIGNAL = '信号关联',
}

export const BoardSelect = ({type}: { type: BoardType }) => {

    const [options, setOptions] = useState<{ id: number, name: string }[]>([])

    const [defaultValue, setDefaultValue] = useState<string | undefined>(undefined)
    const createTestObject = useContext(CreateTestContext)

    useEffect(() => {
        (async () => {
            if (type === BoardType.CORE_CONTROL) {
                const currentOptions = await getControllerFromLocal()
                setOptions(currentOptions)
                console.log("设置板卡为:"+currentOptions.find(option => option.id === createTestObject.currentSignal.controllerId)?.name)
                setDefaultValue(currentOptions.find(option => option.id === createTestObject.currentSignal.controllerId)?.name)
            } else if (type === BoardType.CORE_COLLECT) {
                const currentOptions = await getCollectorFromLocal()
                setOptions(currentOptions)
                setDefaultValue(currentOptions.find(option => option.id === createTestObject.currentSignal.collectorId)?.name)
            } else if (type === BoardType.SIGNAL) {
                if (!createTestObject.currentSignal.collectorId) return
                const currentOptions = await getSignalListByCollectorId(createTestObject.currentSignal.collectorId)
                let test = currentOptions.find(option => option.id === createTestObject.currentSignal.collectorSignalId)?.name
                setDefaultValue(test)
                setOptions(currentOptions)
            }
        })()
    }, [type, JSON.stringify(createTestObject.currentSignal)])

    const onChange = async (value: string) => {
        switch (type) {
            case BoardType.CORE_CONTROL: {
                createTestObject.updateCollectorSignal({
                    ...createTestObject.currentSignal,
                    controllerId: value
                } as CollectorSignalFormat)
                createTestObject.setCurrentSignal({
                    ...createTestObject.currentSignal,
                    controllerId: value
                } as CollectorSignalFormat)
                break
            }
            case BoardType.CORE_COLLECT: {
                createTestObject.updateCollectorSignal({
                    ...(createTestObject.currentSignal),
                    collectorId: value
                } as CollectorSignalFormat)
                createTestObject.setCurrentSignal({
                    ...createTestObject.currentSignal,
                    collectorId: value
                } as CollectorSignalFormat)
                break
            }
            case BoardType.SIGNAL: {
                createTestObject.updateCollectorSignal({
                    ...createTestObject.currentSignal,
                    collectorSignalId: value
                } as CollectorSignalFormat)
                createTestObject.setCurrentSignal({
                    ...createTestObject.currentSignal,
                    collectorSignalId: value
                } as CollectorSignalFormat)
                break
            }
        }
    }


    return <div>
        <h1>{type}</h1>
        <Select
            showSearch
            placeholder="请选择"
            optionFilterProp="children"
            onChange={onChange}
            defaultValue={defaultValue}
            filterOption={filterOption}
            options={switchToBoardOptions(options)}
            onClick={async () => {
                if (type !== BoardType.SIGNAL) return
                if (!createTestObject.currentSignal.collectorId) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    document.activeElement.blur();
                    alert('请先选择一个采集指标')
                } else {
                    const signalList = await getSignalListByCollectorId(createTestObject.currentSignal.collectorId)
                    setOptions(signalList.data)
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