import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Cascader, message } from 'antd';
import { getCollectorList, getControllerList, getSignalListByCollectorId } from "@/apis/request/test.ts";
import { ERROR_MSG, SUCCESS_CODE } from "@/constants";
import { CreateTestContext } from "@/views/demo/test_process/test_modal/CreateTestFunction.ts";
import { CollectorSignalFormat } from "@/apis/standard/test.ts";

interface Option {
    value?: string | number | null;
    label: React.ReactNode;
    children?: Option[];
    isLeaf?: boolean;
}

interface Format {
    id: number;
    name: string;
}

const NewBoardSelect: React.FC = () => {
    const [controllerOptions, setControllerOptions] = useState<Option[]>([]);
    const [collectOptions, setCollectOptions] = useState<Option[]>([]);

    const [messageApi, contextHolder] = message.useMessage();
    const createTestObject = useContext(CreateTestContext)

    //获取采集器列表
    const getControllers = useCallback(async () => {
        let newOptions: Option[] = [];
        const response = await getControllerList()
        if (response.code !== SUCCESS_CODE) {
            messageApi.error(response.msg + ERROR_MSG.NETWORK_ERROR);
            return;
        }
        for (const datum of response.data) {
            newOptions.push({
                value: datum.id,
                label: datum.name,
                isLeaf: true,
            });
        }
        setControllerOptions(newOptions)
    }, []);

    //获取采集器 - 采集项列表
    const getCollectors = useCallback(async () => {
        const newOptions: Option[] = [];

        const collectResponse = await getCollectorList()
        if (collectResponse.code !== SUCCESS_CODE) {
            messageApi.error(collectResponse.msg + ERROR_MSG.NETWORK_ERROR);
            return;
        }

        for (const item of collectResponse.data) {
            const signalResponse = await getSignalListByCollectorId(item.id)
            if (signalResponse.code !== SUCCESS_CODE) {
                messageApi.error(signalResponse.msg + ERROR_MSG.NETWORK_ERROR);
                return;
            }
            const signalOptions = signalResponse.data.map((signal: Format) => {
                return {
                    value: signal.id,
                    label: signal.name,
                    isLeaf: true,
                };
            });
            newOptions.push({
                value: item.id,
                label: item.name,
                isLeaf: false,
                children: signalOptions
            });
        }

        setCollectOptions(newOptions);

    }, []);
    //设置控制id
    const updateAllId = (result: number[]) => {
        console.log("设置控制id:" + result)

        createTestObject.updateCollectorSignal({
            ...createTestObject.currentSignal,
            collectorId: result[0] ?? 0,
            signalId: result[1] ?? 0,
        } as CollectorSignalFormat)
        createTestObject.setCurrentSignal({
            ...createTestObject.currentSignal,
            collectorId: result[0] ?? 0,
            signalId: result[1] ?? 0,
        } as CollectorSignalFormat)

    };

    //获取核心、采集器列表
    useEffect(() => {
        //这里异步请求数据
        getControllers();
        getCollectors();
    }, []);

    //当选择采集项-采集列表的时候
    const onChange = (value: (string | number)[]) => {
        try {
            console.log("选择的值:" + value)
            updateAllId(value as number[])

        } catch (e) {
            console.log(e)
        }
    };

    //当选择控制器的时候
    const onSelectController = (value: (string | number)[]) => {
        console.log("选择的控制器:" + value)
        createTestObject.updateCollectorSignal({
            ...createTestObject.currentSignal,
            controllerId: value[0],
        } as CollectorSignalFormat)
        createTestObject.setCurrentSignal({
            ...createTestObject.currentSignal,
            controllerId: value[0],
        } as CollectorSignalFormat)
    }

    return <>
        {contextHolder}
        <div>
            <h3 style={{marginTop: 15}}>核心板卡设置</h3>
            <Cascader options={controllerOptions} onChange={onSelectController}
                      style={{width: '100%'}}
                      defaultValue={[
                          createTestObject.currentSignal?.controllerId,
                      ]}
                      key={createTestObject.currentSignal.controllerId}
                      disabled={createTestObject.isJustSee()}
            />

            <h3 style={{marginTop: 15}}>采集板卡-采集项设置</h3>
            <Cascader options={collectOptions} onChange={onChange}
                      style={{width: '100%'}}
                      defaultValue={[
                          createTestObject.currentSignal?.collectorId,
                          createTestObject.currentSignal?.signalId
                      ]}
                      key={createTestObject.currentSignal.collectorId + "" + createTestObject.currentSignal.signalId}
                      disabled={createTestObject.isJustSee()}
            />
        </div>
    </>
};

export default NewBoardSelect;