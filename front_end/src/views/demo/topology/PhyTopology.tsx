import { Button, Card, List, Modal, Tabs, TabsProps, Tag, message } from "antd"
import ControllerInfoTable from "./ControllerInfoTabl"
import { useMemo, useState } from "react";
import { request } from "@/utils/request";
import { ContentType, Method, ResponseType } from "@/apis/standard/all";
import CollectorInfoTable from "./CollectorInfoTable";
import SignalInfoTable from "./SignalInfoTable";
import './PhyTopology.css'
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import ExcelJs from 'exceljs'
import { METHODS } from "http";
import { SUCCESS_CODE } from "@/constants";

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
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [preTestConfig, setPreTestConfig] = useState<any>({
        controllersConfig: [] as any,
        collectorsConfig: [] as any,
        signalsConfig: [] as any
    })

    function reloadData() {
        ; (async () => {
            const res = await request({
                api: {
                    url: '/getTestDevicesInfo',
                    method: Method.GET
                }
            })
            setTestData(res.data)
        })()
    }

    useMemo(() => {
        reloadData()
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
    const itemsTitle = ['核心板卡描述', '采集板卡描述', '信号描述']
    const titles = [
        ['核心板卡代号', '核心板卡地址'],
        ['采集板卡代号', '采集板卡地址'],
        ['卡内序号', '采集板代号', '信号名', '单位', '信号类型', '备注']
    ]
    const titlesKey = [
        ['controllerName', 'controllerAddress'],
        ['collectorName', 'collectorAddress'],
        ['innerIndex', 'collectorName', 'signalName', 'signalUnit', 'signalType', 'remark']
    ]
    const sheetKey: ['controllersConfig', 'collectorsConfig', 'signalsConfig'] = ['controllersConfig', 'collectorsConfig', 'signalsConfig']
    function verifyWorkBook(wb: ExcelJs.Workbook) {
        // 工作簿前三个必须依次是核心板卡描述，采集板卡描述，采集板卡信号描述
        const wss = wb.worksheets
        const wsCount = wss.length
        const countOk = wsCount >= 3
        if (!countOk) return {
            msg: 'worksheet缺失',
            data: null
        }
        const nameOk = wss[0].name === '核心板卡描述' && wss[1].name === '采集板卡描述' && wss[2].name === '采集板卡信号描述'
        if (!nameOk) return {
            msg: 'worksheet名称校验未通过',
            data: null
        }
        // 校验title

        let titleOkObj = {
            wsName: '',
            ok: true
        }
        wb.eachSheet((ws, wsi) => {
            ws.getRow(1).eachCell((c, ci) => {
                if (titles[wsi - 1][ci - 1] !== c.value)
                    titleOkObj = {
                        wsName: ws.name,
                        ok: false
                    }
            })
        })
        if (!titleOkObj.ok) return {
            msg: `检测到${titleOkObj.wsName}中标题有误`,
            data: null
        }
        const data = {
            controllersConfig: [] as any,
            collectorsConfig: [] as any,
            signalsConfig: [] as any
        }
        wb.eachSheet((ws, wsi) => {
            data[sheetKey[wsi - 1]] = []
            ws.eachRow((r, ri) => {
                if (ri === 1) return
                let item = {} as any
                for (let i = 0; i < titlesKey[wsi - 1].length; i++) {
                    let key = titlesKey[wsi - 1][i]
                    item[key] = r.getCell(i + 1)?.value
                }
                data[sheetKey[wsi - 1]].push(item)
            })

        })
        setPreTestConfig(data)
        return {
            msg: '测试预配置文件合法',
            data
        }

    }

    async function handleDragger(info: any) {
        const { file } = info
        try {
            // 读取上传的excel文件
            const wb = new ExcelJs.Workbook()

            await wb.xlsx.load(file)
            const verifyObj = verifyWorkBook(wb)
            if (verifyObj.data === null) {
                return messageApi.error(verifyObj.msg);
            }
            setOpen(true)
        } catch (error) {
            messageApi.error('不合法的测试预配置文件');

        }

    }

    async function syncPreTestConfig() {
        setConfirmLoading(true)
        request({
            api: {
                url: '/syncPreTestConfig',
                method: Method.POST,
                format: ContentType.JSON
            },
            params: preTestConfig,
        }).then((res: any) => {
            const { code, msg } = res
            if (code === SUCCESS_CODE) {
                setOpen(false)
                reloadData()
                messageApi.success('同步配置成功')
            } else {
                throw new Error
            }
        }).catch(err => {
            console.log(err);
            setOpen(false)
            messageApi.success('同步配置失败')
        }).finally(() => {
            setConfirmLoading(false)
        })
    }

    return <div className="tm_container">
        {contextHolder}
        <Modal
            width={600}
            title="excel格式检查通过，是否立即同步测试预配置文件？"
            open={open}
            onOk={() => syncPreTestConfig()}
            confirmLoading={confirmLoading}
            onCancel={() => setOpen(false)}
        >
            <Tabs className="tm_tabs" defaultActiveKey="1" items={
                itemsTitle.map((item, index) => {
                    return ({
                        key: index + 1 + '',
                        label: item,
                        children: <List
                            style={{
                                height: 250,
                                overflowY: 'scroll'
                            }}
                            size="small"
                            header={<b>{
                                titles[index].map(i => <Tag>{i || 'NULL'}</Tag>)
                            }</b>}
                            bordered
                            dataSource={preTestConfig[sheetKey[index]]}
                            renderItem={(item) => <List.Item style={{ justifyContent: 'left' }}>{Object.values(item as string).map(i => <Tag>{i || 'NULL'}</Tag>)}</List.Item>}
                        />,
                    })
                })
            } />
        </Modal>
        <Card title='当前板卡配置情况' className="tm_card">
            <Tabs className="tm_tabs" defaultActiveKey="1" items={items} />
            <Dragger
                accept=".xlsx"
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleDragger}
            >
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