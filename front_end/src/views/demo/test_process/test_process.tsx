import React, {useEffect} from "react";
import {Button, Flex, Table, TableProps} from "antd";
import './test_process.css';
import SearchBox from "@/views/demo/test_process/components/search.tsx";
import {useNavigate} from "react-router-dom";
import '../../../mock/mockApi.ts'
import axios from "axios";

export interface TestItem {
    key: string;
    id: string;
    title: string;
    equipment_number: string;
    equipment_category: string;
    test_parameter: string;
    status: string;
    create_at: string;
}


const Operation: React.FC = () => {
    const navigate = useNavigate();
    const onEdit = () => {
        navigate('/process-management/edit');
    }
    const onDelete = () => {
        console.log('delete');
    }
    const onDetail = () => {
        navigate('/process-management/show');
    }
    const onDownload = () => {
        console.log('download');
    }
    return (
        <Flex style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around'
        }
        }>
            <Button type="primary" onClick={onEdit}>编辑</Button>
            <Button type="primary" onClick={onDelete}>删除</Button>
            <Button type="primary" onClick={onDetail}>查看</Button>
            <Button type="primary" onClick={onDownload}>下载</Button>
        </Flex>
    );
}

const columns: TableProps<TestItem>['columns'] = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '测试名称',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '设备编号',
        dataIndex: 'equipment_number',
        key: 'equipment_number',
    },
    {
        title: '设备类别',
        dataIndex: 'equipment_category',
        key: 'equipment_category',
    },
    {
        title: '测试参数',
        dataIndex: 'test_parameter',
        key: 'test_parameter',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '创建日期',
        dataIndex: 'create_at',
        key: 'create_at',
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => <Operation key={record.id}/>,
    }
];

const TestProcessPage: React.FC = () => {

    const navigate = useNavigate();
    //使用mock模拟数据，并且将数据存储在dataSource中
    const [dataList, setDataList] = React.useState([] as TestItem[]);

    useEffect(() => {
        console.log('get data')
        axios.get('api/test').then((res) => {
            setDataList(res.data['list'])
        })
    }, []);

    const onSearch = (value: string) => {
        const newData = dataList.filter((item) => {
            return item.title.includes(value);
        });
        setDataList(newData);
    }

    return (
        <Flex id={"process_page"} flex={1} align={"start"} vertical={true}>
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <SearchBox onSearch={onSearch}/>
                <Button type="primary" onClick={() => {
                    navigate('/process-management/edit');
                }}>新建测试流程</Button>
            </div>
            <Table id={"process_table"} dataSource={dataList} columns={columns}
                   style={{width: '100%'}}
                   pagination={{pageSize: 7, hideOnSinglePage: true}}
            />
        </Flex>
    );
}

export default TestProcessPage;