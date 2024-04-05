import React, {useEffect, useRef, useState} from "react";
import {Button, Form, FormInstance, Input, Modal, Select} from "antd";
import {center_children, full} from "@/constants/css.tsx";
import '@antv/x6-react-shape'
import {data} from "@/views/demo/topology/data.ts";
import {useForm} from "antd/es/form/Form";
import G6 from '@antv/g6';
import {Graph} from "@antv/g6-pc";
import {GraphOptions} from "@antv/g6-core";

const graphConfig: GraphOptions = {
    container: '',
    width: 800,
    height: 600,
    layout: {
        type: 'dagre',
    },
    defaultNode: {
        type: 'rect',
        width: 100,
        height: 40,
        style: {
            stroke: '#eaff8f',
            lineWidth: 5,
        },
    },
}

const PhyTopology: React.FC = () => {
    const hasInit = useRef(false)
    const container = useRef<HTMLDivElement>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nodeData, setNodeData] = useState(data)
    let graph: Graph

    useEffect(() => {
        graphConfig.container = container.current!
        graph = new G6.Graph(graphConfig)
        graph.data(nodeData)
        graph.render();
        hasInit.current = true
    }, [nodeData])

    const onAddConfig = () => {
        setIsModalOpen(true)
    }

    return (
        <div style={{
            ...full,
            ...center_children,
            overflow: 'auto',
            flexDirection: 'column',
        }}>
            <div ref={container} id={"topology"} className="x6-graph" style={{
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
            }}></div>

            <Button style={{
                position: 'absolute',
                right: '10%',
                bottom: '10%',
            }} onClick={() => {
                onAddConfig()
            }}>添加配置</Button>

            <AddTable isShow={isModalOpen} handleOk={(form) => {
                //把点添加到node里面，并且设置边
                const node = form.getFieldsValue()

                data.nodes.push({
                    id: `${data.nodes.length + 1}`,
                    label: node.name,
                })
                data.edges.push({
                    source: node.parent,
                    target: `${data.nodes.length}`,
                })


                setNodeData({
                    nodes: data.nodes,
                    edges: data.edges,
                })
                setIsModalOpen(false)
            }} handleCancel={() => {
                setIsModalOpen(false)
            }}/>
        </div>
    );
}

interface AddTableProps {
    isShow: boolean,
    handleOk: (form: FormInstance) => void,
    handleCancel: () => void
}

//Table
//传入isShow属性，控制是否显示
const AddTable: React.FC<AddTableProps> = ({isShow, handleOk, handleCancel}) => {
    const [form] = useForm()

    return (
        <>
            <Modal title="Basic Modal" open={isShow} onOk={() => {
                handleOk(form)
            }} onCancel={handleCancel}>
                <Form form={form}>
                    <Form.Item label="配置名称" name={"name"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="配置内容" name={"content"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="父节点" name={"parent"}>
                        <Select>
                            {data.nodes.map((node) => {
                                return <Select.Option key={node.id} value={node.id}>{node.label}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}


export default PhyTopology;