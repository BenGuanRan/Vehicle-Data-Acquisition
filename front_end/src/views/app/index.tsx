import { ROUTES_MAP } from '@/routes'
import { Route, Routes } from 'react-router-dom'

function App() {

    return (
        <Routes>
            {
                ROUTES_MAP.map(({ path, rfc, name }) => <Route key={name} path={path} element={rfc}></Route>)
            }
        </Routes>
    )
}

export default App
