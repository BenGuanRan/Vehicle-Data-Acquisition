import { useMemo, useRef, useState } from 'react'
import './index.css'

const BooleanChart: React.FC<{
    startRequest: boolean
    requestSignalId: number | null
    trueLabel: string
    falseLabel: string
    title: string
    width: number
    height: number
    interval: number
}> = ({ startRequest, requestSignalId, trueLabel, falseLabel, title, width, height, interval }) => {

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useMemo(() => {
        timerRef.current && clearInterval(timerRef.current)
        if (startRequest && requestSignalId !== null) {
            timerRef.current = setInterval(() => {
                setValue(Math.random() > 0.5)
            }, interval)
        }
    }, [startRequest, interval])

    const [value, setValue] = useState(false)
    return <div className="bc_container" style={{
        width:"100%",
        height:"100%",
    }}>
        <div className='bc_title'>{title}</div>
        <div className="bc_result" style={{ backgroundColor: value ? '#52c41a' : '#f5222d' }}>
            {value ? trueLabel : falseLabel}
        </div>
    </div>
}
export default BooleanChart