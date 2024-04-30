import React, { useRef, useState } from 'react';
import './display.css'
import { Button, Form, Input, InputNumber, Select, Slider, Space, Switch, message } from 'antd';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableComponent, { IBooleanChartExtra, IDraggleComponent, ILineChartExtra, INumberChartExtra } from './DraggableComponent';
import DropContainer from './DropContainer';
import BooleanChart from '@/components/Charts/BooleanChart';
import { CloseOutlined } from '@ant-design/icons';
import { center } from '@antv/g2plot/lib/plots/sankey/sankey';

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
    }
}

const DataDisplay: React.FC = () => {

    const [ifStartGetData, setIfStartGetData] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const [dragItems, setDragItems] = useState<IDragItem[]>([])
    const [selectedDragItemId, setSelectedDragItemId] = useState<string | null>(null)

    const [, drop] = useDrop<{ id: string } & IDraggleComponent>({
        accept: 'box',
        drop({ id, type, draggleConfig: { defaultHeight, defaultWidth, defaultTitle, defaultInterval, extra } }) {
            if (ifStartGetData) return message.warning('请先关闭数据阀门')
            const itemConfig: IDragItem['itemConfig'] = {
                requestSignalId: null,
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
                    break
            }
            setDragItems([...dragItems, {
                id,
                type,
                itemConfig: { ...itemConfig }
            }])
        }
    })
    drop(ref)

    function renderADDModeInfo() {
        return <>
            <DraggableComponent type={DragItemType.BOOLEAN} draggleConfig={{
                defaultTitle: '请编辑默认标题',
                defaultWidth: 100,
                defaultHeight: 100,
                defaultInterval: 1000,
                extra: {
                    defaultTrueLabel: '是',
                    defaultFalseLabel: '否',
                }
            }} />
            <DraggableComponent type={DragItemType.NUMBER} draggleConfig={{
                defaultTitle: '请编辑默认标题',
                defaultWidth: 300,
                defaultHeight: 300,
                defaultInterval: 1000,
                extra: {
                    defaultUnit: '单位',
                    defaultMin: 0,
                    defaultMax: 100,
                }
            }} />
            <DraggableComponent type={DragItemType.LINE} draggleConfig={{
                defaultTitle: '请编辑默认标题',
                defaultWidth: 400,
                defaultHeight: 400,
                defaultInterval: 1000,
                extra: {
                    defaultDuring: 24 * 60 * 60  // 一天
                }
            }} /></>
    }

    function checkDataIntegrity() {
        const item = dragItems.filter(({ itemConfig: { requestSignalId } }) => requestSignalId === null)[0]
        if (!item) return true
        setSelectedDragItemId(item.id)
        return false
    }

    const [form] = Form.useForm();

    function renderEDITModeInfo() {
        if (!selectedDragItemId) return <></>
        const selectedDragItem = dragItems.filter(({ id }) => selectedDragItemId === id)[0]
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
                style={{ height: '100%' }}
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
                                itemConfig: { ...item.itemConfig, ...changedValueObj }
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
                        <Form.Item style={{ marginBottom: 5, marginTop: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} >
                            <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>
                                保存
                            </Button>
                            <Button htmlType="button" onClick={() => { form.setFieldsValue(selectedDragItem.itemConfig) }}>
                                重置
                            </Button>
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button style={{ width: 145 }} danger type="primary" onClick={() => {
                                setSelectedDragItemId(null)
                                setDragItems(dragItems.filter(({ id }) => selectedDragItemId != id))
                            }}>移除该控件</Button>
                        </Form.Item>
                    </>
                }
            </Form >
        </div >
    }

    function renderBase() {
        return <>
            <Form.Item style={{ marginBottom: 5 }} name='requestSignalId' label='关联测试信号' rules={[{ required: true }]} >
                <Select
                    options={[
                        { value: 1, label: '速度' },
                        { value: 2, label: '里程' },
                        { value: 3, label: '经度' },
                        { value: 4, label: '纬度' }
                    ]}
                />
            </Form.Item>
            <Form.Item style={{ marginBottom: 5 }} name='title' label='标题' rules={[{ required: true }]} >
                <Input />
            </Form.Item>
            <Form.Item style={{ marginBottom: 5 }} name='width' label='宽度' rules={[{ required: true }]} >
                <Slider min={50} max={1000} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 5 }} name='height' label='高度' rules={[{ required: true }]} >
                <Slider min={50} max={1000} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 5 }} name='interval' label='刷新间隔（ms）' rules={[{ required: true }]} >
                <InputNumber min={100} max={100000} />
            </Form.Item>
        </>
    }

    function renderExtra(type: DragItemType) {
        switch (type) {
            case DragItemType.BOOLEAN:
                return <>
                    <Form.Item style={{ marginBottom: 5 }} name='trueLabel' label='真值标签' rules={[{ required: true }]} >
                        <Input />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 5 }} name='falseLabel' label='假值标签' rules={[{ required: true }]} >
                        <Input />
                    </Form.Item>
                </>
            case DragItemType.NUMBER:
                return <>
                    <Form.Item style={{ marginBottom: 5 }} name='unit' label='单位' rules={[{ required: true }]} >
                        <Input />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 5 }} name='min' label='最小值' rules={[{ required: true }]} >
                        <InputNumber step={10} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 5 }} name='max' label='最大值' rules={[{ required: true }]} >
                        <InputNumber step={10} />
                    </Form.Item>
                </>
            case DragItemType.LINE:
                return <Form.Item style={{ marginBottom: 5 }} name='during' label='数据保留周期（s）' rules={[{ required: true }]} >
                    <InputNumber min={1} max={24 * 3600} />
                </Form.Item>
        }

    }

    return (<div className='dd_container' style={{
        backgroundColor: ifStartGetData ? '#fff' : '#f8f8f8', backgroundImage: ifStartGetData ? 'none' : 'linear-gradient(#e2e2e2 1px, transparent 1px), linear-gradient(90deg, #e2e2e2 1px, transparent 1px)'
    }}>
        < div className="dd_header" >
            数据阀门：<Switch checkedChildren="开启" unCheckedChildren="关闭" checked={ifStartGetData} defaultChecked onChange={() => {
                // 校验是否全部进行数据关联
                if (checkDataIntegrity()) {
                    return setIfStartGetData(!ifStartGetData)
                } return message.error('存在未关联的信号，无法开启数据阀门！')
            }} />
        </div >
        <div className="dd_body">
            <div className="dd_drop_container" ref={ref}>
                <DropContainer ifStartGetData={ifStartGetData} selectedItemId={selectedDragItemId} selectFunc={setSelectedDragItemId} items={dragItems} />
            </div>
            <div className="dd_info">
                {selectedDragItemId ? renderEDITModeInfo() : renderADDModeInfo()}
            </div>
        </div>
    </div >


    );
};

export default DataDisplay;
