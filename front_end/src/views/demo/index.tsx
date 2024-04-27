import React from 'react';
import './index.css';
import {Flex, FloatButton} from "antd";
import {Outlet} from "react-router-dom";
import {HomeMenu} from "@/views/demo/IndexMenu.tsx";
import {
    EditOutlined,
    LoginOutlined, UserOutlined
} from "@ant-design/icons";
import UserUtils from "@/utils/UserUtils.ts";


const SystemTotalPage: React.FC = () => {
    const [open, setOpen] = React.useState(false);

    const switchOpen = () => {
        setOpen(open => !open)
    }

    return (
        <Flex className={"screen_max"} flex={1} align={"start"} vertical={false}>
            <HomeMenu/>
            <div style={{
                width: '85vw',
                height: '100vh',
            }}>
                <Outlet/>
            </div>
            {
                UserUtils.isRootUser() ? <>
                    <FloatButton.Group
                        open={open}
                        trigger="click"
                        style={{right: 24}}
                        icon={<UserOutlined/>}
                        onClick={switchOpen}
                    >
                        <FloatButton icon={<LoginOutlined style={{color: "red"}}/>} tooltip={"退出"}/>
                        <FloatButton icon={<EditOutlined/>} tooltip={"修改密码"}/>
                    </FloatButton.Group>
                </> : null
            }
        </Flex>
    );
};

export default SystemTotalPage;