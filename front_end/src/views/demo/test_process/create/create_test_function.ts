import {ICreateTestProcess} from "@/apis/request/test.ts";
import React, {useCallback, useReducer} from "react";

export const CreateTestContext: React.Context<any> = React.createContext(null);

export const CreateTestFunctions = (initState: ICreateTestProcess) => {
    const [cTestData, setCTestData] = useReducer(cTestReducer, initState);

    const setTestProcessName = useCallback((data: string) => {
        setCTestData({type: Enum.TEST_PROCESS_NAME, payload: data});
    }, []);

    const addTestObject = useCallback((data: AddTestProps) => {
        setCTestData({type: Enum.ADD_TEST_OBJECT, payload: data});
    }, []);

    const deleteTestObject = useCallback((data: DeleteTestProps) => {
        setCTestData({type: Enum.DELETE_TEST_OBJECT, payload: data});
    }, []);

    const addTestCollection = useCallback((data: AddCollectionProps) => {
        setCTestData({type: Enum.ADD_TEST_COLLECTION, payload: data});
    }, []);

    const deleteTestCollection = useCallback((data: DeleteCollectionProps) => {
        setCTestData({type: Enum.DELETE_TEST_COLLECTION, payload: data});
    }, []);

    const clearCollection = useCallback(() => {
        setCTestData({type: Enum.CLEAR, payload: null});
    }, []);

    return {
        cTestData,
        setTestProcessName,
        addTestObject,
        deleteTestObject,
        addTestCollection,
        deleteTestCollection,
        clearCollection
    };
}

const cTestReducer = (state: ICreateTestProcess, action: { type: Enum, payload: any }) => {
    switch (action.type) {
        //TODO 设置测试名称
        case Enum.TEST_PROCESS_NAME: {
            const payload = action.payload as string;
            console.log("正在设置测试名称", payload);
            return {
                ...state,
                testProcessName: payload
            }
        }
        //TODO 添加测试对象
        case Enum.ADD_TEST_OBJECT: {
            const payload = action.payload as AddTestProps;
            console.log("正在添加测试对象", payload.testObjectName)
            return {
                ...state,
                testContents: [...state.testContents, {
                    testObjectName: payload.testObjectName,
                    collectItems: []
                }]
            };
        }
        //TODO 删除测试对象
        case Enum.DELETE_TEST_OBJECT: {
            const payload = action.payload as DeleteTestProps;
            console.log("正在删除测试对象", payload.index, "  名称为：" + state.testContents[payload.index].testObjectName)
            return {
                ...state,
                testContents: state.testContents.filter((_, index) => index !== payload.index)
            }
        }
        //TODO 添加采集项
        case Enum.ADD_TEST_COLLECTION: {
            const payload = action.payload as AddCollectionProps;
            console.log("正在添加采集项", payload.collectorSignalName, "到", payload.index, "号测试对象", state.testContents[payload.index].testObjectName)
            return {
                ...state,
                testContents: state.testContents.map((item, index) => {
                    if (index === payload.index) {
                        return {
                            ...item,
                            collectItems: [...item.collectItems, {
                                collectorSignalName: payload.collectorSignalName,
                                controllerId: 0,
                                collectorId: 0,
                                signal: ""
                            }]
                        }
                    }
                    return item;
                })
            }
        }
        //TODO 删除采集项
        case Enum.DELETE_TEST_COLLECTION: {
            const payload = action.payload as DeleteCollectionProps;
            console.log("正在删除采集项", payload.collectorSignalName, "从", payload.index, "号测试对象", state.testContents[payload.index].testObjectName)
            return {
                ...state,
                testContents: state.testContents.map((item, index) => {
                    if (index === payload.index) {
                        return {
                            ...item,
                            collectItems: item.collectItems.filter(item => item.collectorSignalName !== payload.collectorSignalName)
                        }
                    }
                    return item;
                })
            }
        }
        case Enum.CLEAR: {
            return {
                testProcessName: "",
                testContents: []
            }
        }
        default:
            return state;
    }
}


enum Enum {
    TEST_PROCESS_NAME = "TEST_PROCESS_NAME",
    ADD_TEST_OBJECT = "ADD_TEST_OBJECT",
    DELETE_TEST_OBJECT = "DELETE_TEST_OBJECT",
    ADD_TEST_COLLECTION = "ADD_TEST_COLLECTION",
    DELETE_TEST_COLLECTION = "DELETE_TEST_COLLECTION",
    CLEAR = "CLEAR"
}

interface AddTestProps {
    //传入要添加的测试项名称
    testObjectName: string
}

interface DeleteTestProps {
    //传入要删除的index
    index: number
}

interface AddCollectionProps {
    //传入父级index 以及要添加的采集项名称
    index: number,
    collectorSignalName: string,
}

interface DeleteCollectionProps {
    //传入父级index 以及要删除的采集项名称
    index: number,
    collectorSignalName: string,
}
