import React from 'react';
import {Form, Input, Button} from 'antd';
import './index.css';
import {useNavigate} from 'react-router-dom';

interface FormData {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate()
    const onFinish = (formData: FormData) => {
        //设置token
        localStorage.setItem('token', `${formData.username}&-&${formData.password}`)
        navigate('/', {replace: true})
    };

    return (
        <div className="login-container">
            <div className="background-image"></div>
            <div className="login-content">
                <h1>车辆数据采集系统</h1>
                <Form
                    name="login-form"
                    onFinish={onFinish}
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

