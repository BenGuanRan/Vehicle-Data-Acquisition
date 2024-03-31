import ProcessDetail from "@/views/demo/test_process/detail/process_detail.tsx";
import React, {useEffect} from "react";
import {Graph} from "@antv/x6";
import {data} from "./data.ts";

const ProcessEdit = () => {

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
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div ref={container} style={{
                    flex: 1,
                    width: '30%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRight: '1px solid black',
                }}>
                </div>

                <div style={{
                    flex: 2,
                    width: '70%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <p>编辑区</p>

                </div>

            </div>
        </ProcessDetail>
    );
}
export default ProcessEdit;