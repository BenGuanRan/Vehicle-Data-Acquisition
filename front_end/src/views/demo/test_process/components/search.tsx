import React from 'react';
import {Input} from 'antd';

interface SearchBoxProps {
    onSearch: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({onSearch}) => {

    return (
        <Input.Search size="large" placeholder="input here" enterButton onSearch={onSearch} style={{
            width: '300px'
        }}/>
    );
};

export default SearchBox;