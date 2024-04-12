import type {TableProps} from 'antd';
import Search from "antd/es/input/Search";
import {SubUser} from "@/apis/standard/user.ts"
import {Button, Form, Input, Modal, Table} from "antd";
import React, {useEffect} from "react";
import {user_list_data} from "@/views/demo/user/user_list_data.ts";
import Managements from "@/views/demo/user/user_managements.tsx";
import {useUserActions} from "@/views/demo/user/user_function.ts";


const UserManage: React.FC = () => {
    const [open, setOpen] = React.useState(false);

    const {
        data,
        getUserListData,
        onOpen,
        onClose,
        onDelete,
        onCreate,
        onReset,
        contextHolder
    } = useUserActions(user_list_data);

    const [form] = Form.useForm();

    const columns: TableProps<SubUser>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
        },
        {
            title: 'Disabled',
            dataIndex: 'disabled',
            render: (_, record) => {
                return <span>{record.disabled ? "Disabled" : "Enabled"}</span>
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => {
                return <Managements onOpen={() => onOpen(record)} onClose={() => onClose(record)}
                                    onDelete={() => onDelete(record)} onReset={() => onReset(record)}/>
            }
        }
    ];

    const onSearch = (value: string) => {
        console.log(value);
    }

    useEffect(() => {
        getUserListData();
    }, [getUserListData])

    return (
        <div style={{padding: "20px"}}>
            {contextHolder}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px"
            }}>
                <Search placeholder="input search text" enterButton size={"large"} onSearch={onSearch}
                        style={{width: "300px"}}/>
                <Button type="primary" size={"large"} onClick={() => setOpen(true)}>Add</Button>
            </div>

            <Modal title="创建子用户" open={open} onOk={() => {
                onCreate({
                    childUsername: form.getFieldValue("username"),
                    childPassword: form.getFieldValue("password")
                });
                setOpen(false)
            }} onCancel={() => {
                setOpen(false)
            }}>
                <Form form={form} layout="vertical">
                    <Form.Item label="Username" name={"username"}>
                        <Input name="username"/>
                    </Form.Item>
                    <Form.Item label="Password" name={"password"}>
                        <Input name="password"/>
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={columns} dataSource={data} key={data.length} style={{marginTop: "20px"}} size={"middle"}
                   pagination={{pageSize: 10}} rowKey={(record) => record.id}/>
        </div>
    )
}

export default UserManage;

