import {Button, Form, Input, message, Modal} from "antd";
import React, {useContext, useEffect} from "react";
import "./CreateTest.css"
import {CreateTestContext} from "@/views/demo/test_process/test_modal/CreateTestFunction.ts";
import {hasDuplicate} from "@/utils";
import {v4 as uuidv4} from 'uuid';
import {
    checkValid, CollectorSignalFormat,
    getTestProcess, ITestProcess,
    reverseTestProcess,
    TestObjectsFormat
} from "@/apis/standard/test.ts";
import {
    CONFIGURATION,
    TEST_NAME
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
                message.error("获取失败")
                return
            }
            const {name, objects, signals} = reverseTestProcess(response.data)
            createTestObject.onChangeTestName(name)
            createTestObject.setObjects(objects)
            createTestObject.setCollectorSignal(signals)
            createTestObject.setCurrentSignal(signals[0])
        }).catch((e) => {
            console.log(e)
            message.error("获取失败")
            onFinished()
        })
    }

    useEffect(() => {
        if (mode === "edit" || mode === "show") {
            getTestDetail(testId as string)
        } else if (mode === "create") {
            createTestObject.clearTestProcess()
        }
        createTestObject.setMode(mode)
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
                message.error("修改成功")
                return
            }
            message.success("修改成功")
            onFinished(testProcess)

        }).catch(() => {
            message.error("修改成功")
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
                message.error("创建失败")
                return
            }

            message.success("创建成功")
            onFinished(testProcess)

        }).catch(() => {
            message.error("创建失败")
        })
    }


    const onSubmit = async () => {
        console.log(JSON.stringify(createTestObject.currentTestInfo))

        if (mode === "show") await showModalSubmit()
        if (!JudgeValid()) return
        if (mode === "create") await createModalSubmit()
        if (mode === "edit") await editModalSubmit()
    }

    const JudgeValid = () => {
        let result = true;

        createTestObject.collectorSignals.forEach((signal: CollectorSignalFormat) => {
            if (!signal.collectorId || !signal.signalId || !signal.controllerId) {
                result = false
                return
            }
        })

        if (!result) {
            alert("请完善采集指标信息")
        }

        return result
    }

    return <Modal className={"test_modal-modal"}
                  open={open}
                  title={generateTitle(mode)}
                  onOk={() => {
                      onSubmit()
                  }}
                  onCancel={() => {
                      onFinished()
                  }}
                  width={"80vw"}
                  keyboard={true}
    >

        <Form.Item>
            <Input addonBefore={TEST_NAME + ":"} onChange={(e) => {
                createTestObject.onChangeTestName(e.target.value)
            }} value={createTestObject.testName} disabled={createTestObject.isJustSee()}/>
        </Form.Item>


        <div className={"show-content-total"}>

            <div className={"show-container"}>
                <b style={{display: "inline", marginRight: '10px'}}>{CONFIGURATION}</b>

                {
                    !createTestObject.isJustSee() ? <Button onClick={onAddObjects}>添加测试对象</Button> : null
                }

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