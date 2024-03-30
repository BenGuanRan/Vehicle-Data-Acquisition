import {IRoute} from "@/routes";
import {Route} from "react-router-dom";

export default function renderRoutes(routes: IRoute[]) {
    return routes.map(({path, rfc, name, children}) => (
        <Route key={name} path={path} element={rfc}>
            {children && renderRoutes(children)}
        </Route>
    ));
}