import React from 'react';
import './index.css';
import { Flex, FloatButton, Input, message, Modal } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { HomeMenu } from "@/views/demo/IndexMenu.tsx";
import {
    EditOutlined,
    LoginOutlined, UserOutlined
} from "@ant-design/icons";
import UserUtils from "@/utils/UserUtils.ts";
import { logout } from "@/apis/request/auth.ts";
import { changePassword } from "@/apis/request/user.ts";
import { SUCCESS_CODE } from "@/constants";
import userUtils from "@/utils/UserUtils.ts";


const SystemTotalPage: React.FC = () => {
    const [open, setOpen] = React.useState(false);

    const [modalApi, modalHandler] = Modal.useModal()
    const navigate = useNavigate()

    const switchOpen = () => {
        setOpen(open => !open)
    }

    return (
        <Flex className={"screen_max"} flex={1} align={"start"} vertical={false}>
            <HomeMenu />
            <div style={{
                width: '85vw',
                height: '100vh',
            }}>
                <Outlet />
            </div>
            {
                <>
                    <FloatButton.Group
                        open={open}
                        trigger="click"
                        style={{ right: 24 }}
                        icon={<UserOutlined />}
                        onClick={switchOpen}
                    >

                        <FloatButton icon={<LoginOutlined style={{ color: "red" }} />} tooltip={"退出"} onClick={() => {
                            if (window.confirm("确定退出登录吗？"))
                                logout().then(() => {
                                    userUtils.removeUserInfo()
                                    navigate('/login')
                                })
                        }} />
                        {modalHandler}
                        {UserUtils.isRootUser() && <FloatButton icon={<EditOutlined />} tooltip={"修改密码"} onClick={() => {
                            modalApi.confirm({
                                title: "修改密码",
                                content: <div>
                                    <Input type="password" placeholder={"请输入新密码"} id={"newPass"} />
                                    <Input type="password" placeholder={"请再次输入新密码"} id={"confirmPass"} style={{
                                        marginTop: 10
                                    }} />
                                </div>,
                                onOk: () => {
                                    const newPass = document.getElementById("newPass") as HTMLInputElement
                                    const confirmPass = document.getElementById("confirmPass") as HTMLInputElement
                                    if (newPass.value !== confirmPass.value) {
                                        message.error("两次输入密码不一致")
                                        return false
                                    }
                                    changePassword({ password: newPass.value }).then((response) => {
                                        if (response.code === SUCCESS_CODE) {
                                            message.success("修改成功")
                                            navigate('/login')
                                        } else {
                                            message.error(response.msg)
                                        }
                                    })
                                }
                            })
                        }} />}
                    </FloatButton.Group>
                </>
            }
        </Flex>
    );
};

export default SystemTotalPage;