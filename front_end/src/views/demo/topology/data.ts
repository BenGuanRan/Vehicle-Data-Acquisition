export const data = {
    nodes: [
        //主控制模块
        {
            id: '1',
            label: '主控制模块',
        },
        //从控制模块
        {
            id: '2',
            label: '从控制模块',
        },
        //采集单元1-1
        {
            id: '3',
            label: '采集单元1-1',
        },
        //采集单元1-2
        {
            id: '4',
            label: '采集单元1-2',
        },
        //采集单元2-1
        {
            id: '5',
            label: '采集单元2-1',

        },
    ],
    // 边
    edges: [
        //主控到从控
        {
            source: '1',
            target: '2',
        },
        //从控到采集1-1
        {
            source: '1',
            target: '3',
        },
        {
            source: '1',
            target: '4',
        },
        {
            source: '2',
            target: '5',
        },
    ],
};