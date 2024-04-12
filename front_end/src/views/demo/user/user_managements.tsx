import React from "react";
import {Button} from "antd";

interface ManagementsProps {
    onOpen: () => void,
    onClose: () => void,
    onDelete: () => void
}

const Managements: React.FC<ManagementsProps> = ({onOpen, onClose, onDelete}) => {
    return (
        <div>
            <Button type="primary" style={{marginRight: "10px"}} onClick={onOpen}>Open</Button>
            <Button type="primary" style={{marginRight: "10px"}} onClick={onClose}>Close</Button>
            <Button type="primary" danger onClick={onDelete}>Delete</Button>
        </div>
    )
}

export default Managements;
