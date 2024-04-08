import React, {useEffect} from "react";
import {Button, Flex, Input, Table, TableProps} from "antd";
import './test_process.css';
import {useNavigate} from "react-router-dom";
import {deleteTest, getTestList} from "@/apis/request/test.ts";

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
    }
];

const TestProcessPage: React.FC = () => {
    const navigate = useNavigate();
    const [dataList, setDataList] = React.useState([] as TestItem[]);

    const onDelete = (id: string) => {
        deleteTest(id).then(() => {
            setDataList(dataList.filter((item) => item.id !== id));
        });
    }

    const onEdit = (id: string) => {
        navigate(`/process-management/edit/${id}`, {state: {id}});
    }

    const onShow = (id: string) => {
        navigate(`/process-management/show/${id}`);
    }

    columns[columns.length - 1].render = (_, record) => (
        <div>
            <Button type="link" onClick={() => onEdit(record.id)}>编辑</Button>
            <Button type="link" onClick={() => {
                onShow(record.id)
            }}>详情</Button>
            <Button type="link" onClick={() => {
                onDelete(record.id)
            }}>删除</Button>
        </div>
    );


    useEffect(() => {
        console.log('get data')
        getTestList({}).then((res) => {
            setDataList(res['list'])
        });
    }, []);

    const onSearch = (value: string) => {
        if (!value || value == '') {
            getTestList({}).then((res) => {
                setDataList(res['list'])
            });
            return;
        }
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
                <Input.Search size={"large"}
                              placeholder="搜索测试流程"
                              onSearch={onSearch}
                              style={{width: '50%'}}
                              enterButton
                ></Input.Search>

                <Button type="primary" onClick={() => {
                    navigate('/process-management/edit/0');
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