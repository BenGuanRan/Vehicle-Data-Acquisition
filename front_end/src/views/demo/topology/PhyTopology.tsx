import { Button, Card, Tabs, TabsProps } from "antd"
import ControllerInfoTable from "./ControllerInfoTabl"
import { useMemo, useState } from "react";
import { request } from "@/utils/request";
import { ContentType, Method, ResponseType } from "@/apis/standard/all";
import CollectorInfoTable from "./CollectorInfoTable";
import SignalInfoTable from "./SignalInfoTable";
import './PhyTopology.css'
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";

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
        <Card title='当前板卡配置情况' className="tm_card">
            <Tabs className="tm_tabs" defaultActiveKey="1" items={items} />
            <Dragger>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">请点击或拖拽到此区域上传测试预配置文件</p>
                <p className="ant-upload-hint">
                    <Button style={{ padding: 0 }} type="link" onClick={async () => {
                        try {
                            const response = await request({
                                api: {
                                    url: '/downloadPreTestConfigFile',
                                    method: Method.GET,
                                    responseType: ResponseType.ARRAY_BUFFER,
                                    format: ContentType.FILE
                                }
                            })

                            // const response = await fetch('http://localhost:3000/api/downloadPreTestConfigFile')
                            // 将二进制ArrayBuffer转换成Blob
                            const blob = new Blob([response], { type: ContentType.FILE })

                            //  创建一个 <a> 元素，并设置其属性
                            const downloadLink = document.createElement('a');
                            downloadLink.href = window.URL.createObjectURL(blob);
                            downloadLink.download = '测试预配置文件模板.xlsx';

                            // 将 <a> 元素添加到 DOM，并模拟点击以触发下载
                            document.body.appendChild(downloadLink);
                            downloadLink.click();

                            // 下载完成后移除 <a> 元素
                            document.body.removeChild(downloadLink);

                        } catch (error) {
                            console.error('下载文件时出错：', error);
                        }
                    }}>点击此链接</Button>下载测试预配置文件模板
                </p>
            </Dragger>
        </Card>
    </div>
}

export default PreTestManager