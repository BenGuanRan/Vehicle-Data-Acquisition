import React, { useEffect, useState } from "react"
import { Navigate } from "react-router"
import userUtils from "@/utils/UserUtils.ts";
import { Watermark } from "antd";

const RequireAuthRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
    const token = userUtils.getToken()
    const [content, setContent] = useState('车辆装备数据采集系统')
    useEffect(() => {
        setContent(!userUtils.isRootUser() ? userUtils.getUserInfo()?.username || '车辆装备数据采集系统' : '')
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