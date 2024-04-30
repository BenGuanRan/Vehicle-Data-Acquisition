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
}

export interface IDraggleComponent {
    type: DragItemType,
    draggleConfig: {
        defaultTitle: string
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
        {type}
    </div>
}

export default DraggableComponent