import {v4 as uuid} from "uuid"

//测试过程格式
export interface ITestProcess {
    testProcessId?: number
    testName: string
    testObjects: TestObjects[]
}


//测试对象格式
export interface TestObjects {
    objectId?: number
    objectName: string
    collectorSignals: CollectorSignal[]
}

export interface CollectorSignal {
    collectorSignalId?: number
    collectorSignalName: string
    controllerId: number
    collectorId: number
    signalId: number
}


export interface TestObjectsFormat {
    formatId: string

    objectId?: number
    objectName: string
}


//采集指标格式
export interface CollectorSignalFormat {
    formatId: string
    fatherFormatId: string

    collectorSignalId?: number
    collectorSignalName: string
    controllerId: number
    collectorId: number
    signalId: number
}

//通过测试对象和采集指标合成测试过程
export const getTestProcess = (name: string, objects: TestObjectsFormat[], signals: CollectorSignalFormat[], id?: string): ITestProcess => {
    const testProcess: ITestProcess = {
        testProcessId: id ? parseInt(id) : undefined,
        testName: name,
        testObjects: []
    }
    testProcess.testObjects = objects.map((object: TestObjectsFormat) => {
        return {
            objectId: object.objectId,
            objectName: object.objectName,
            collectorSignals: signals.map((collectorSignalFormat: CollectorSignalFormat) => {
                if (collectorSignalFormat.fatherFormatId === object.formatId) {
                    const collectorSignal: CollectorSignal = {
                        collectorSignalId: collectorSignalFormat.collectorSignalId,
                        collectorSignalName: collectorSignalFormat.collectorSignalName,
                        controllerId: collectorSignalFormat.controllerId !== 0 ? collectorSignalFormat.controllerId : 1,
                        collectorId: collectorSignalFormat.collectorId !== 0 ? collectorSignalFormat.collectorId : 3,
                        signalId: collectorSignalFormat.signalId
                    };
                    return collectorSignal
                }
            }).filter((signal: CollectorSignal | undefined) => signal !== undefined) as CollectorSignal[]
        }
    })

    return testProcess
}

//通过测试过程分解测试对象和采集指标
export const reverseTestProcess = (itestProcess: ITestProcess): {
    testProId: number,
    name: string,
    objects: TestObjectsFormat[],
    signals: CollectorSignalFormat[]
} => {
    const name = itestProcess.testName

    const testProId = itestProcess.testProcessId!
    const objects: TestObjectsFormat[] = []
    const signals: CollectorSignalFormat[] = []

    itestProcess.testObjects.forEach((object: TestObjects) => {
        const formatId = uuid()

        objects.push({
            formatId: formatId,
            objectId: object.objectId,
            objectName: object.objectName
        })

        object.collectorSignals.forEach((signal: CollectorSignal) => {
            const childrenId = uuid()
            signals.push({
                formatId: childrenId,
                fatherFormatId: formatId,
                collectorSignalId: signal.collectorSignalId,
                ...signal
            })
        })
    })

    return {
        testProId,
        name,
        objects,
        signals
    }
}

export const checkValid = (testProcess: ITestProcess): string => {
    //测试名称不能为空
    const TEST_PROCESS_NAME_EMPTY = "测试流程名称不能为空"
    //测试对象不能为0
    const TEST_OBJECT_EMPTY = "请添加测试对象"
    //采集指标不能为0
    const COLLECT_SIGNAL_EMPTY = "测试对象的采集指标不能为空"
    //success
    const SUCCESS = ""

    if (testProcess.testName === "") return TEST_PROCESS_NAME_EMPTY

    if (testProcess.testObjects.length === 0) return TEST_OBJECT_EMPTY

    if (testProcess.testObjects.some((object: TestObjects) => object.collectorSignals.length === 0)) return COLLECT_SIGNAL_EMPTY

    return SUCCESS
}