import React from "react"
import {Navigate} from "react-router"

const RequireAuthRoute: React.FC<React.PropsWithChildren> = ({children}) => {
    //获取到locationStorage中的token
    const token = localStorage.getItem('token')

    //获取location
    if (!token) {
        return <Navigate to="/login"></Navigate>
    }
    //如果存在 则渲染标签中的内容
    return children
}

export default RequireAuthRoute