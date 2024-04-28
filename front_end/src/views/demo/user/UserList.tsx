import type {TableProps} from 'antd';
import Search from "antd/es/input/Search";
import {SubUser} from "@/apis/standard/user.ts"
import {Button, Form, Input, Modal, Switch, Table} from "antd";
import React, {useEffect, useRef} from "react";
import {userListData} from "@/views/demo/user/UserListData.ts";
import Managements from "@/views/demo/user/UserManagements.tsx";
import {useUserActions} from "@/views/demo/user/UserFunction.ts";


const UserManage: React.FC = () => {
    const [currentSearchValue, setCurrentSearchValue] = React.useState<string>("")
    const [open, setOpen] = React.useState(false);
    const hasGetUserListData = useRef(false);

    const {
        data,
        getUserListData,
        onOpen,
        onClose,
        onDelete,
        onCreate,
        onReset,
        contextHolder
    } = useUserActions(userListData);

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
                return <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={!record.disabled}
                               onClick={
                                   record.disabled ? () => onOpen(record) : () => onClose(record)
                               }/>
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => {

                return <Managements
                    user={record}
                    onDelete={onDelete} onReset={onReset}/>
            }
        }
    ];


    useEffect(() => {
        getUserListData(currentSearchValue);
        hasGetUserListData.current = true;
    }, [currentSearchValue])

    return (
        <div style={{padding: "20px"}}>
            {contextHolder}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px"
            }}>
                <Search placeholder="input search text" enterButton size={"large"} onSearch={(value) => {
                    setCurrentSearchValue(value)
                }}
                        style={{width: "300px"}}
                />
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

