///TODO: 采集指标项目选择
import {CollectorSignalFormat, TestObjectsFormat} from "@/apis/standard/test.ts";
import {useContext} from "react";
import {CreateTestContext} from "@/views/demo/test_process/test_modal/CreateTestFunction.ts";
import {COLLECT_SIGNAL, TEST_OBJECT} from "@/constants/name.ts";
import NewBoardSelect from "@/views/demo/test_process/test_modal/signal/Select.tsx";
import {Modal} from "antd";

export const CollectorSignalItem = ({signal}: { signal: CollectorSignalFormat }) => {
    const createTestObject = useContext(CreateTestContext)
    const [modal, contextHolder] = Modal.useModal();


    return (
        <div className={"signal-item"
            + (createTestObject.currentSignal?.formatId === signal.formatId ? " selected" : "")
        } onClick={() => {
            createTestObject.switchCollectorSignal(signal)
        }}>
            <b style={{display: "inline"}}>{signal.collectorSignalName}</b>
            <button className={"delete-button"} onClick={() => {
                modal.confirm({
                    title: '删除采集指标',
                    content: '确定删除采集指标吗？',
                    onOk: () => {
                        createTestObject.deleteCollectorSignal(signal.formatId)
                    },
                    onCancel: () => {
                        console.log('Cancel delete signal');
                    },
                });
            }}>删除采集指标
            </button>
            {contextHolder}
        </div>
    )
}

///TODO: 采集对象指标配置
export const CollectorSignalSelect = () => {
    const createTestObject = useContext(CreateTestContext)

    const currentObject = createTestObject.testObjects.find((e: TestObjectsFormat) => e.formatId === createTestObject.currentSignal?.fatherFormatId)?.objectName
    const currentSignal = createTestObject.currentSignal ? createTestObject.currentSignal.collectorSignalName : ""


    if (!createTestObject.currentSignal) {
        return <div style={{padding: '10px', fontSize: '16px', color: 'red'}}>请先选择一个采集指标</div>
    }

    return (
        <section style={{padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px', height: '100%'}}>
            <p style={{marginBottom: '5px', fontSize: '16px'}}>当前{TEST_OBJECT}:<span
                style={{color: 'blue'}}>{currentObject}</span></p>
            <p style={{marginBottom: '5px', fontSize: '16px'}}>当前{COLLECT_SIGNAL}:<span
                style={{color: 'blue'}}>{currentSignal}</span></p>

            <article style={{display: 'flex', justifyContent: 'space-between'}}>
                <NewBoardSelect/>
            </article>
        </section>
    )
}

