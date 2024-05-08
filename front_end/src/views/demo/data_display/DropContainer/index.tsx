import "./index.css";
import {DragItemType, IDragItem} from "../display";
import BooleanChart from "@/components/Charts/BooleanChart";
import NumberGaugeChart from "@/components/Charts/NumberGaugeChart";
import LineChart from "@/components/Charts/LineChart";
import GridLayout from 'react-grid-layout';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React from "react";

const DropContainer: React.FC<{
    ifStartGetData: boolean,
    items: IDragItem[],
    selectFunc: Function,
    selectedItemId: string | null,
    onUpdateItems: (items: GridLayout.Layout) => void
}> = ({ifStartGetData, items, selectFunc, selectedItemId, onUpdateItems}) => {

    const currentId = React.useRef<string | null>(null)

    return <div className="dc_container" onClick={() => selectFunc(null)}>
        <GridLayout cols={30} rowHeight={40} width={1200} className="layout" isDraggable={!ifStartGetData}
                    isResizable={!ifStartGetData}
                    onResize={(layout, oldItem, newItem, placeholder, e, element) => {
                        console.log("onResize")
                        console.log(layout, oldItem, newItem, placeholder, e, element)
                        onUpdateItems(newItem)
                    }}
                    onDrop={(layout, item, e) => {
                        console.log("onDrop")
                        console.log(layout, item, e)
                        onUpdateItems(item)
                    }}
        >
            {
                items?.map((item) => {
                    const {
                        id,
                        type,
                        itemConfig: {
                            requestSignalId,
                            x,
                            y,
                            width,
                            height,
                            title,
                            trueLabel,
                            falseLabel,
                            interval,
                            unit,
                            min,
                            max,
                            during,
                            label
                        }
                    } = item


                    return <div className="dc_item_container" id={id} key={id}
                                // onClick={(e) => {
                                //     e.stopPropagation()
                                //     console.log("click")
                                //     if (selectedItemId === id)
                                //         selectFunc(null)
                                //     else
                                //         selectFunc(id)
                                //
                                // }}
                                style={{border: selectedItemId === id ? '1px solid #1677ff' : '1px solid transparent'}}
                                data-grid={{x: x, y: y, w: width / 30, h: height / 30, i: id}}
                                onMouseEnter={() => {
                                    currentId.current = id
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    selectFunc(id)
                                }}
                    >
                        {
                            {
                                [DragItemType.NUMBER]: <NumberGaugeChart startRequest={ifStartGetData}
                                                                         requestSignalId={requestSignalId}
                                                                         unit={unit || ''} title={title}
                                                                         width={width}
                                                                         height={height} interval={interval}
                                                                         min={min || 0} max={max || 100}/>,
                                [DragItemType.BOOLEAN]: <BooleanChart startRequest={ifStartGetData}
                                                                      requestSignalId={requestSignalId}
                                                                      trueLabel={trueLabel || '是'}
                                                                      falseLabel={falseLabel || '否'} title={title}
                                                                      width={width} height={height}
                                                                      interval={interval}/>,
                                [DragItemType.LINE]: <LineChart label={label || '数值'}
                                                                startRequest={ifStartGetData}
                                                                requestSignalId={requestSignalId} title={title}
                                                                width={width} height={height} interval={interval}
                                                                during={during || 1}/>
                            }[type]

                        }
                    </div>
                })
            }
        </GridLayout>
    </div>
}

export default DropContainer