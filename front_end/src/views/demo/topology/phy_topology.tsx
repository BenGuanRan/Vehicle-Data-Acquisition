import React, {useEffect, useRef} from "react";
import {Button} from "antd";
import {center_children, full} from "@/constants/css.tsx";
import '@antv/x6-react-shape'
import {Portal} from "@antv/x6-react-shape";
import {Graph} from "@antv/x6";
import {data} from "@/views/demo/topology/data.ts";

const X6ReactPoralProvider = Portal.getProvider();

const PhyTopology: React.FC = () => {
    const container = useRef<HTMLDivElement>(null)


    useEffect(() => {
        const graph = new Graph({
            container: container.current!,
            grid: true,
            width: 800,
            height: 600,
            connecting: {
                snap: true,
                allowBlank: false,
                allowLoop: false,
                highlight: true,
                connector: {
                    name: 'rounded',
                },
            },
            highlighting: {
                magnetAvailable: {
                    name: 'stroke',
                    args: {
                        padding: 4,
                        attrs: {
                            strokeWidth: 4,
                            stroke: '#31d0c6',
                        },
                    },
                },
            },
            embedding: {
                enabled: true,
            },
        })
        graph.fromJSON(data)
    }, [])

    return (
        <div style={{
            ...full,
            ...center_children,
            overflow: 'auto',
            flexDirection: 'column',
        }}>
            <X6ReactPoralProvider/>
            <div ref={container} id={"topology"} className="x6-graph" style={{
                width: '90%',
                height: '70%',
                display: 'flex',
            }}></div>
            <Button style={{
                position: 'absolute',
                right: '10%',
                bottom: '10%',
            }} onClick={() => {
                console.log('click')
            }}>添加配置
            </Button>

        </div>
    );
}

export default PhyTopology;