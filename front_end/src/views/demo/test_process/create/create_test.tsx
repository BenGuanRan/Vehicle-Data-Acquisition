import {Form, Input, Modal} from "antd";
import React, {useContext} from "react";
import "./create_test.css"
import {CreateTestContext} from "@/views/demo/test_process/create/create_test_function.ts";
import {hasDuplicate} from "@/utils";
import {v4 as uuidv4} from 'uuid';
import {CollectorSignalFormat, TestObjectsFormat} from "@/apis/standard/test.ts";

interface CreateTestProps {
    open: boolean,
    onOk: () => void,
    onCancel: () => void
}

const formatInput = (input: string) => {
    return input.replace(/，/g, ",")
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "" && item !== " ")
}

export const CreateTest: React.FC<CreateTestProps> = ({open, onOk, onCancel}) => {

    const createTestObject = useContext(CreateTestContext)

    const onAddObjects = () => {
        const objects = prompt("请输入测试对象名称，多个对象用逗号分隔")
        if (objects) {
            const objectArray = formatInput(objects)
            const currentList = createTestObject.testObjects.map((object: TestObjectsFormat) => object.objectName)
            if (hasDuplicate([...currentList, ...objectArray])) {
                alert("测试对象名称不能重复")
                return
            }
            objectArray.forEach(item => {
                createTestObject.addTestObject({objectName: item, formatId: uuidv4()})
            })
        }
    }

    return <Modal className={"create-modal"} open={open} title="Create Test Process" onOk={async () => {
        onOk()
    }} onCancel={() => {
        onCancel()
    }} width={"80vw"}>

        <Form.Item>
            <Input placeholder={"Test Process Name"} prefix={<div>测试名称:</div>} onChange={(e) => {
                createTestObject.onChangeTestName(e.target.value)
            }}/>
        </Form.Item>

        <div className={"show-content-total"}>
            <div className={"show-container"}>
                <b style={{display: "inline"}}>采集项设置</b>
                <button className={"add-test-object"} onClick={onAddObjects}>添加测试对象</button>
                <div className={"show-content"}>
                    {createTestObject.testObjects.map((object: TestObjectsFormat, index: number) => {
                        return <TestObjectsItem object={object} key={index}/>
                    })}
                </div>
            </div>
            <div className={"show-container"}>
                <CollectorSignalSelect/>
            </div>
        </div>
    </Modal>
}


const TestObjectsItem: React.FC<{ object: TestObjectsFormat }> = ({object}) => {
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

const CollectorSignalItem = ({signal}: { signal: CollectorSignalFormat }) => {
    const createTestObject = useContext(CreateTestContext)

    return (
        <div className={"signal-item"} onClick={() => {
            createTestObject.switchCollectorSignal(signal)
        }}>
            <b style={{display: "inline"}}>{signal.collectorSignalName}</b>
            <button className={"delete-button"} onClick={() => {
                createTestObject.deleteCollectorSignal(signal.formatId)
            }}>删除采集指标
            </button>
        </div>
    )
}

const CollectorSignalSelect = () => {
    const createTestObject = useContext(CreateTestContext)
    const currentObject = createTestObject.testObjects.find((e: TestObjectsFormat) => e.formatId === createTestObject.currentSignal?.fatherFormatId)?.objectName
    const currentSignal = createTestObject.currentSignal ? createTestObject.currentSignal.collectorSignalName : ""


    if (!createTestObject.currentSignal) {
        return <div style={{padding: '10px', fontSize: '16px', color: 'red'}}>请先选择一个采集指标</div>
    }

    return (
        <section style={{padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px', height: '100%'}}>
            <header style={{marginBottom: '10px', fontSize: '20px', fontWeight: 'bold'}}>核心板卡设置</header>

            <p style={{marginBottom: '5px', fontSize: '16px'}}>当前测试对象:<span
                style={{color: 'blue'}}>{currentObject}</span></p>

            <p style={{marginBottom: '5px', fontSize: '16px'}}>当前配置指标:<span
                style={{color: 'blue'}}>{currentSignal}</span></p>

            <header style={{marginBottom: '5px', fontSize: '16px'}}>采集项板卡选择</header>
            <article style={{display: 'flex', justifyContent: 'space-between'}}>
                <p style={{padding: '10px', backgroundColor: '#ddd', borderRadius: '5px'}}>板卡1</p>
                <p style={{padding: '10px', backgroundColor: '#ddd', borderRadius: '5px'}}>板卡2</p>
                <p style={{padding: '10px', backgroundColor: '#ddd', borderRadius: '5px'}}>板卡3</p>
            </article>
        </section>
    )
}