import React from 'react';
import './index.css';
import {Flex, Menu, MenuProps} from "antd";
import {NavigateFunction, Outlet,  useNavigate} from "react-router-dom";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const itemList = [
    {
        key: '/process-management',
        label: '测试流程管理',
    },
    {
        key: '/data-display',
        label: '测试数据展示',
    },
    {
        key: '/physical-topology',
        label: '物理拓扑配置',
    },
]


const items: MenuProps['items'] = [
    getItem('车辆信息采集系统', 'grp', null,
        itemList.map((item) => getItem(item.label, item.key)), 'group')
];

const SystemTotalPage: React.FC = () => {
    const navigate: NavigateFunction = useNavigate()
    const onClick: MenuProps['onClick'] = (e) => {
        navigate(e.key as string)
    };

    return (
        <Flex className={"screen_max"} flex={1} align={"start"} vertical={false}>
            <Menu
                onClick={onClick}
                style={{width: '15vw', height: '100vh'}}
                defaultSelectedKeys={[window.location.pathname]}
                mode="inline"
                items={items}
            />
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