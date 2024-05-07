import React, {useMemo, useRef, useState} from 'react';
import './display.css'
import {Button, Form, Input, InputNumber, Result, Select, Slider, Switch, Tooltip, message} from 'antd';
import {useDrop} from 'react-dnd';
import DraggableComponent, {
    IBooleanChartExtra,
    IDraggleComponent,
    ILineChartExtra,
    INumberChartExtra
} from './DraggableComponent';
import DropContainer from './DropContainer';
import {ContentType, Method, ResponseType} from '@/apis/standard/all';
import {request} from '@/utils/request';
import {useNavigate} from 'react-router-dom';
import {SUCCESS_CODE} from '@/constants';
import GridLayout from "react-grid-layout";

export enum DragItemType {
    BOOLEAN = 'BOOLEAN',
    LINE = 'LINE',
    NUMBER = 'NUMBER'
}

export interface IDragItem {
    id: string
    type: DragItemType,
    itemConfig: {
        requestSignalId: number | null
        x: number,
        y: number,
        width: number
        height: number
        title: string
        interval: number
        trueLabel?: string
        falseLabel?: string
        unit?: string
        during?: number
        min?: number
        max?: number
        label?: string
    }
}

export interface ISignalItem {
    label: string,
    value: number,
    extra: {
        objectName: string
        collectorSignalName: string
        controllerName: string
        controllerAddress: string
        collectorName: string
        collectorAddress: string
        signalName: string
        signalUnit: string
        signalType: string
        remark: string
        innerIndex: string
    }
}

