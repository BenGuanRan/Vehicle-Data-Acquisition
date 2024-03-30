import {Flex, Input} from "antd";
import "./process_detail.css";
import MutiSelect from "@/views/demo/test_process/components/multi_select.tsx";
import React from "react";

const ProcessDetail: React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <Flex className={"full"} flex={1} align={"start"} vertical={true}>
            <Flex flex={1} vertical={true} justify={"space-around"}>
                <span>测试名称<Input placeholder="Test Title" style={{width: '50vw', marginLeft: '20px'}}/></span>
                <span>测试对象 <div style={{marginTop: '10px'}}><MutiSelect/></div></span>
                <span>测试类型 <div style={{marginTop: '10px'}}><MutiSelect/></div></span>
            </Flex>
            <Flex flex={2}>
                {children}
            </Flex>
        </Flex>
    )
}

export default ProcessDetail;