const defaultSize = {
    width: 100,
    height: 40,
    shape: 'rect',
};

class ItemTypeEnum {
    static MAIN_CONTROL = '1';
    static SUB_CONTROL = '2';
    static COLLECT_UNIT = '3';
}

interface ItemType {
    id: string;
    type: ItemTypeEnum;
    label: string;
    width: number;
    height: number;
    shape: string;
    children?: string[];
}

const initDataSource: ItemType[] = [
    {
        id: '1',
        type: ItemTypeEnum.MAIN_CONTROL,
        label: '主控制模块',
        ...defaultSize,
        children: ['2', '3', '4'],
    },
    {
        id: '2',
        type: ItemTypeEnum.SUB_CONTROL,
        label: '从控制模块',
        ...defaultSize,
        children: ['5'],
    },
    {
        id: '3',
        type: ItemTypeEnum.COLLECT_UNIT,
        label: '采集单元1-1',
        ...defaultSize,
    },
    {
        id: '4',
        type: ItemTypeEnum.COLLECT_UNIT,
        label: '采集单元1-2',
        ...defaultSize,
    },
];

export const data = {
    nodes: initDataSource.map(item => {
        return {
            id: item.id,
            label: item.label,
            x: 40,
            y: 40 + initDataSource.indexOf(item) * 80,
            shape: item.shape,
            width: item.width,
            height: item.height,
            attrs: {
                body: {
                    fill: item.type === ItemTypeEnum.MAIN_CONTROL ? '#2ECC71' : item.type === ItemTypeEnum.SUB_CONTROL ? '#3498DB' : '#F1C40F',
                    stroke: '#000',
                    strokeWidth: 1,
                },
                label: {
                    fill: '#000',
                    fontSize: 14,
                },
            },
        };
    }),
    //根据initDataSource中的children字段生成edges:
    edges: initDataSource.map(item => {
        if (item.children) {
            return item.children.map(child => {
                return {
                    source: item.id,
                    target: child,
                };
            });
        }
        return [];
    }).flat(),
};
