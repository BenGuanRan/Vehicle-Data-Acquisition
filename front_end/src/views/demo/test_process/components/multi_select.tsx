import React from 'react';
import {Cascader} from 'antd';
import {Option} from "@/views/demo/test_process/components/muti_select_data.ts";

const {SHOW_CHILD} = Cascader;


const MultiSelect: React.FC<{ options: Option[] }> = ({options}: { options: Option[] }) => {
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
                variant={'filled'}
            />
        </>
    );
};

export default MultiSelect;