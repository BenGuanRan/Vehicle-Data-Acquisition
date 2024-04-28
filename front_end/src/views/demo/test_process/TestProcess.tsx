import React, { useEffect } from "react";
import { Button, Flex, Input, message, Modal, Table, TableProps } from "antd";
import './TestProcess.css';
import { deleteTest, getTestList } from "@/apis/request/test.ts";
import { CreateTest } from "@/views/demo/test_process/test_modal/CreateTest.tsx";
import { CreateTestContext, CreateTestFunctions } from "@/views/demo/test_process/test_modal/CreateTestFunction.ts";
import { SUCCESS_CODE } from "@/constants";
import { ITestProcess } from "@/apis/standard/test.ts";
import { request } from "@/utils/request";
import { ContentType, Method, ResponseType } from "@/apis/standard/all";
import { v4 as uuidv4 } from 'uuid';

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
    keyValue?: string;
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

    const [currentSearchValue, setCurrentSearchValue] = React.useState<string>("")
    const [dataList, setDataList] = React.useState([] as TestItem[]);
    const [total, setTotal] = React.useState(0);
    const [modalData, setModalData] = React.useState<ModalData>({
        open: false,
        mode: "create",
        keyValue: "",
    });
    const [modal, contextHolder] = Modal.useModal();


    useEffect(() => {
        refreshDataList()
    }, [currentSearchValue]);

    const onCreateTest = () => {
        setModalData({
            open: true,
            mode: "create",
            keyValue: uuidv4()
        });
    }

    const onDelete = (id: string) => {
        modal.confirm({
            title: '删除测试流程',
            content: '确定删除测试流程吗？',
            onOk: () => {
                deleteTest(id).then((response) => {
                    if (response.code !== SUCCESS_CODE) {
                        alert("删除失败" + response.msg);
                        return;
                    }
                    setDataList(dataList.filter(item => item.id !== id));
                });
            },
            onCancel: () => {
                console.log('Cancel delete object');
            },
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

    const onDownloadTestConfig = async (testName: string, id: string) => {
        try {
            const response = await request({
                api: {
                    url: '/downloadTestProcessConfigFileById',
                    method: Method.GET,
                    responseType: ResponseType.ARRAY_BUFFER,
                    format: ContentType.FILE
                },
                params: {
                    testProcessId: id
                }
            })

            // const response = await fetch('http://localhost:3000/api/downloadPreTestConfigFile')
            // 将二进制ArrayBuffer转换成Blob
            const blob = new Blob([response], { type: ContentType.FILE })

            //  创建一个 <a> 元素，并设置其属性
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = `${testName}_测试流程配置文件.xlsx`;

            // 将 <a> 元素添加到 DOM，并模拟点击以触发下载
            document.body.appendChild(downloadLink);
            downloadLink.click();

            // 下载完成后移除 <a> 元素
            document.body.removeChild(downloadLink);

        } catch (error) {
            console.error('下载文件时出错：', error);
        }
    }

    //异步刷新
    const refreshDataList = () => {
        getTestList(1, undefined, currentSearchValue).then((response) => {
            if (response.code === SUCCESS_CODE) {
                setDataList(response.data.list);
                setTotal(response.data.total);
                message.success("数据获取成功")
            }
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
            <Button type={"link"} onClick={async () => {
                onDownloadTestConfig(record.testName, record.id)
            }}>下载测试文件</Button>
        </div>
    );

    return (
        <Flex id={"process_page"} flex={1} align={"start"} vertical={true}>
            {contextHolder}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <Input.Search size={"large"}
                    placeholder="搜索测试流程"
                    onSearch={(value) => {
                        setCurrentSearchValue(value)
                    }}
                    style={{ width: '50%' }}
                    enterButton
                ></Input.Search>
                <Button type="primary" onClick={refreshDataList}>刷新列表</Button>
                <Button type="primary" onClick={onCreateTest}>新建测试流程</Button>
                <Button type="primary" onClick={async () => {
                    try {
                        const response = await request({
                            api: {
                                url: '/downloadPreTestConfigFile',
                                method: Method.GET,
                                responseType: ResponseType.ARRAY_BUFFER,
                                format: ContentType.FILE
                            }
                        })

                        // const response = await fetch('http://localhost:3000/api/downloadPreTestConfigFile')
                        // 将二进制ArrayBuffer转换成Blob
                        const blob = new Blob([response], { type: ContentType.FILE })

                        //  创建一个 <a> 元素，并设置其属性
                        const downloadLink = document.createElement('a');
                        downloadLink.href = window.URL.createObjectURL(blob);
                        downloadLink.download = '板卡配置文件.xlsx';

                        // 将 <a> 元素添加到 DOM，并模拟点击以触发下载
                        document.body.appendChild(downloadLink);
                        downloadLink.click();

                        // 下载完成后移除 <a> 元素
                        document.body.removeChild(downloadLink);

                    } catch (error) {
                        console.error('下载文件时出错：', error);
                    }
                }}>下载板卡配置文件</Button>
            </div>
            <Table id={"process_table"} dataSource={dataList} columns={columns} style={{ width: '100%' }}
                pagination={{ pageSize: 7, hideOnSinglePage: true, total: total }}
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
                        setModalData({
                            open: false,
                            mode: "create"
                        });
                        if (newTest) refreshDataList()
                    }}
                    testId={modalData.testId}

                    key={modalData.keyValue}
                />
            </CreateTestContext.Provider>
        </Flex>
    );
}

export default TestProcessPage;