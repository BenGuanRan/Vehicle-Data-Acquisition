import {Form, Input, Modal} from "antd";
import React, {useContext} from "react";
import "./create_test.css"
import {createTest, ICreateTestObject} from "@/apis/request/test.ts";
import {CloseOutlined} from "@ant-design/icons";
import {CreateTestContext, CreateTestFunctions} from "./create_test_function";

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
    const [form] = Form.useForm()
    const testContextValue = CreateTestFunctions({
        testProcessName: "",
        testContents: []
    })

    const CreateTest = async () => {
        createTest(testContextValue.cTestData).then((response) => {
            if (response.code === 200) {
                alert("创建成功")
            } else {
                alert(response.msg)
            }
        })
    }

    const onAddTestObject = () => {
        const objects = prompt("请输入测试对象名称,多个对象用逗号分割")
        if (!objects) return
        formatInput(objects).forEach(item => {
            testContextValue.addTestObject({testObjectName: item})
        })
    }

    return <CreateTestContext.Provider value={testContextValue}>
        <Modal className={"create-modal"} open={open} title="Create Test Process" onOk={async () => {
            onOk()
            await CreateTest()
            testContextValue.clearCollection()
        }} onCancel={() => {
            onCancel()
            testContextValue.clearCollection()
        }} width={"80vw"}>

            <Form form={form}>
                <Form.Item>
                    <Input placeholder={"Test Process Name"} prefix={<div>测试名称:</div>} onChange={(e) => {
                        testContextValue.setTestProcessName(e.target.value)
                    }}/>
                </Form.Item>

                <div className={"show-container"}>
                    <b style={{display: "inline"}}>采集项设置</b>
                    <button className={"add-test-object"} onClick={onAddTestObject}>添加测试对象</button>
                    <div className={"show-content"}>
                        {testContextValue.cTestData.testContents.map((item, index) => {
                            return <TestObjects testObject={item} index={index} key={index}/>
                        })}
                    </div>
                </div>
            </Form>
        </Modal>
    </CreateTestContext.Provider>
}

interface TestObjectItemProps {
    testObject: ICreateTestObject;
    index: number;
}

const TestObjects = ({testObject, index}: TestObjectItemProps) => {

    const fatherIndex = index
    const testObjectItem = useContext(CreateTestContext)

    const onDeleteObject = (index: number) => {
        testObjectItem.deleteTestObject({index})
    }

    const onAddCollect = (index: number) => {
        const itemsName = prompt("请输入采集项名称,多个采集项用逗号分割")
        if (!itemsName) return
        formatInput(itemsName).forEach(item => {
            testObjectItem.addTestCollection({collectorSignalName: item, index})
        })
    }


    return <div>
        <b style={{display: "inline"}}>{testObject.testObjectName}</b>
        <button className={"test-object-delete"} onClick={() => onDeleteObject(index)}>删除
        </button>
        <button className={"add-test-collect"} onClick={() => {
            onAddCollect(index)
        }}>添加采集项
        </button>
        <div>
            {
                testObject.collectItems.map((item, index) => {
                    return <TestObjectItem collectItem={item} index={index} fatherIndex={fatherIndex} key={index}/>
                })
            }
        </div>
    </div>
}

interface TestCollectItemProps {
    collectItem: {
        collectorSignalName: string
        controllerId: number
        collectorId: number
        signal: string
    }
    fatherIndex: number
    index: number
}

const TestObjectItem = ({collectItem, fatherIndex}: TestCollectItemProps) => {

    const testObjectContext = useContext(CreateTestContext)

    return <div style={{display: "inline-block"}} className={"test-collect-item"}>
        <b style={{display: "inline"}}>{collectItem.collectorSignalName}</b>
        <CloseOutlined onClick={() => {
            testObjectContext.deleteTestCollection({
                collectorSignalName: collectItem.collectorSignalName,
                index: fatherIndex
            })
        }} className={"delete-collect-item"}/>
    </div>
}