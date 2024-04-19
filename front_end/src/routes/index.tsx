import Login from "@/views/login"
import RequirAuthRoute from "../components/RequireAuthRoute.tsx/index.tsx"
import SystemTotalPage from "@/views/demo";
import TestProcessPage from "@/views/demo/test_process/test_process.tsx";
import DataDisplay from "@/views/demo/data_display/display.tsx";
import PhyTopology from "@/views/demo/topology/phy_topology.tsx";
import {createBrowserRouter} from "react-router-dom";
import UserManage from "@/views/demo/user/user_list.tsx";


export const my_router = createBrowserRouter([
        {
            path: "/login",
            element: <Login/>,
        },
        {
            path: "/",
            element: <RequirAuthRoute><SystemTotalPage/></RequirAuthRoute>,
            children: [
                {
                    index: true,
                    path: "/process-management",
                    element: <TestProcessPage/>
                },
                {
                    path: "/data-display",
                    element: <DataDisplay/>
                },
                {
                    path: "/physical-topology",
                    element: <PhyTopology/>
                },
                {
                    path: "/user-management",
                    element: <UserManage/>
                }
            ]
        }
    ]
)