const DataDisplay: React.FC = () => {

    const [ifSendTestConfig, setIfSendTestConfig] = useState(true)
    const [ifStartGetData, setIfStartGetData] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const [dragItems, setDragItems] = useState<IDragItem[]>([])
    const [selectedDragItemId, setSelectedDragItemId] = useState<string | null>(null)
    const [signals, setSignals] = useState<ISignalItem[]>([])
    const testProcessIdRef = useRef<number | null>(null)
    const [ifSwitchLoading, setIfSwitchLoading] = useState(false)

    useMemo(() => {
        request({
            api: {
                url: '/getSendedTestConfig',
                method: Method.GET
            }
        }).then(res => {
            if (!res.data) {
                return setIfSendTestConfig(false)
            }
            // 获取用户的dashbord配置
            request({
                api: {
                    url: '/getUserTestDashbordConfig',
                    method: Method.GET
                }
            }).then(res => {
                setDragItems(res.data || [])
            })
            const data: ISignalItem[] = []
            testProcessIdRef.current = res.data?.testProcessId
            // 提取测试信号
            res.data?.testObjects.forEach(({collectorSignals, objectName}: any) => {
                collectorSignals.forEach(({
                                              collectorSignalName,
                                              signalInfo: {innerIndex, remark, signalType, signalUnit, signalName},
                                              controllerInfo: {controllerName, controllerAddress},
                                              collectorInfo: {collectorName, collectorAddress}
                                          }: any) => {
                    data.push({
                        label: `${objectName}${collectorSignalName}`,
                        value: innerIndex,
                        extra: {
                            objectName,
                            collectorSignalName,
                            controllerName,
                            controllerAddress,
                            collectorName,
                            collectorAddress,
                            signalName,
                            signalUnit,
                            signalType,
                            remark,
                            innerIndex,
                        }
                    })
                })
            })
            // 对data聚类
            const dataMap = new Map()
            data.forEach(({label, value, extra}) => {
                const dl = dataMap.get(value)
                !dl && dataMap.set(value, {label, extra})
                !!dl && dataMap.set(value, {label: `${dl.label}/${label}`, extra})
            })
            const dataRes = []
            for (const [k, v] of dataMap) {
                const {label, extra} = v
                dataRes.push({label, value: k, extra})
            }
            setSignals(dataRes)
        })
    }, [])

    const [, drop] = useDrop<{ id: string } & IDraggleComponent>({
        accept: 'box',
        drop({
                 id,
                 type,
                 draggleConfig: {defaultX, defaultY, defaultHeight, defaultWidth, defaultTitle, defaultInterval, extra}
             }) {
            if (ifStartGetData) return message.warning('请先关闭数据阀门')
            const itemConfig: IDragItem['itemConfig'] = {
                requestSignalId: null,
                x: defaultX,
                y: defaultY,
                width: defaultWidth,
                height: defaultHeight,
                title: defaultTitle,
                interval: defaultInterval,
            }
            switch (type) {
                case DragItemType.BOOLEAN:
                    itemConfig['trueLabel'] = (extra as IBooleanChartExtra).defaultTrueLabel
                    itemConfig['falseLabel'] = (extra as IBooleanChartExtra).defaultFalseLabel
                    break
                case DragItemType.NUMBER:
                    itemConfig['unit'] = (extra as INumberChartExtra).defaultUnit
                    itemConfig['min'] = (extra as INumberChartExtra).defaultMin
                    itemConfig['max'] = (extra as INumberChartExtra).defaultMax
                    break
                case DragItemType.LINE:
                    itemConfig['during'] = (extra as ILineChartExtra).defaultDuring
                    itemConfig['label'] = (extra as ILineChartExtra).defaultLabel
                    break
            }
            setDragItems([...dragItems, {
                id,
                type,
                itemConfig: {...itemConfig}
            }])
        }
    })
    drop(ref)

    function renderADDModeInfo() {
        return <>
            <DraggableComponent type={DragItemType.BOOLEAN} draggleConfig={{
                defaultTitle: '请编辑默认标题',
                defaultX: 0,
                defaultY: 0,
                defaultWidth: 100,
                defaultHeight: 100,
                defaultInterval: 1000,
                extra: {
                    defaultTrueLabel: '是',
                    defaultFalseLabel: '否',
                }
            }}/>
            <DraggableComponent type={DragItemType.NUMBER} draggleConfig={{
                defaultTitle: '请编辑默认标题',
                defaultX: 0,
                defaultY: 0,
                defaultWidth: 300,
                defaultHeight: 300,
                defaultInterval: 1000,
                extra: {
                    defaultUnit: '单位',
                    defaultMin: 0,
                    defaultMax: 100,
                }
            }}/>
            <DraggableComponent type={DragItemType.LINE} draggleConfig={{
                defaultTitle: '请编辑默认标题',
                defaultX: 0,
                defaultY: 0,
                defaultWidth: 400,
                defaultHeight: 400,
                defaultInterval: 1000,
                extra: {
                    defaultDuring: 10,  // 10s
                    defaultLabel: '数值'
                }
            }}/></>
    }

    function checkDataIntegrity() {
        const item = dragItems.filter(({itemConfig: {requestSignalId}}) => requestSignalId === null)[0]
        if (!item) return true
        setSelectedDragItemId(item.id)
        return false
    }

    const [form] = Form.useForm();

    function renderEDITModeInfo() {
        if (!selectedDragItemId) return <></>
        const selectedDragItem = dragItems.filter(({id}) => selectedDragItemId === id)[0]
        form.setFieldsValue(selectedDragItem.itemConfig)
        return <div className='dd_form_container'>
            <div className="dd_form_header">{`${{
                [DragItemType.BOOLEAN]: '布尔',
                [DragItemType.NUMBER]: '数值',
                [DragItemType.LINE]: '折线图'
            }[selectedDragItem.type]}控件编辑器`}
            </div>
            <Form
                scrollToFirstError
                disabled={ifStartGetData}
                style={{height: '100%'}}
                layout="vertical"
                form={form}
                name="control-hooks"
                onFinish={(changedValueObj) => {
                    message.success('保存成功')
                    setSelectedDragItemId(null)
                    setDragItems(dragItems.map((item) => {
                        if (item.id === selectedDragItemId) {
                            return {
                                ...item,
                                itemConfig: {...item.itemConfig, ...changedValueObj}
                            }
                        }
                        return item
                    }))

                }}
            >
                {
                    renderBase()
                }
                {
                    renderExtra(selectedDragItem.type)
                }
                {
                    !ifStartGetData
                    &&
                    <>
                        <Form.Item style={{
                            marginBottom: 5,
                            marginTop: 15,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                        }}>
                            <Button type="primary" htmlType="submit" style={{marginRight: 20}}>
                                保存
                            </Button>
                            <Button htmlType="button" onClick={() => {
                                form.setFieldsValue(selectedDragItem.itemConfig)
                            }}>
                                重置
                            </Button>
                        </Form.Item>
                        <Form.Item style={{textAlign: 'center'}}>
                            <Button style={{width: 145}} danger type="primary" onClick={() => {
                                setSelectedDragItemId(null)
                                setDragItems(dragItems.filter(({id}) => selectedDragItemId != id))
                            }}>移除该控件</Button>
                        </Form.Item>
                    </>
                }
            </Form>
        </div>
    }

    function renderBase() {
        return <>
            <Form.Item style={{marginBottom: 5}} name='requestSignalId' label='关联测试信号' rules={[{required: true}]}>
                <Select>
                    {signals.map(({label, value, extra}) => <Select.Option value={value}>
                        <Tooltip placement='left' title={
                            `
                            <测试对象名称：${extra.objectName}>
                            <卡内序号：${extra.innerIndex}>
                            <待关联信号名称：${extra.collectorSignalName}>
                            <采集器信号名称：${extra.signalName}>
                            <信号单位：${extra.signalUnit}>
                            <信号类型：${extra.signalType}>
                            <核心板卡：${extra.controllerName}>
                            <核心板卡地址：${extra.controllerAddress}>
                            <采集板卡：${extra.collectorName}>
                            <采集板卡地址：${extra.collectorAddress}>
                            <备注：${extra.remark}>
                            `
                        }>
                            {label}
                        </Tooltip>
                    </Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item style={{marginBottom: 5}} name='title' label='标题' rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item style={{marginBottom: 5}} name='width' label='宽度' rules={[{required: true}]}>
                <Slider min={50} max={1000} onChange={(value) => {
                    setDragItems(dragItems.map((item) => {
                        if (item.id === selectedDragItemId) {
                            return {
                                ...item,
                                itemConfig: {...item.itemConfig, width: value}
                            }
                        }
                        return item
                    }))

                }}/>
            </Form.Item>
            <Form.Item style={{marginBottom: 5}} name='height' label='高度' rules={[{required: true}]}>
                <Slider min={50} max={1000} onChange={(value) => {
                    setDragItems(dragItems.map((item) => {
                        if (item.id === selectedDragItemId) {
                            return {
                                ...item,
                                itemConfig: {...item.itemConfig, height: value}
                            }
                        }
                        return item
                    }))
                }}/>
            </Form.Item>
            <Form.Item style={{marginBottom: 5}} name='interval' label='刷新间隔（ms）' rules={[{required: true}]}>
                <InputNumber min={100} max={100000}/>
            </Form.Item>
        </>
    }

    function renderExtra(type: DragItemType) {
        switch (type) {
            case DragItemType.BOOLEAN:
                return <>
                    <Form.Item style={{marginBottom: 5}} name='trueLabel' label='真值标签' rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item style={{marginBottom: 5}} name='falseLabel' label='假值标签' rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                </>
            case DragItemType.NUMBER:
                return <>
                    <Form.Item style={{marginBottom: 5}} name='unit' label='单位' rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item style={{marginBottom: 5}} name='min' label='最小值' rules={[{required: true}]}>
                        <InputNumber step={10}/>
                    </Form.Item>
                    <Form.Item style={{marginBottom: 5}} name='max' label='最大值' rules={[{required: true}]}>
                        <InputNumber step={10}/>
                    </Form.Item>
                </>
            case DragItemType.LINE:
                return <>
                    <Form.Item style={{marginBottom: 5}} name='label' label='数值标签' rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item style={{marginBottom: 5}} name='during' label='数据保留周期（s）'
                               rules={[{required: true}]}>
                        <InputNumber min={1} max={24 * 60 * 60}/>
                    </Form.Item>
                </>
        }

    }

    const navigate = useNavigate()

    function renderUnsendPage() {
        return <Result
            style={{marginTop: '10%'}}
            title="检测到您并未下发测试配置文件！"
            extra={
                <Button type="primary" key="console" onClick={() => navigate('/process-management')}>
                    前往下发测试配置
                </Button>
            }
        />
    }

    function updateItemsByLayout(newItem: GridLayout.Layout) {
        setDragItems(dragItems.map((item) => {
            if (item.id === newItem.i) {
                //更新了
                console.log("更新id为", newItem.i, "的控件")
                console.log('更新为', newItem)
                return {
                    ...item,
                    itemConfig: {
                        ...item.itemConfig,
                        width: newItem.w * 30,
                        height: newItem.h * 30,
                        x: newItem.x,
                        y: newItem.y
                    }
                }
            }
            return item
        }))
    }

    function renderSendedPage() {
        return (<div className='dd_container' style={{
                backgroundColor: ifStartGetData ? '#fff' : '#f8f8f8',
                backgroundImage: ifStartGetData ? 'none' : 'linear-gradient(#e2e2e2 1px, transparent 1px), linear-gradient(90deg, #e2e2e2 1px, transparent 1px)'
            }}>
                < div className="dd_header">
                    数据阀门：<Switch checkedChildren="开启" loading={ifSwitchLoading} unCheckedChildren="关闭"
                                     checked={ifStartGetData} defaultChecked onChange={(value) => {
                    // 校验是否全部进行数据关联
                    if (checkDataIntegrity()) {
                        value && setIfSwitchLoading(true)

                        // 保存当前测试配置
                        value && request({
                            api: {
                                method: Method.POST,
                                url: '/sendTestConfig',
                                format: ContentType.JSON,
                            },
                            params: {
                                testProcessId: Number(testProcessIdRef.current),
                                dashbordConfig: dragItems
                            }
                        }).then(res => {
                            if (res.code === SUCCESS_CODE) {
                                setIfStartGetData(true)
                                message.success('已开启数据阀门')
                            } else {
                                message.error(res.msg)
                            }
                            setIfSwitchLoading(false)
                        })
                        !value && setIfStartGetData(false)
                        !value && message.success('已关闭数据阀门')
                    } else {
                        return message.error('存在未关联的信号，无法开启数据阀门！')
                    }
                }
                }/>
                    <Button style={{marginLeft: 40}} type='primary' onClick={
                        async () => {
                            try {
                                const response = await request({
                                    api: {
                                        url: '/downloadUserSendedTestProcessConfig',
                                        method: Method.GET,
                                        responseType: ResponseType.ARRAY_BUFFER,
                                        format: ContentType.FILE
                                    }
                                })
                                if (response.byteLength === 0) return message.error('该用户暂未下发配置文件')
                                // const response = await fetch('http://localhost:3000/api/downloadPreTestConfigFile')
                                // 将二进制ArrayBuffer转换成Blob
                                const blob = new Blob([response], {type: ContentType.FILE})

                                //  创建一个 <a> 元素，并设置其属性
                                const downloadLink = document.createElement('a');
                                downloadLink.href = window.URL.createObjectURL(blob);
                                downloadLink.download = '已下发的配置文件.xlsx';

                                // 将 <a> 元素添加到 DOM，并模拟点击以触发下载
                                document.body.appendChild(downloadLink);
                                downloadLink.click();

                                // 下载完成后移除 <a> 元素
                                document.body.removeChild(downloadLink);

                            } catch (error) {
                                console.error('下载文件时出错：', error);
                            }
                        }
                    }>下载当前已下发的测试配置文件</Button>
                </div>
                <div className="dd_body">
                    <div className="dd_drop_container" ref={ref}>
                        <DropContainer ifStartGetData={ifStartGetData} selectedItemId={selectedDragItemId}
                                       selectFunc={setSelectedDragItemId} items={dragItems}
                                       onUpdateItems={updateItemsByLayout}/>
                    </div>
                    <div className="dd_info">
                        {selectedDragItemId ? renderEDITModeInfo() : renderADDModeInfo()}
                    </div>
                </div>
            </div>


        );
    }

    return <>
        {ifSendTestConfig ? renderSendedPage() : renderUnsendPage()}
    </>
};

export default DataDisplay;
