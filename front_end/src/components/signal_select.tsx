import {Select} from 'antd';

const onChange = (value: string) => {
    console.log(`selected ${value}`);
};

// Filter `option.label` match the user type `input`
const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


export const BoardSelect = ({title, options}: { title: string, options: [] }) => {

    // @ts-ignore
    options = [
        {
            value: 'jack',
            label: 'Jack',
        },
        {
            value: 'lucy',
            label: 'Lucy',
        },
        {
            value: 'tom',
            label: 'Tom',
        },
    ]

    return <div>
        <h1>{title}</h1>
        <Select
            showSearch
            placeholder="请选择"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={filterOption}
            options={options}
        />
    </div>
};