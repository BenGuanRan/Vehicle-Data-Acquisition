import Demo from "@/views/demo"
import Login from "@/views/login"
import RequirAuthRoute from "../components/RequireAuthRoute.tsx/index.tsx"

export interface IRoute {
    name: string,
    path: string,
    rfc: React.ReactElement

}

export const ROUTES_MAP: IRoute[] = [
    {
        name: 'demo',
        path: '/',
        rfc: <RequirAuthRoute><Demo /></RequirAuthRoute>
    },
    {
        name: 'demo',
        path: '/demo',
        rfc: <RequirAuthRoute><Demo /></RequirAuthRoute>
    },
    {
        name: 'login',
        path: '/login',
        rfc: <Login />
    }
]