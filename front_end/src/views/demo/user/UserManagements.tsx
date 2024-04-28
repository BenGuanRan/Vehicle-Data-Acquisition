import React from "react";
import {Button, Input, message, Modal} from "antd";
import {SubUser} from "@/apis/standard/user.ts";
import {changePassword} from "@/apis/request/user.ts";
import {SUCCESS_CODE} from "@/constants";

interface ManagementsProps {
    user: SubUser,
    onDelete: (subUser: SubUser) => void,
    onReset: (subUser: SubUser) => void
}

const Managements: React.FC<ManagementsProps> = ({user, onDelete, onReset}) => {
    const [modal, contextHolder] = Modal.useModal();
    const [pwModal, setPwModal] = React.useState(false);

    const confirmDel = () => {
        modal.confirm({
            title: '删除子用户',
            content: '确定删除子用户吗？',
            onOk: () => {
                onDelete(user)
            },
            onCancel: () => {
                console.log('Cancel delete user');
            },
        });
    }

    //确认操作
    return (
        <div>
            <Button type="primary" style={{marginRight: "10px"}} onClick={() => {
                setPwModal(true)
            }}>更改子用户密码</Button>

            <ResetPwModal
                user={user}
                open={pwModal}
                onReset={(subUser: SubUser) => {
                    onReset(subUser)
                    setPwModal(false)
                }}
                onFinished={() => {
                    setPwModal(false)
                }}
            />

            {contextHolder}

            <Button type="primary" danger onClick={() => {
                confirmDel()
            }}>删除子用户</Button>
        </div>
    )
}

//更改子用户密码Modal
const ResetPwModal = (({user, open, onFinished}: {
    user: SubUser,
    open: boolean,
    onReset: (subUser: SubUser) => void,
    onFinished: () => void
}) => {

    const [messageApi, contextHolder] = message.useMessage();
    let [newPassword, setNewPassword] = React.useState("")
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value)
    }

    const reset = async () => {
        const response = await changePassword({childUserId: user.id, password: newPassword})
        console.log(response)
        if (response.code === SUCCESS_CODE) {
            messageApi.success(response.msg);
            setNewPassword("")
            onFinished()
        } else {
            messageApi.error(response.msg);
        }
    }

    return (
        <Modal title="更改子用户密码" open={open} onOk={async () => {
            await reset()
        }} onCancel={() => {
            setNewPassword("")
            onFinished()
        }}>
            {contextHolder}
            <Input.Password placeholder="New Password" onChange={handleChange}/>
        </Modal>
    )
})

export default Managements;
