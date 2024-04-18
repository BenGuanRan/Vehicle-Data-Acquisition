import React, {useCallback, useReducer} from "react";
import {CollectorSignalFormat, TestObjectsFormat} from "@/apis/standard/test.ts";

export const CreateTestContext: React.Context<any> = React.createContext(null);

export const CreateTestFunctions = () => {
    const [testName, setTestName] = React.useState<string>("");
    const [testObjects, setTestObjects] = useReducer<React.Reducer<TestObjectsFormat[], {
        type: ActionType,
        payload: any
    }>>(objectsReducer, []);
    const [collectorSignals, setCollectorSignals] = useReducer<React.Reducer<CollectorSignalFormat[], {
        type: ActionType,
        payload: any
    }>>(signalsReducer, []);
    const [currentSignal, setCurrentSignal] = React.useState<CollectorSignalFormat | null>(null);

    const onChangeTestName = (name: string) => {
        setTestName(name)
    }

    const addTestObject = (object: TestObjectsFormat) => {
        console.log("添加测试对象:" + object)
        setTestObjects({type: ActionType.ADD, payload: object})
    }

    //删除测试对象
    const deleteTestObject = (objectId: string) => {
        console.log("删除测试对象:" + objectId)
        setTestObjects({type: ActionType.DELETE, payload: objectId})
        setCollectorSignals({type: ActionType.DELETE_BY_FATHER, payload: objectId})
    }

    const addCollectorSignal = (signal: CollectorSignalFormat) => {
        console.log("添加采集指标:" + signal.collectorSignalName)
        console.log("collectorSignals:" + JSON.stringify(collectorSignals))
        setCollectorSignals({type: ActionType.ADD, payload: signal})
    }

    const deleteCollectorSignal = (index: string) => {
        console.log("删除采集指标:" + index)
        setCollectorSignals({type: ActionType.DELETE, payload: index})
    }

    const updateCollectorSignal = (signal: CollectorSignalFormat) => {
        setCollectorSignals({type: ActionType.UPDATE, payload: signal})
    }

    const switchCollectorSignal = useCallback((signal: CollectorSignalFormat) => {
        setCurrentSignal(signal)
    }, [])

    return {
        testName,
        testObjects,
        collectorSignals,
        currentSignal,
        onChangeTestName,
        addTestObject,
        deleteTestObject,
        addCollectorSignal,
        deleteCollectorSignal,
        updateCollectorSignal,
        switchCollectorSignal,
    }
}

enum ActionType {
    ADD = "add",
    DELETE = "delete",
    UPDATE = "update",
    DELETE_BY_FATHER = "deleteByFather",
}

const objectsReducer = (statue: TestObjectsFormat[], action: { type: ActionType, payload: any }) => {
    switch (action.type) {
        case ActionType.ADD:
            return [...statue, action.payload]
        case ActionType.DELETE:
            return statue.filter(item => item.formatId !== action.payload)
        default:
            return statue
    }
}

const signalsReducer = (statue: CollectorSignalFormat[], action: { type: ActionType, payload: any }) => {
    switch (action.type) {
        case ActionType.ADD:
            return [...statue, action.payload]
        case ActionType.DELETE:
            return statue.filter(item => item.formatId !== action.payload)
        case ActionType.DELETE_BY_FATHER:
            return statue.filter(item => item.fatherFormatId !== action.payload)
        default:
            return statue
    }
}