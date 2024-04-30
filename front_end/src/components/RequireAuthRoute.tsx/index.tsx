import React, { useEffect, useState } from "react"
import { Navigate } from "react-router"
import userUtils from "@/utils/UserUtils.ts";
import { Watermark } from "antd";

const RequireAuthRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
    const token = userUtils.getToken()
    const [content, setContent] = useState('')
    useEffect(() => {
        setContent(!userUtils.isRootUser() ? userUtils.getUserInfo()?.username || '请勿泄密' : '')
    }, [])
    if (!token) {
        return <Navigate to="/login"></Navigate>
    }
    //如果存在 则渲染标签中的内容
    return (
        <Watermark font={{ fontSize: 40, color: '#ececec67' }} content={content}>
            {children}
        </Watermark>
    )
}

export default RequireAuthRoute