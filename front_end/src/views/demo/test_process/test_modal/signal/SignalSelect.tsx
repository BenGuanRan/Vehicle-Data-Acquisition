import {ControllerAndCollector, getCollectorFromLocal, getControllerFromLocal} from "@/utils/DataUtils.ts";
import {useContext, useEffect, useState} from "react";
import {CreateTestContext} from "@/views/demo/test_process/test_modal/CreateTestFunction.ts";
import {getSignalListByCollectorId} from "@/apis/request/test.ts";
import {CollectorSignalFormat} from "@/apis/standard/test.ts";
import './SignalSelect.css'

export enum BoardType {
    CORE_CONTROL = '核心控制板卡',
    CORE_COLLECT = '采集板卡',
    SIGNAL = '信号关联',
}

export const BoardSelect = ({type}: { type: BoardType }) => {

    const [options, setOptions] = useState<{ id: number, name: string }[]>([])
    const [showOptions, setShowOptions] = useState<boolean>(false)


    const [defaultValue, setDefaultValue] = useState<string>()
    const createTestObject = useContext(CreateTestContext)

    useEffect(() => {
        (async () => {
            if (type === BoardType.CORE_CONTROL) {
                const currentOptions = await getControllerFromLocal()
                setOptions(currentOptions)
                console.log("设置板卡为:" + currentOptions.find(option => option.id == createTestObject.currentSignal.controllerId)?.name)
                setDefaultValue(currentOptions.find(option => option.id == createTestObject.currentSignal.controllerId)?.name)
            } else if (type === BoardType.CORE_COLLECT) {
                const currentOptions = await getCollectorFromLocal()
                setOptions(currentOptions)
                setDefaultValue(currentOptions.find(option => option.id == createTestObject.currentSignal.collectorId)?.name)
            } else if (type === BoardType.SIGNAL) {
                if (!createTestObject.currentSignal.collectorId) {
                    setDefaultValue(undefined)
                    return
                }
                const resp = await getSignalListByCollectorId(createTestObject.currentSignal.collectorId)
                const currentOptions = resp.data as ControllerAndCollector[]
                let test = currentOptions.find(option => option.id == createTestObject.currentSignal.signal)?.name
                setDefaultValue(test)
                setOptions(currentOptions)
            }
        })()
    }, [type, JSON.stringify(createTestObject.currentSignal)])

    const onChange = async (value: string) => {
        console.log("onChanged" + value)
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
                    signal: value
                } as CollectorSignalFormat)
                createTestObject.setCurrentSignal({
                    ...createTestObject.currentSignal,
                    signal: value
                } as CollectorSignalFormat)
                break
            }
        }
    }


    return <div>
        <h1>{type}</h1>
        <div className={".drop"}>
            <div className={'options-input'} onClick={async () => {
                if (type !== BoardType.SIGNAL) {
                    setShowOptions(!showOptions)
                    return
                }

                if (!createTestObject.currentSignal.collectorId) {
                    alert("请先选择采集板卡")
                    return
                }
                const currentOptions = await getSignalListByCollectorId(createTestObject.currentSignal.collectorId)
                setOptions(currentOptions.data)
                setShowOptions(!showOptions)
            }}>{defaultValue}</div>
            <div className={'options-container' + (showOptions ? ' show' : ' hidden')}>
                {
                    options.map((item) => {
                        return <div key={item.id + item.name}
                                    className={'options-item'}
                                    onClick={() => {
                                        onChange(String(item.id)).then(
                                            () => {
                                                setShowOptions(false)
                                            }
                                        )
                                    }}
                        >{item.name}</div>
                    })
                }
            </div>
        </div>

    </div>
};