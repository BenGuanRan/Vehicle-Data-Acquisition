import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Cascader, message} from 'antd';
import {getCollectorList, getControllerList, getSignalListByCollectorId} from "@/apis/request/test.ts";
import {ERROR_MSG, SUCCESS_CODE} from "@/constants";
import {CreateTestContext} from "@/views/demo/test_process/test_modal/CreateTestFunction.ts";

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

interface IBoardSelect {
    type: string
}

const NewBoardSelect: React.FC<IBoardSelect> = ({type}) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const createTestObject = useContext(CreateTestContext)

    //获取采集器列表
    const getCollectsAndController = useCallback(() => {
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
                    isLeaf: false,
                    children: [],
                };
            });

            getCollectorList().then((res) => {
                if (res.code !== SUCCESS_CODE) {
                    messageApi.error(res.msg + ERROR_MSG.NETWORK_ERROR);
                    return;
                }

                newOptions.forEach((item: Option) => {
                    item.children = res.data.map((e: Format) => {
                        return {
                            value: e.id,
                            label: e.name,
                            isLeaf: false,
                            children: [],
                        };
                    });
                });
                setOptions(newOptions)

                console.log(JSON.stringify(newOptions))
            });
        });
    }, []);


    const getSignalList = useCallback((collectorId: number) => {
        getSignalListByCollectorId(collectorId).then((res) => {
            if (res.code === SUCCESS_CODE) {
                messageApi.error(res.msg + ERROR_MSG.NETWORK_ERROR);
                return;
            }
            setOptions(res.data.map((item: any) => {
                return {
                    value: item.signalId,
                    label: item.signalName,
                    isLeaf: true,
                };
            }));
        });
    }, []);


    //获取核心、采集器列表
    useEffect(() => {
        getCollectsAndController();
    }, []);

    //获取信号采集
    useEffect(() => {
        if (createTestObject.currentSignal?.collectorId) {
            getSignalList(createTestObject.currentSignal.collectorId);
        }
    }, [createTestObject.currentSignal?.collectorId]);


    const onChange = (value: (string | number)[], selectedOptions: Option[]) => {
        console.log(value, selectedOptions);
    };

    const loadData = (selectedOptions: Option[]) => {
        if (selectedOptions.length <= 1) {
            return;
        }

        const targetOption = selectedOptions[selectedOptions.length - 1];

        getSignalListByCollectorId(Number(targetOption.value)).then((res) => {
            if (res.code !== SUCCESS_CODE) {
                messageApi.error(res.msg + ERROR_MSG.NETWORK_ERROR);
                return;
            }

            targetOption.children = res.data.map((item: any) => {
                return {
                    value: item.signalId,
                    label: item.signalName,
                    isLeaf: true,
                };
            });
            setOptions([...options]);
        });
    };

    return <>
        {contextHolder}
        <Cascader options={options} onChange={onChange} changeOnSelect showSearch={{
            matchInputWidth: true,
        }} loadData={loadData}
        />;
    </>
};

export default NewBoardSelect;