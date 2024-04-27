import {Form, Input, Modal} from "antd";
import React, {useContext, useEffect} from "react";
import "./CreateTest.css"
import {CreateTestContext} from "@/views/demo/test_process/test_modal/CreateTestFunction.ts";
import {hasDuplicate} from "@/utils";
import {v4 as uuidv4} from 'uuid';
import {
    checkValid,
    getTestProcess, ITestProcess,
    reverseTestProcess,
    TestObjectsFormat
} from "@/apis/standard/test.ts";
import {
    CONFIGURATION,
    TEST_NAME, TEST_OBJECT
} from "@/constants/name.ts";
import {createTest, editTest, fetchTestDetail} from "@/apis/request/test.ts";
import {SUCCESS_CODE} from "@/constants";
import {CollectorSignalSelect} from "@/views/demo/test_process/test_modal/signal/Signal.tsx";
import {TestObjectsItem} from "@/views/demo/test_process/test_modal/object/object.tsx";

interface CreateTestProps {
    open: boolean,
    mode: "create" | "edit" | "show"
    onFinished: (newTest?: ITestProcess) => void
    testId?: string
}

export const formatInput = (input: string) => {
    return input.replace(/，/g, ",")
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "" && item !== " ")
}

export const CreateTest: React.FC<CreateTestProps> = ({open, mode, onFinished, testId}) => {

    const createTestObject = useContext(CreateTestContext)

    const getTestDetail = (testId: string) => {
        fetchTestDetail(testId as string).then((response) => {
            if (response.code !== SUCCESS_CODE) {
                alert("获取失败")
                return
            }
            const {name, objects, signals} = reverseTestProcess(response.data)
            createTestObject.onChangeTestName(name)
            createTestObject.setObjects(objects)
            createTestObject.setCollectorSignal(signals)
        }).catch((e) => {
            console.log(e)
            alert("获取失败")
            onFinished()
        })
    }


    useEffect(() => {
        if (mode === "edit" || mode === "show") {
            getTestDetail(testId as string)
        } else if (mode === "create") {
            createTestObject.clearTestProcess()
        }
    }, [mode])


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

    const showModalSubmit = () => {
        confirm("详情模式不会保存您更改的数据")
        onFinished()
        return
    }

    const editModalSubmit = () => {
        const testProcess = getTestProcess(createTestObject.testName,
            createTestObject.testObjects,
            createTestObject.collectorSignals,
            testId)

        const isValid = checkValid(testProcess)
        if (isValid) {
            alert(isValid)
            return
        }
        editTest(testProcess).then((response) => {
            console.log(response)
            if (response.code !== SUCCESS_CODE) {
                alert("修改失败")
                return
            }
            alert("修改成功")
            onFinished()
        }).catch(() => {
            alert("修改失败")
        })
    }

    const createModalSubmit = () => {
        const testProcess = getTestProcess(createTestObject.testName, createTestObject.testObjects, createTestObject.collectorSignals)
        console.log(JSON.stringify(testProcess))
        const isValid = checkValid(testProcess)
        if (isValid) {
            alert(isValid)
            return
        }
        createTest(testProcess).then((response) => {
            console.log(response)
            if (response.code !== SUCCESS_CODE) {
                alert("创建失败")
                return
            }
            alert("创建成功")
            onFinished(testProcess)
        }).catch(() => {
            alert("创建失败")
        })
    }

    const onSubmit = () => {
        console.log(JSON.stringify(createTestObject.currentTestInfo))
        if (mode === "show") showModalSubmit()
        if (mode === "create") createModalSubmit()
        if (mode === "edit") editModalSubmit()
    }

    return <Modal className={"test_modal-modal"} open={open} title={generateTitle(mode)} onOk={onSubmit}
                  onCancel={() => {
                      onFinished()
                  }}
                  width={"80vw"}>

        <Form.Item>

            <Input addonBefore={TEST_NAME + ":"} onChange={(e) => {
                createTestObject.onChangeTestName(e.target.value)
            }} value={createTestObject.testName}/>

        </Form.Item>


        <div className={"show-content-total"}>
            <div className={"show-container"}>
                <b style={{display: "inline", marginRight: '10px'}}>{CONFIGURATION}</b>
                <button className={"add-test-object"} onClick={onAddObjects}>添加{TEST_OBJECT}</button>
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

const generateTitle = (mode: "create" | "edit" | "show") => {
    switch (mode) {
        case "create":
            return "创建测试";
        case "edit":
            return "编辑测试";
        case "show":
            return "查看测试,此模式下不会保留您的更改";
        default:
            return "";
    }
}