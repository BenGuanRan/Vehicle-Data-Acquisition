import { my_router } from '@/routes'
import { RouterProvider } from 'react-router-dom'

function MyApp() {

    return (
        <RouterProvider router={my_router} />
    )
}

export default MyApp

