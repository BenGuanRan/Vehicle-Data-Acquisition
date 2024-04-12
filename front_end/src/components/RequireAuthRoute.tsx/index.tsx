import React from "react"
import {Navigate} from "react-router"
import tokenUtils from "@/utils/tokenUtils.ts";

const RequireAuthRoute: React.FC<React.PropsWithChildren> = ({children}) => {
    const token = tokenUtils.getToken()
    const lastTokenDate = tokenUtils.getTokenLastDate()

    if (!token || !lastTokenDate || Date.now() - parseInt(lastTokenDate) > 6 * 60 * 60 * 1000) {
        if (lastTokenDate && Date.now() - parseInt(lastTokenDate) > 6 * 60 * 60 * 1000) {
            tokenUtils.removeToken()
        }
        return <Navigate to="/login"></Navigate>
    }
    //如果存在 则渲染标签中的内容
    return children
}

export default RequireAuthRoute