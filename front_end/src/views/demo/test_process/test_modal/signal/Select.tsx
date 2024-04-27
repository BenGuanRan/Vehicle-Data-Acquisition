import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Cascader, message} from 'antd';
import {getCollectorList, getControllerList, getSignalListByCollectorId} from "@/apis/request/test.ts";
import {ERROR_MSG, SUCCESS_CODE} from "@/constants";
import {CreateTestContext} from "@/views/demo/test_process/test_modal/CreateTestFunction.ts";
import {CollectorSignalFormat} from "@/apis/standard/test.ts";

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
    const getControllers = useCallback(() => {
        let newOptions: Option[] = [];
        getControllerList().then((res) => {
            if (res.code !== SUCCESS_CODE) {
                messageApi.error(res.msg + ERROR_MSG.NETWORK_ERROR);
                return;
            }

            newOptions = res.data.map((item: Format) => {
                return {
                    value: item.id,
                    label: item.name,
                    isLeaf: true,
                };
            });
            setControllerOptions(newOptions);
        });
    }, []);

    //获取采集器 - 采集项列表
    const getCollectors = useCallback(() => {
        let newOptions: Option[] = [];
        getCollectorList().then((res) => {
            if (res.code !== SUCCESS_CODE) {
                messageApi.error(res.msg + ERROR_MSG.NETWORK_ERROR);
                return;
            }

            newOptions = res.data.map((item: Format) => {
                return {
                    value: item.id,
                    label: item.name,
                    isLeaf: false,
                    children: [],
                } as Option;
            });

            newOptions.forEach((item, index) => {
                getSignalListByCollectorId(Number(item.value)).then((res) => {
                    newOptions[index].children = res.data.map((item: Format) => {
                        return {
                            value: item.id,
                            label: item.name,
                            isLeaf: true,
                        } as Option;
                    });
                });
            });

            setCollectOptions(newOptions);
        });
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

            <h3 style={{marginTop: 5}}>核心板卡设置</h3>
            <Cascader options={controllerOptions} onChange={onSelectController}
                      showSearch={{matchInputWidth: true}}
                      style={{width: '100%'}}
                      defaultValue={[
                          createTestObject.currentSignal?.controllerId,
                      ]}
                      changeOnSelect
            />

            <h3 style={{marginTop: 5}}>采集板卡-采集项设置</h3>
            <Cascader options={collectOptions} onChange={onChange}
                      style={{width: '100%'}}
                      defaultValue={[
                          createTestObject.currentSignal?.collectorId,
                          createTestObject.currentSignal?.signalId
                      ]}
                      changeOnSelect
            />
        </div>
    </>
};

export default NewBoardSelect;