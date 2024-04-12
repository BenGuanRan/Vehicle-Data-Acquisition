import React from 'react';
import {Form, Input, Button} from 'antd';
import './index.css';
import {useNavigate} from 'react-router-dom';
import {loginApi} from "@/apis/request/auth.ts";
import {loginParams} from "@/apis/standard/auth.ts";
import {throttle} from "@/utils";
import tokenUtils from "@/utils/tokenUtils.ts";

interface FormData {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate()

    const onLogin = async (data: loginParams) => {
        try {
            const response = await loginApi(data)
            console.log(response)
            if (response["code"] === 200 || response["data"] != null) {
                console.log(response["data"]["token"])
                tokenUtils.setToken(response["data"]["token"])
                navigate('/process-management', {replace: true})
            } else {
                alert(response["msg"])
            }
        } catch (error) {
            console.error(error)
        }
    }
    const onFinish = async (formData: FormData) => {
        console.log('Received values of form: ', formData)
        const data: loginParams = {
            username: formData.username,
            password: formData.password
        }
        await onLogin(data)
    };

    return (
        <div className="login-container">
            <div className="background-image"></div>
            <div className="login-content">
                <h1>车辆数据采集系统</h1>
                <Form
                    name="login-form"
                    onFinish={throttle(onFinish, 1000)}
                    initialValues={{remember: true}}
                >
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: 'Please input your username!'}]}
                    >
                        <Input placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please input your password!'}]}
                    >
                        <Input.Password placeholder="Password"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;

