import { Tabs, TabsProps } from "antd"
import ControllerInfoTable from "./ControllerInfoTabl"
import { useMemo, useState } from "react";
import { request } from "@/utils/request";
import { Method } from "@/apis/standard/all";
import CollectorInfoTable from "./CollectorInfoTable";
import SignalInfoTable from "./SignalInfoTable";
import './PhyTopology.css'

export interface IControllersDataItem {
    id: number
    controllerName: string
    controllerAddress: string
}
export interface ICollectorsDataItem {
    id: number
    collectorName: string
    collectorAddress: string
}
export interface ISignalsDataItem {
    id: number
    signalName: string
    signalUnit: string
    signalType: string
    remark: string
    innerIndex: number
    collectorName: number
}

interface ITestData {
    controllersData: IControllersDataItem[]
    collectorsData: ICollectorsDataItem[]
    signalsData: ISignalsDataItem[]
}


const PreTestManager: React.FC = () => {
    const [testData, setTestData] = useState<ITestData>()


    useMemo(() => {
        ; (async () => {
            const res = await request({
                api: {
                    url: '/getTestDevicesInfo',
                    method: Method.GET
                }
            })
            setTestData(res.data)
        })()
    }, [])


    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '核心板卡描述',
            children: <ControllerInfoTable dataSource={testData?.controllersData || []} />,
        },
        {
            key: '2',
            label: '采集板卡描述',
            children: <CollectorInfoTable dataSource={testData?.collectorsData || []}></CollectorInfoTable>,
        },
        {
            key: '3',
            label: '信号描述',
            children: <SignalInfoTable dataSource={testData?.signalsData || []} />,
        },
    ]

    return <div className="tm_container">
        <Tabs className="tm_tabs" defaultActiveKey="1" items={items} />
    </div>
}

export default PreTestManager