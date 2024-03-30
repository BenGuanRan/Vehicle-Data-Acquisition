import {IRoute, ROUTES_MAP} from '@/routes'
import {Route, Routes} from 'react-router-dom'
import {Navigate} from "react-router";

function renderRoutes(routes: IRoute[]) {
    return routes.map(({path, rfc, name, children}) => (
        <Route key={name} path={path} element={rfc}>
            {children && renderRoutes(children)}
        </Route>
    ));
}

function App() {
    return (
        <Routes>
            {renderRoutes(ROUTES_MAP)}
            <Route path="*" element={<Navigate to="/process-management"/>}/>
        </Routes>
    )
}

export default App

