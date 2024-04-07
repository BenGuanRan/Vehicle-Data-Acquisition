export interface Option {
    value: string | number;
    label: string;
    children?: Option[];
}

export const targetOptions: Option[] = [
    {
        value: 'car',
        label: '汽车',
        children: [
            {
                value: 'bmw',
                label: '宝马',
                children: [
                    {
                        value: 'bmw1',
                        label: '宝马1系',
                    },
                    {
                        value: 'bmw2',
                        label: '宝马2系',
                    },
                ],
            },
            {
                value: 'audi',
                label: '奥迪',
                children: [
                    {
                        value: 'audi1',
                        label: '奥迪1系',
                    },
                    {
                        value: 'audi2',
                        label: '奥迪2系',
                    },
                ],
            },
        ],
    },
    {
        value: 'off-road',
        label: '越野车',
        children: [
            {
                value: 'jeep',
                label: '吉普',
                children: [
                    {
                        value: 'jeep1',
                        label: '吉普1系',

                    },
                    {
                        value: 'jeep2',
                        label: '吉普2系',
                    },
                ],
            },
            {
                value: 'land-rover',
                label: '路虎',
                children: [
                    {
                        value: 'land-rover1',
                        label: '路虎1系',
                    },
                    {
                        value: 'land-rover2',
                        label: '路虎2系',
                    },
                ],
            },
        ],
    },
];


//指标选项包括：速度、油耗、价格、空间
export const indexOptions: Option[] = [
    {
        value: 'speed',
        label: '速度',
    },
    {
        value: 'oil-consumption',
        label: '油耗',
    },
    {
        value: 'price',
        label: '价格',
    },
    {
        value: 'space',
        label: '空间',
    },
];