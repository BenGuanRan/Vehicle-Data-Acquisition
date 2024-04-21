import React from "react"
import {Navigate} from "react-router"
import userUtils from "@/utils/userUtils.ts";

const RequireAuthRoute: React.FC<React.PropsWithChildren> = ({children}) => {
    const token = userUtils.getToken()
    const lastTokenDate = userUtils.getUserLastLoginTime()


    if (!token || !lastTokenDate || Date.now() - parseInt(lastTokenDate) > 6 * 60 * 60 * 1000) {
        if (lastTokenDate && Date.now() - parseInt(lastTokenDate) > 6 * 60 * 60 * 1000) {
            userUtils.removeUserInfo()
        }
        console.log("token不存在或者token过期")
        return <Navigate to="/login"></Navigate>
    }
    //如果存在 则渲染标签中的内容
    return children
}

export default RequireAuthRoute