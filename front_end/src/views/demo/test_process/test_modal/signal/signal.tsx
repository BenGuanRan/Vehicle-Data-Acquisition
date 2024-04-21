///TODO: 采集指标项目选择
import {CollectorSignalFormat, TestObjectsFormat} from "@/apis/standard/test.ts";
import React, {useContext} from "react";
import {CreateTestContext} from "@/views/demo/test_process/test_modal/create_test_function.ts";
import {
    BOARD_CARD_SELECTION,
    COLLECT_BOARD_CARD_SELECTION, COLLECT_BOARD_SIGNAL_RELATION,
    COLLECT_SIGNAL,
    CORE_BOARD_CARD_SELECTION,
    TEST_OBJECT
} from "@/constants/name.ts";

export const CollectorSignalItem = ({signal}: { signal: CollectorSignalFormat }) => {
    const createTestObject = useContext(CreateTestContext)

    return (
        <div className={"signal-item"} onClick={() => {
            createTestObject.switchCollectorSignal(signal)
        }}>
            <b style={{display: "inline"}}>{signal.collectorSignalName}</b>
            <button className={"delete-button"} onClick={() => {
                createTestObject.deleteCollectorSignal(signal.formatId)
            }}>删除采集指标
            </button>
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
            <header style={{marginBottom: '10px', fontSize: '20px', fontWeight: 'bold'}}>核心板卡设置</header>

            <p style={{marginBottom: '5px', fontSize: '16px'}}>当前{TEST_OBJECT}:<span
                style={{color: 'blue'}}>{currentObject}</span></p>
            <p style={{marginBottom: '5px', fontSize: '16px'}}>当前{COLLECT_SIGNAL}:<span
                style={{color: 'blue'}}>{currentSignal}</span></p>

            <header style={{marginBottom: '5px', fontSize: '16px'}}>{BOARD_CARD_SELECTION}</header>
            <article style={{display: 'flex', justifyContent: 'space-between'}}>
                <BoardSelect boardName={CORE_BOARD_CARD_SELECTION} onClick={() => {
                    console.log("板卡1")
                }}/>
                <BoardSelect boardName={COLLECT_BOARD_CARD_SELECTION} onClick={() => {
                    console.log("板卡2")
                }}/>
                <BoardSelect boardName={COLLECT_BOARD_SIGNAL_RELATION} onClick={() => {
                    console.log("板卡3")
                }}/>
            </article>
        </section>
    )
}

interface BoardSelectProps {
    boardName: string
    onClick: () => void
}

///TODO: 板卡组件
export const BoardSelect = ({boardName, onClick}: BoardSelectProps) => {
    const [show, setShow] = React.useState(false)

    return (
        <div style={{position: "relative"}}>
            <div style={{
                display: show ? 'block' : 'none',
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: "absolute",
                top: '100%',
                left: '0',
            }}>
                <ul style={{listStyle: 'none', padding: '0', margin: '0'}}>
                    <li style={{padding: '10px', backgroundColor: '#ddd', borderRadius: '5px'}}>板卡1</li>
                    <li style={{padding: '10px', backgroundColor: '#ddd', borderRadius: '5px'}}>板卡2</li>
                    <li style={{padding: '10px', backgroundColor: '#ddd', borderRadius: '5px'}}>板卡3</li>
                </ul>
            </div>
            <div onClick={() => {
                onClick()
                setShow(!show)
            }}>
                <p style={{padding: '10px', backgroundColor: '#ddd', borderRadius: '5px'}}>{boardName}</p>
            </div>
        </div>
    )
}
