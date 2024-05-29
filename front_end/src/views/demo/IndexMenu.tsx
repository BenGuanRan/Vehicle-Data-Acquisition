import React, {useEffect, useState} from "react";
import {Form, Menu, MenuProps, Modal, Input} from "antd";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {logout} from "@/apis/request/auth.ts";
import {changePassword} from "@/apis/request/user.ts";
import {SUCCESS_CODE} from "@/constants";
import userUtils from "@/utils/UserUtils.ts";

export const HomeMenu = () => {
    const navigate: NavigateFunction = useNavigate()
    const [visible, setVisible] = React.useState(false)
    const [form] = Form.useForm()
    const [items, setItems] = useState([
        {
            key: '/process-management',
            label: '测试配置生成管理',
        },
        {
            key: '/data-display',
            label: '测试数据接收展示',
            // children: [
            //     {
            //         key: '/data-display/online',
            //         label: '在线数据接收',
            //     },
            //     {
            //         key: '/data-display/offline',
            //         label: '离线数据展示',
            //     },
            // ],
        },
        {
            key: '/physical-topology',
            label: '测试板卡信息管理',
        },
    ])

    useEffect(() => {
        if (userUtils.isRootUser())
            setItems([...items, {
                key: '/user-management',
                label: '用户管理',
            }])
    }, [])

    const onClick: MenuProps['onClick'] = (e) => {
        if (e.key !== 'avatar' && e.key !== 'logout' && e.key !== 'changePassword')
            navigate(e.key as string)
        else if (e.key === 'logout') {
            if (window.confirm("确定退出登录吗？"))
                logout().then(() => {
                    userUtils.removeUserInfo()
                    navigate('/login')
                })
        } else if (e.key === 'changePassword') {
            setVisible(true)
        }
    };

    const onFinish = async () => {
        const newPass = form.getFieldValue("newPassword")
        const confirmPass = form.getFieldValue("confirmPassword")

        console.log(newPass, confirmPass)

        if (newPass !== confirmPass) {
            alert("两次输入密码不一致")
            return
        }

        changePassword({password: newPass}).then((response) => {
            if (response.code === SUCCESS_CODE) {
                alert("修改成功")
            } else {
                alert(response.msg)
            }
        })
        setVisible(false)
    }

    return <>
        <Menu
            onClick={onClick}
            style={{width: '15vw', minHeight: '100vh', height: 'auto'}}
            defaultSelectedKeys={[window.location.pathname]}
            mode="inline"
            items={items}
        />

        <Modal open={visible} onOk={onFinish} onCancel={() => setVisible(false)}>
            <Form form={form} style={{width: '30vw'}}>
                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[{required: true, message: '请输入新密码'}]}
                >
                    <Input.Password placeholder="New Password" name="newPassword"/>
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    rules={[{required: true, message: '请确认输入新密码'}]}
                >
                    <Input.Password placeholder="Confirm Password" name="confirmPassword"/>
                </Form.Item>
            </Form>
        </Modal>
    </>
}