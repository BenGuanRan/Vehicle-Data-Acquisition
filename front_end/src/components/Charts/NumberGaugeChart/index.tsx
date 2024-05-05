import * as echarts from "echarts"
import {useEffect, useMemo, useRef, useState} from "react"

const NumberGaugeChart: React.FC<{
    min: number
    max: number
    startRequest: boolean
    requestSignalId: number | null
    unit: string
    title: string
    width: number
    height: number
    interval: number
}> = ({startRequest, requestSignalId, unit, title, width, height, interval, min, max}) => {

    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [value, setValue] = useState(0)
    const chartRef = useRef<echarts.ECharts | null>()
    const numberContainerRef = useRef<HTMLDivElement | null>(null)

    useMemo(() => {
        timerRef.current && clearInterval(timerRef.current)
        if (startRequest && requestSignalId !== null) {
            timerRef.current = setInterval(() => {
                setValue(Number((Math.random() * 100).toFixed(2)))
            }, interval)
        }
    }, [startRequest, interval])

    useEffect(() => {
        chartRef.current?.setOption({
            series: [
                {
                    data: [
                        {
                            value,
                            name: title
                        }
                    ]
                }
            ]
        });
    }, [value])

    useEffect(() => {
        chartRef.current = echarts.init(numberContainerRef.current)

        const option = {
            series: [
                {
                    type: 'gauge',
                    min,
                    max,
                    splitNumber: 10,
                    progress: {
                        show: true,
                        width: Math.min(height, width) / 25
                    },
                    axisLine: {
                        lineStyle: {
                            width: Math.min(height, width) / 25
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        length: Math.min(height, width) / 26,
                        lineStyle: {
                            width: 2,
                            color: '#999'
                        }
                    },
                    axisLabel: {
                        distance: Math.min(height, width) / 22,
                        color: '#999',
                        fontSize: Math.min(height, width) / 23
                    },
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: Math.min(height, width) / 22,
                        itemStyle: {
                            borderWidth: Math.min(height, width) / 30
                        }
                    },
                    title: {
                        offsetCenter: [0, '-120%'],
                        fontSize: Math.min(height, width) / 15
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: Math.min(height, width) / 18,
                        offsetCenter: [0, '70%'],
                        formatter: `{value} ${unit}`,
                        color: 'inherit'
                    },
                    data: [
                        {
                            value,
                            name: title
                        }
                    ]
                }
            ]
        };

        const resizeObserver = new ResizeObserver(() => {
            chartRef.current && chartRef.current.resize()
        })
        numberContainerRef.current && resizeObserver.observe(numberContainerRef.current)
        chartRef.current.setOption(option)

        return () => {
            resizeObserver.disconnect()
            chartRef.current?.dispose()
        }
    }, [unit, title, width, height, min, max])

    return <div ref={numberContainerRef} style={{
        width: '100%', height: '100%'
    }}></div>
}

export default NumberGaugeChart