import Login from "@/views/login"
import RequirAuthRoute from "../components/RequireAuthRoute.tsx/index.tsx"
import SystemTotalPage from "@/views/demo";
import TestProcessPage from "@/views/demo/test_process/TestProcess.tsx";
import DataDisplay from "@/views/demo/data_display/display.tsx";
import PhyTopology from "@/views/demo/topology/PhyTopology.tsx";
import { createBrowserRouter } from "react-router-dom";
import UserManage from "@/views/demo/user/UserList.tsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


export const my_router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {

        path: "/",
        element: <RequirAuthRoute><SystemTotalPage /></RequirAuthRoute>,
        children: [
            {
                index: true,
                path: "/process-management",
                element: <TestProcessPage />
            },
            {
                path: "/data-display",
                element: <DndProvider backend={HTML5Backend}>
                    <DataDisplay />
                </DndProvider>
            },
            {
                path: "/physical-topology",
                element: <PhyTopology />
            },
            {
                path: "/user-management",
                element: <UserManage />
            }
        ]
    }
]
)