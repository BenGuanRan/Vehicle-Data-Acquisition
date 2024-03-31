import ProcessDetail from "@/views/demo/test_process/detail/process_detail.tsx";
import React, {useEffect} from "react";
import {Graph} from "@antv/x6";
import {data} from "@/views/demo/topology/data.ts";


const ProcessShow: React.FC = () => {

    const container = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        const graph = new Graph({
            container: container.current!,
            grid: true,
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
            panning: {
                enabled: true,
                eventTypes: ['leftMouseDown'],
            }
        })
        graph.fromJSON(data)
    }, []);

    return (
        <ProcessDetail>
            <div ref={container} style={{
                flex: 1,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            </div>
        </ProcessDetail>
    );
}

export default ProcessShow;