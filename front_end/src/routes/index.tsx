import Login from "@/views/login"
import RequirAuthRoute from "../components/RequireAuthRoute.tsx/index.tsx"
import SystemTotalPage from "@/views/demo";
import TestProcessPage from "@/views/demo/test_process/TestProcess.tsx";
import DataDisplay from "@/views/demo/data_display/display.tsx";
import PhyTopology from "@/views/demo/topology/PhyTopology.tsx";
import {createBrowserRouter, Outlet} from "react-router-dom";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {ReactElement} from "react";
import userUtils from "@/utils/UserUtils.ts";
import UserManage from "@/views/demo/user/UserList.tsx";

interface RouteItem {
    key: string
    label: string
    element?: ReactElement,
    children?: RouteItem[]
}

export const routeItems: RouteItem[] = [
    {
        //测试预配置
        key: '/test-config',
        label: '测试预配置',
        element: <Outlet/>,
        children: [
            {
                key: '/test-config/test-vehicle',
                label: '车辆管理',
                element: <p>车辆管理</p>
            },
            {
                key: '/test-config/test-config',
                label: '测试项目',
                element: <p>测试预1111111111111111111111111111111111111111111111111111配置</p>
            },
            {
                key: '/test-config/test-object',
                label: '测试模板',
                element: <p>测试对象</p>
            },
        ]
    },
    {
        key: '/process-management',
        label: '测试配置生成管理',
        element: <TestProcessPage/>
    },
    {
        key: '/data-display',
        label: '测试数据接收展示',
        element: <DndProvider backend={HTML5Backend}>
            <DataDisplay/>
        </DndProvider>
    },
    {
        key: '/physical-topology',
        label: '测试板卡信息管理',
        element: <PhyTopology/>
    },
    userUtils.isRootUser() ? {
        key: '/user-management',
        label: '用户管理',
        element: <UserManage/>
    } : {
        key: '', label: '', element: <></>
    }
].filter(item => item.key !== '')


export const my_router = createBrowserRouter([
        {
            path: "/login",
            element: <Login/>,
        },
        {
            path: "/",
            element: <RequirAuthRoute><SystemTotalPage/></RequirAuthRoute>,
            children: routeItems.map(item => ({
                path: item.key,
                element: item.element,
                children: item.children?.map(child => ({
                    path: child.key,
                    element: child.element
                })),
            })),
        }
    ]
)