import Login from "@/views/login"
import RequirAuthRoute from "../components/RequireAuthRoute.tsx/index.tsx"
import SystemTotalPage from "@/views/demo";
import TestProcessPage from "@/views/demo/test_process/test_process.tsx";
import DataDisplay from "@/views/demo/data_display/display.tsx";
import PhyTopology from "@/views/demo/topology/phy_topology.tsx";
import React from "react";
import ProcessDetail from "@/views/demo/test_process/detail/process_detail.tsx";

export interface IRoute {
    name: string,
    path: string,
    rfc?: React.ReactElement
    children?: IRoute[]
    redirect?: string
}

export const ROUTES_MAP: IRoute[] = [
    {
        name: 'total-page',
        path: '/',
        rfc: <RequirAuthRoute><SystemTotalPage/></RequirAuthRoute>,
        children: [
            {
                name: 'process-management',
                path: '/process-management',
                rfc: <TestProcessPage/>,
                children: [
                    {
                        //编辑
                        name: 'edit',
                        path: '/process-management/edit',
                        rfc: <ProcessDetail/>
                    },
                    {
                        name: 'show',
                        path: '/process-management/show',
                        rfc: <ProcessDetail/>
                    }
                ]
            },
            {
                //测试数据展台
                name: 'data-display',
                path: '/data-display',
                rfc: <DataDisplay/>
            },
            {
                //物理拓扑配置
                name: 'physical-topology',
                path: '/physical-topology',
                rfc: <PhyTopology/>
            }
        ],
    },
    {
        name: 'login',
        path: '/login',
        rfc: <Login/>
    }
]