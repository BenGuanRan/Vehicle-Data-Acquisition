import { useRef } from "react"
import { useDrag } from 'react-dnd'
import './index.css'
import { DragItemType } from "../display"
import { v4 as uuid } from "uuid"

export interface IBooleanChartExtra {
    defaultTrueLabel: string,
    defaultFalseLabel: string,
}

export interface INumberChartExtra {
    defaultUnit: string
    defaultMin: number
    defaultMax: number
}

export interface ILineChartExtra {
    defaultDuring: number
    defaultLabel: string
}

export interface IDraggleComponent {
    type: DragItemType,
    draggleConfig: {
        defaultTitle: string
        defaultX: number
        defaultY: number
        defaultWidth: number
        defaultHeight: number
        defaultInterval: number
        extra: IBooleanChartExtra | INumberChartExtra | ILineChartExtra
    }
}

const DraggableComponent: React.FC<IDraggleComponent> = ({ type, draggleConfig }) => {
    const ref = useRef<HTMLDivElement>(null)

    const [, drag] = useDrag<{ id: string } & IDraggleComponent>({
        type: 'box',
        item: {
            id: uuid(),
            type,
            draggleConfig
        }
    })
    drag(ref)

    return <div className="dcm_container" ref={ref}>
        {{
            [DragItemType.BOOLEAN]: <div className="dcm_inner--boolean"></div>,
            [DragItemType.LINE]: <div className="dcm_inner--line"></div>,
            [DragItemType.NUMBER]: <div className="dcm_inner--number"></div>,
        }[type]}
    </div>
}

export default DraggableComponent