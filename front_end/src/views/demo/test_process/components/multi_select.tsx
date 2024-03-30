import React from 'react';
import {Cascader} from 'antd';

const {SHOW_CHILD} = Cascader;

interface Option {
    value: string | number;
    label: string;
    children?: Option[];
}

const options: Option[] = [
    {
        label: 'Light',
        value: 'light',
        children: new Array(20)
            .fill(null)
            .map((_, index) => ({label: `Number ${index}`, value: index})),
    },
    {
        label: 'Bamboo',
        value: 'bamboo',
        children: [
            {
                label: 'Little',
                value: 'little',
                children: [
                    {
                        label: 'Toy Fish',
                        value: 'fish',
                    },
                    {
                        label: 'Toy Cards',
                        value: 'cards',
                    },
                    {
                        label: 'Toy Bird',
                        value: 'bird',
                    },
                ],
            },
        ],
    },
];

const MultiSelect: React.FC = () => {
    return (
        <>
            <Cascader
                style={{width: '100%'}}
                options={options}
                onChange={(_, selectedOptions) => {
                    console.log(selectedOptions)
                }}
                multiple
                maxTagCount="responsive"
                showCheckedStrategy={SHOW_CHILD}
                defaultValue={[]}
            />
        </>
    );
};

export default MultiSelect;