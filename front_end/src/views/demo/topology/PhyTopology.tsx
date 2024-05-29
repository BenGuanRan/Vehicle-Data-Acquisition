import { Button, Card, List, Modal, Popconfirm, Result, Tabs, TabsProps, Tag, message } from "antd"
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
import { SUCCESS_CODE } from "@/constants";
import userUtils from "@/utils/UserUtils";
import {useNavigate } from "react-router-dom";

export interface IcontrollersConfigItem {
    id: number
    controllerName: string
    controllerAddress: string
}

export interface IcollectorsConfigItem {
    id: number
    collectorName: string
    collectorAddress: string
}

export interface IsignalsConfigItem {
    id: number
    signalName: string
    signalUnit: string
    signalType: string
    remark: string
    innerIndex: number
    collectorName: number
}

interface ITestData {
    controllersConfig: IcontrollersConfigItem[]
    collectorsConfig: IcollectorsConfigItem[]
    signalsConfig: IsignalsConfigItem[]
}


const PreTestManager: React.FC = () => {
    const [testData, setTestData] = useState<ITestData>()
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);
    const [preTestConfig, setPreTestConfig] = useState<any>({
        controllersConfig: [] as any,
        collectorsConfig: [] as any,
        signalsConfig: [] as any
    })
    const navigate = useNavigate()

    function reloadData() {
        (async () => {
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
            children: <ControllerInfoTable dataSource={testData?.controllersConfig || []} />,
        },
        {
            key: '2',
            label: '采集板卡描述',
            children: <CollectorInfoTable dataSource={testData?.collectorsConfig || []}></CollectorInfoTable>,
        },
        {
            key: '3',
            label: '信号描述',
            children: <SignalInfoTable dataSource={testData?.signalsConfig || []} />,
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
                const item = {} as any
                for (let i = 0; i < titlesKey[wsi - 1].length; i++) {
                    const key = titlesKey[wsi - 1][i]
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
        return new Promise((resolve => {
            request({
                api: {
                    url: '/syncPreTestConfig',
                    method: Method.POST,
                    format: ContentType.JSON
                },
                params: preTestConfig,
            }).then((res: any) => {
                const { code} = res
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
                resolve(null)
            })
        }))
    }

    return <div className="tm_container">
        {contextHolder}
        <Modal
            width={600}
            title="excel格式检查通过，是否立即同步测试预配置文件？"
            open={open}
            onOk={() => syncPreTestConfig()}
            onCancel={() => setOpen(false)}
            footer={
                [
                    <Popconfirm
                        title="高危操作"
                        description="立即同步将清除所有已创建的测试流程，以及下发的测试配置文件！！！"
                        onConfirm={() => syncPreTestConfig()}
                        onCancel={() => setOpen(false)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button danger>立即同步</Button>
                    </Popconfirm>,
                    <Button onClick={() => setOpen(false)}>取消</Button>
                ]
            }
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
                            renderItem={(item) => <List.Item
                                style={{ justifyContent: 'left' }}>{Object.values(item as string).map(i =>
                                    <Tag>{i || 'NULL'}</Tag>)}</List.Item>}
                        />,
                    })
                })
            } />
        </Modal>
        <Card title='当前板卡配置情况' className="tm_card">
            <Tabs className="tm_tabs" defaultActiveKey="1" items={items} />
            {userUtils.isRootUser() && <Dragger
                accept=".xlsx"
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleDragger}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">请点击或拖拽到此区域上传板卡配置文件</p>
                <p className="ant-upload-hint">
                    <Button style={{ padding: 0 }} type="link" onClick={async () => {
                        try {
                            const response = await request({
                                api: {
                                    url: '/downloadPreTestConfigFileTemp',
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
                            downloadLink.download = '板卡配置模板文件.xlsx';

                            // 将 <a> 元素添加到 DOM，并模拟点击以触发下载
                            document.body.appendChild(downloadLink);
                            downloadLink.click();

                            // 下载完成后移除 <a> 元素
                            document.body.removeChild(downloadLink);

                        } catch (error) {
                            console.error('下载文件时出错：', error);
                        }
                    }}>点击此链接</Button>下载板卡配置模板文件
                </p>
            </Dragger>}
            {!userUtils.isRootUser() && <Result
                style={{ padding: 0, paddingTop: 10 }}
                title="普通用户无法配置板卡"
                extra={
                    <Button type="primary" key="console" onClick={() => {
                        navigate('/login')
                    }}>
                        使用管理员账户登录
                    </Button>
                }
            />}
        </Card>
    </div>
}

export default PreTestManager