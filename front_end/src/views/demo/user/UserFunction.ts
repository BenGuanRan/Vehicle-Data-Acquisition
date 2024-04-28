import {useCallback, useReducer} from 'react';
import {SubUser} from "@/apis/standard/user.ts"
import {changePassword, closeUser, createUser, deleteUser, getUserList, openUser} from "@/apis/request/user.ts";
import {message} from "antd";
import {SUCCESS_CODE} from "@/constants";

export const useUserActions = (initialState: SubUser[]) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useReducer(userReducer, initialState);

    /// TODO:获取用户列表
    const getUserListData = useCallback((searchValue: string) => {
        setData({type: CLEAR_USER, payload: {id: 0, username: "", disabled: false}});
        getUserList(1, undefined, searchValue).then((e) => {
            if (e.code === SUCCESS_CODE) {
                messageApi.success(e.msg);
                e.data.list.forEach((item: SubUser) => {
                    setData({type: CREATE_USER, payload: item});
                })
            } else {
                messageApi.error(e.msg);
            }
        })

    }, [messageApi])

    // TODO:开启用户
    const onOpen = useCallback((record: SubUser) => {
        openUser({childUserId: record.id})
            .then((e) => {
                console.log(e)
                if (e.code === SUCCESS_CODE) {
                    setData({type: OPEN_USER, payload: record});
                    messageApi.success(e.msg);
                } else {
                    messageApi.error(e.msg);
                }
            })
    }, [messageApi]);

    // TODO:关闭用户
    const onClose = useCallback((record: SubUser) => {
        closeUser({childUserId: record.id})
            .then((e) => {
                if (e.code === SUCCESS_CODE) {
                    setData({type: CLOSE_USER, payload: record});
                    messageApi.success(e.msg);
                } else {
                    messageApi.error(e.msg);
                }
            })
        setData({type: CLOSE_USER, payload: record});
    }, [messageApi]);

    // TODO:删除用户
    const onDelete = useCallback((record: SubUser) => {
        deleteUser({childUserId: record.id})
            .then((e) => {
                if (e.code === SUCCESS_CODE) {
                    setData({type: DELETE_USER, payload: record});
                    messageApi.success(e.msg);
                } else {
                    messageApi.error(e.msg);
                }
            })
    }, [messageApi]);

    // TODO:创建用户
    const onCreate = useCallback((newUser: { childUsername: string, childPassword: string }) => {
        createUser(newUser).then((e) => {
            if (e.code === SUCCESS_CODE) {
                messageApi.success(e.msg);
                setData({
                    type: CREATE_USER, payload: {
                        id: e.data.userId,
                        username: e.data.username,
                        disabled: false
                    }
                });
            } else {
                messageApi.error(e.msg);
            }
        })
    }, [messageApi]);

    // TODO:修改用户密码
    const onReset = useCallback((record: SubUser) => {
        const test = window.prompt("请输入新密码")
        //如果test为null或者空字符串，说明用户点击了取消按钮
        if (test === null || test === "") {
            return
        }
        changePassword({childUserId: record.id, password: test}).then((e) => {
            if (e.code === SUCCESS_CODE) {
                messageApi.success(e.msg);
                alert("密码修改成功")
            } else {
                messageApi.error(e.msg);
            }
        })
    }, [])

    return {data, getUserListData, onOpen, onClose, onDelete, onCreate, onReset, contextHolder};
};


const OPEN_USER = 'OPEN_USER';
const CLOSE_USER = 'CLOSE_USER';
const DELETE_USER = 'DELETE_USER';
const CREATE_USER = 'CREATE_USER';
const CLEAR_USER = 'CLEAR_USER';
const userReducer = (state: SubUser[], action: { type: string, payload: SubUser }) => {
    switch (action.type) {
        case OPEN_USER:
            return state.map(user =>
                user.id === action.payload.id ? {...user, disabled: false} : user
            );
        case CLOSE_USER:
            return state.map(user =>
                user.id === action.payload.id ? {...user, disabled: true} : user
            );
        case DELETE_USER:
            return state.filter(user => user.id !== action.payload.id);
        case CREATE_USER:
            return [...state, action.payload];
        case CLEAR_USER:
            return [];
        default:
            return state;
    }
};
