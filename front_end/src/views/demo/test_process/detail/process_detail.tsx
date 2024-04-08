import {Button, Flex, Form, Input} from "antd";
import "./process_detail.css";
import MutiSelect from "@/views/demo/test_process/components/multi_select.tsx";
import React, {useEffect} from "react";
import {Outlet, useParams} from "react-router-dom";
import '../../../../mock/mockApi.ts'
import {getTestDetail} from "@/apis/request/test.ts";
import {indexOptions, targetOptions} from "@/views/demo/test_process/components/muti_select_data.ts";
import {useForm} from "antd/es/form/Form";

// Process interface

//传入一个form和children
const ProcessDetail: React.FC = () => {
    const {id} = useParams();
    const [form] = useForm();
    const onSubmit = () => {
        form.validateFields().then((values) => {
            console.log(values);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        if (id) {
            getTestDetail(id).then((res) => {
                console.log(res['data']);
                form.setFieldsValue(res.data);
            }).catch((error) => {
                console.log(error);
            })
        }
    }, [form, id]);


    return (
        <Flex id={"process_detail"} align={"start"} vertical={true}>
            <Form style={{
                flex: 1,
                width: '100%',
                padding: '20px',
                flexDirection: 'row',
            }} form={form}>
                <Form.Item label="测试名称" name="title">
                    <Input placeholder="Test Title"/>
                </Form.Item>
                <Form.Item label="测试对象" name="equipment_number">
                    <MutiSelect options={targetOptions}/>
                </Form.Item>
                <Form.Item label="测试类型" name="equipment_category">
                    <MutiSelect options={indexOptions}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={onSubmit}>确定</Button>
                </Form.Item>
            </Form>

            <div style={{
                flex: 2,
                width: '100%',
                border: '1px solid black',
                paddingRight: '20px',
            }}>
                <Outlet/>
            </div>
        </Flex>
    )
}

export default ProcessDetail;