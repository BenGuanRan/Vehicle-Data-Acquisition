//测试过程格式
export interface ITestProcess {
    testProcessId?: number
    testName: string
}


//测试对象格式
export interface TestObjects {
    objectId?: number
    objectName: string
    collectorSignals: CollectorSignal[]
}

export interface TestObjectsFormat {
    formatId: string

    objectId?: number
    objectName: string
}


//采集指标格式
export interface CollectorSignal {
    collectorSignalId?: number
    collectorSignalName: string
    controllerId: number
    collectorId: number
    signal: string
}

export interface CollectorSignalFormat {
    //用来表示采集物品的唯一标识
    formatId: string
    fatherFormatId: string

    collectorSignalId?: number
    collectorSignalName: string

    controllerId: number
    collectorId: number
    signal: string
}

