import React from 'react';
import './index.css';
import {Flex, Form, Modal} from "antd";
import {Outlet} from "react-router-dom";
import {HomeMenu} from "@/views/demo/index_menu.tsx";


const SystemTotalPage: React.FC = () => {

    return (
        <Flex className={"screen_max"} flex={1} align={"start"} vertical={false}>
            <HomeMenu/>
            <Modal>
                <Form>

                </Form>
            </Modal>
            <div style={{
                width: '85vw',
                height: '100vh',
            }}>
                <Outlet/>
            </div>
        </Flex>
    );
};

export default SystemTotalPage;