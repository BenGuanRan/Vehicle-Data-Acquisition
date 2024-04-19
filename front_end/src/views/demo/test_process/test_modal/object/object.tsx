///TODO: 测试对象项目选择
import {CollectorSignalFormat, TestObjectsFormat} from "@/apis/standard/test.ts";
import {hasDuplicate} from "@/utils";
import {v4 as uuidv4} from "uuid";
import React, {useContext} from "react";
import {CreateTestContext} from "@/views/demo/test_process/test_modal/create_test_function.ts";
import {CollectorSignalItem} from "@/views/demo/test_process/test_modal/signal/signal.tsx";
import {formatInput} from "@/views/demo/test_process/test_modal/create_test.tsx";

export const TestObjectsItem: React.FC<{ object: TestObjectsFormat }> = ({object}) => {
    const createTestObject = useContext(CreateTestContext)

    const onAddSignals = (fatherId: string) => {
        const signals = prompt("请输入采集指标名称，多个指标用逗号分隔")
        if (signals) {
            const signalArray = formatInput(signals)

            const currentList = createTestObject.collectorSignals
                .filter((signal: CollectorSignalFormat) => signal.fatherFormatId === fatherId)
                .map((signal: CollectorSignalFormat) => signal.collectorSignalName)

            if (hasDuplicate([...currentList, ...signalArray])) {
                alert("采集指标名称不能重复")
                return
            }

            signalArray.forEach(item => {
                createTestObject.addCollectorSignal({
                    collectorId: 0,
                    controllerId: 0,
                    signal: "",
                    collectorSignalName: item, formatId: uuidv4(), fatherFormatId: fatherId,
                })
            })
        }
    }

    return (
        <div className={"object-item"}>
            <div className={"object-item-function"}>
                <b style={{display: "inline"}}>{object.objectName}</b>

                <button className={"add-test-object"} onClick={() => {
                    onAddSignals(object.formatId)
                }} style={{marginRight: "10px"}}>添加采集指标
                </button>

                <button className={"delete-button"} onClick={() => {
                    createTestObject.deleteTestObject(object.formatId)
                }}>删除测试对象
                </button>
            </div>
            <div className={"show-content"}>
                {createTestObject.collectorSignals.filter((signal: CollectorSignalFormat) => signal.fatherFormatId === object.formatId).map((signal: CollectorSignalFormat, index: number) => {
                    return <CollectorSignalItem signal={signal} key={index}/>
                })}
            </div>
        </div>
    )
}
