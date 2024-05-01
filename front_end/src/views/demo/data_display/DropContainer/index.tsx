

import "./index.css";
import { DragItemType, IDragItem } from "../display";
import BooleanChart from "@/components/Charts/BooleanChart";
import NumberGaugeChart from "@/components/Charts/NumberGaugeChart";
import LineChart from "@/components/Charts/LineChart";


const DropContainer: React.FC<{ ifStartGetData: boolean, items: IDragItem[], selectFunc: Function, selectedItemId: string | null }> = ({ ifStartGetData, items, selectFunc, selectedItemId }) => {

    return <div className="dc_container" onClick={() => selectFunc(null)}>
        {
            items?.map((item) => {
                const { id, type, itemConfig: { requestSignalId, width, height, title, trueLabel, falseLabel, interval, unit, min, max, during, label } } = item
                return <div className="dc_item_container" key={id} onClick={(e) => {
                    e.stopPropagation()
                    if (selectedItemId === id)
                        selectFunc(null)
                    else
                        selectFunc(id)
                }} style={{ border: selectedItemId === id ? '1px solid #1677ff' : '1px solid transparent' }}>
                    {
                        {
                            [DragItemType.NUMBER]: <NumberGaugeChart startRequest={ifStartGetData} requestSignalId={requestSignalId} unit={unit || ''} title={title} width={width} height={height} interval={interval} min={min || 0} max={max || 100} />,
                            [DragItemType.BOOLEAN]: <BooleanChart startRequest={ifStartGetData} requestSignalId={requestSignalId} trueLabel={trueLabel || '是'} falseLabel={falseLabel || '否'} title={title} width={width} height={height} interval={interval} />,
                            [DragItemType.LINE]: <LineChart label={label || '数值'} startRequest={ifStartGetData} requestSignalId={requestSignalId} title={title} width={width} height={height} interval={interval} during={during || 1} />
                        }[type]

                    }
                </div>
            })
        }
    </div>
}

export default DropContainer