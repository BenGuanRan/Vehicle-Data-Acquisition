
export const data = {
    nodes: [
        //主控制模块
        {
            id: '1',
            x: 40,
            y: 40,
            width: 100,
            height: 40,
            label: '主控制模块',
            shape: 'rect',
            attrs: {
                body: {
                    fill: '#2ECC71',
                    stroke: '#000',
                    strokeWidth: 1,
                },
                label: {
                    fill: '#000',
                    fontSize: 14,
                },
            },
        },
        //从控制模块
        {
            id: '2',
            x: 40,
            y: 120,
            width: 100,
            height: 40,
            label: '从控制模块',
            shape: 'rect',
            attrs: {
                body: {
                    fill: '#3498DB',
                    stroke: '#000',
                    strokeWidth: 1,
                },
                label: {
                    fill: '#000',
                    fontSize: 14,
                },
            },
        },
        //采集单元1-1
        {
            id: '3',
            x: 40,
            y: 200,
            width: 100,
            height: 40,
            label: '采集单元1-1',
            shape: 'rect',
            attrs: {
                body: {
                    fill: '#F1C40F',
                    stroke: '#000',
                    strokeWidth: 1,
                },
                label: {
                    fill: '#000',
                    fontSize: 14,
                },
            },
        },
        //采集单元1-2
        {
            id: '4',
            x: 40,
            y: 280,
            width: 100,
            height: 40,
            label: '采集单元1-2',
            shape: 'rect',
            attrs: {
                body: {
                    fill: '#F1C40F',
                    stroke: '#000',
                    strokeWidth: 1,
                },
                label: {
                    fill: '#000',
                    fontSize: 14,
                },
            },
        },
        //采集单元2-1
        {
            id: '5',
            x: 40,
            y: 360,
            width: 100,
            height: 40,
            label: '采集单元2-1',
            shape: 'rect',
            attrs: {
                body: {
                    fill: '#F1C40F',
                    stroke: '#000',
                    strokeWidth: 1,
                },
                label: {
                    fill: '#000',
                    fontSize: 14,
                },
            },
        },
    ],
    // 边
    edges: [
        //主控到从控
        {
            source: '1',
            target: '2',
            attrs: {
                line: {
                    stroke: '#000',
                    strokeWidth: 1,
                },
            },
        },
        //从控到采集1-1
        {
            source: '1',
            target: '3',
            attrs: {
                line: {
                    stroke: '#000',
                    strokeWidth: 1,
                },
            },
        },
        {
            source: '1',
            target: '4',
            vertices: [
                {x: 40, y: 320},
                {x: 40, y: 280},
            ],
            attrs: {
                line: {
                    stroke: '#000',
                    strokeWidth: 1,
                },
            },
        },
        {
            source: '2',
            target: '5',
            attrs: {
                line: {
                    stroke: '#000',
                    strokeWidth: 1,
                },
            },
        },
    ],
};