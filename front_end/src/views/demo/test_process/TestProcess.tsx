import React, {useEffect} from "react";
import {Button, Flex, Input, Table, TableProps} from "antd";
import './TestProcess.css';
import {deleteTest, getTestList} from "@/apis/request/test.ts";
import {CreateTest} from "@/views/demo/test_process/test_modal/CreateTest.tsx";
import {CreateTestContext, CreateTestFunctions} from "@/views/demo/test_process/test_modal/CreateTestFunction.ts";
import {SUCCESS_CODE} from "@/constants";
import {ITestProcess} from "@/apis/standard/test.ts";

export interface TestItem {
    id: string;
    testName: string;
    createAt: string;
    update: string;
}

interface ModalData {
    open: boolean;
    mode: "create" | "edit" | "show";
    testId?: string;
}

const columns: TableProps<TestItem>['columns'] = [
    {
        title: '测试流程名称',
        dataIndex: 'testName',
        key: 'testName',
        render: (value) => {
            if (!value) return <p>默认名称</p>
            return <p>{value}</p>
        }
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value) => {
            return <p>{new Date(value).toLocaleString()}</p>
        }
    },
    {
        title: '上次修改时间',
        dataIndex: 'updatedAt',
        key: 'updateAt',
        render: (value) => {
            return <p>{new Date(value).toLocaleString()}</p>
        }
    },
    {
        title: '操作',
        key: 'action',
    },
];

const TestProcessPage: React.FC = () => {
    const createTestContext = CreateTestFunctions()

    const [dataList, setDataList] = React.useState([] as TestItem[]);
    const [total, setTotal] = React.useState(0);
    const [modalData, setModalData] = React.useState<ModalData>({
        open: false,
        mode: "create"
    });


    useEffect(() => {
        getTestList(1).then((response) => {
            setDataList(response.data.list);
            setTotal(response.data.total);
        });
    }, []);

    const onCreateTest = () => {
        setModalData({
            open: true,
            mode: "create"
        });
    }

    const onDelete = (id: string) => {
        if (prompt("请输入delete确认") !== "delete") return;
        deleteTest(id).then((response) => {
            if (response.code !== SUCCESS_CODE) {
                alert("删除失败" + response.msg);
                return;
            }
            setDataList(dataList.filter(item => item.id !== id));
        });
    }

    const onShowDetail = (id: string) => {
        setModalData({
            open: true,
            mode: "show",
            testId: id
        });
    }

    const onEdit = (id: string) => {
        setModalData({
            open: true,
            mode: "edit",
            testId: id
        });
    }


    columns[columns.length - 1].render = (_, record) => (
        <div>
            <Button type={"link"} onClick={() => onEdit(record.id)}>编辑</Button>
            <Button type={"link"} onClick={() => {
                onShowDetail(record.id)
            }}>详情</Button>
            <Button type={"link"} onClick={() => {
                onDelete(record.id)
            }}>删除</Button>
        </div>
    );

    return (
        <Flex id={"process_page"} flex={1} align={"start"} vertical={true}>
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <Input.Search size={"large"}
                              placeholder="搜索测试流程"
                              onSearch={() => {
                              }}
                              style={{width: '50%'}}
                              enterButton
                ></Input.Search>
                <Button type="primary" onClick={onCreateTest}>新建测试流程</Button>
            </div>
            <Table id={"process_table"} dataSource={dataList} columns={columns} style={{width: '100%'}}
                   pagination={{pageSize: 7, hideOnSinglePage: true, total: total}}
                   rowKey={(record) => record.id}
                   onChange={(pagination) => {
                       getTestList(pagination.current!).then((response) => {
                           setDataList(response.data.list);
                       });
                   }}
            />

            <CreateTestContext.Provider value={createTestContext}>
                <CreateTest open={modalData.open}
                            mode={modalData.mode}
                            onFinished={(newTest?: ITestProcess) => {
                                if (!newTest) {
                                    setModalData({
                                        open: false,
                                        mode: "create"
                                    });
                                    return;
                                }
                                dataList.push({
                                    id: newTest.testName,
                                    testName: newTest.testName,
                                    createAt: new Date().toLocaleString(),
                                    update: new Date().toLocaleString()
                                })
                            }}
                            testId={modalData.testId}
                />
            </CreateTestContext.Provider>
        </Flex>
    );
}

export default TestProcessPage;