import React from "react";
import {Button} from "antd";

interface ManagementsProps {
    onOpen: () => void,
    onClose: () => void,
    onDelete: () => void
    onReset: () => void
}

const Managements: React.FC<ManagementsProps> = ({onOpen, onClose, onDelete, onReset}) => {
    return (
        <div>
            <Button type="primary" style={{marginRight: "10px"}} onClick={onOpen}>开启权限</Button>
            <Button type="primary" style={{marginRight: "10px"}} onClick={onClose}>关闭权限</Button>
            <Button type="primary" style={{marginRight: "10px"}} onClick={onReset}>更改子用户密码</Button>
            <Button type="primary" danger onClick={onDelete}>删除子用户</Button>
        </div>
    )
}

export default Managements;
