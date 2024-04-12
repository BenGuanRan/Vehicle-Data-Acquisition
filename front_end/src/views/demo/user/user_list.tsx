import type {TableProps} from 'antd';
import Search from "antd/es/input/Search";
import {SubUser} from "@/apis/standard/user.ts"
import {Button, Table} from "antd";
import React, {useEffect, useReducer} from "react";
import {user_list_data} from "@/views/demo/user/user_list_data.ts";
import Managements from "@/views/demo/user/user_managements.tsx";
import {ADD_USER, CLOSE_USER, DELETE_USER, OPEN_USER, userReducer} from "@/views/demo/user/user_manage_reducer.ts";

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
    }
];

export const UserManage: React.FC = () => {
    const [data, setData] = useReducer(userReducer, user_list_data);

    useEffect(() => {
        columns[3].render = (_, record) => {
            return <Managements onOpen={() => onOpen(record)} onClose={() => onClose(record)}
                                onDelete={() => onDelete(record)}/>
        }
    }, [])

    const onSearch = (value: string) => {
        console.log(value);
    }

    const onOpen = (record: SubUser) => {
        setData({type: OPEN_USER, payload: record});
    }

    const onClose = (record: SubUser) => {
        setData({type: CLOSE_USER, payload: record});
    }

    const onDelete = (record: SubUser) => {
        setData({type: DELETE_USER, payload: record});
    }

    const onAdd = (record: SubUser) => {
        setData({type: ADD_USER, payload: record});
    }

    return (
        <div style={{padding: "20px"}}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px"
            }}>
                <Search placeholder="input search text" enterButton size={"large"} onSearch={onSearch}
                        style={{width: "300px"}}/>
                <Button type="primary" size={"large"} onClick={() => onAdd({
                    id: data.length + 1,
                    username: "test",
                    disabled: false
                })}>Add</Button>
            </div>
            <Table columns={columns} dataSource={data} key={data.length} style={{marginTop: "20px"}} size={"middle"}
                   pagination={{pageSize: 10}} rowKey={(record) => record.id.toString()}/>

        </div>
    )
}

